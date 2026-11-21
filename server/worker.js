import { handleRio } from './rio.js';

// Cada tabla: columnas permitidas (solo esas se guardan), orden, campos JSON y filtros.
// private: true  -> también el GET pide la clave de admin (datos de clientes, no son públicos).
// visible: true  -> el GET público solo devuelve filas con visible = 1 (el panel, con clave, ve todas).
const TABLES = {
  lugares: {
    table: 'lugares', order: 'tipo, nombre', json: ['tags', 'info'], filterable: ['tipo', 'categoria'], visible: true,
    cols: ['id', 'nombre', 'tipo', 'categoria', 'emoji', 'rating', 'color', 'tags', 'horario', 'tel', 'whatsapp', 'promo', 'carta', 'lat', 'lng', 'dir', 'desc', 'info', 'visible', 'cliente_id'],
  },
  eventos: {
    table: 'eventos', order: 'mes, dia', json: ['tags', 'info'], filterable: ['dia', 'mes'],
    // fecha / fecha_fin (AAAA-MM-DD): con fecha, el evento se oculta solo de la app cuando pasa el último día.
    cols: ['id', 'titulo', 'dia', 'mes', 'emoji', 'color', 'lugar', 'horario', 'tel', 'desc', 'info', 'tags', 'fecha', 'fecha_fin'],
  },
  servicios: {
    table: 'servicios', order: 'cat, nombre', json: [], filterable: ['cat'],
    cols: ['id', 'nombre', 'cat', 'emoji', 'info', 'horario', 'tel', 'color', 'urgente'],
  },
  mapa: {
    table: 'mapa_marcadores', order: 'cat, label', json: [], filterable: ['cat'],
    cols: ['id', 'label', 'cat', 'x', 'y'],
  },
  actividades: {
    table: 'actividades', order: 'tema, franja', json: [], filterable: ['tema', 'franja'],
    cols: ['id', 'tema', 'franja', 'emoji', 'titulo', 'desc', 'color'],
  },
  juegos: {
    table: 'juegos', order: 'categoria, nombre', json: ['instrucciones', 'datos'], filterable: ['categoria'],
    cols: ['id', 'categoria', 'nombre', 'desc', 'emoji', 'duracion', 'instrucciones', 'datos'],
  },
  // ---- Panel admin (privadas) ----
  clientes: {
    table: 'clientes', order: 'nombre', json: [], filterable: ['estado', 'cat'], private: true,
    cols: ['id', 'nombre', 'cat', 'rubro', 'contacto', 'whatsapp', 'estado', 'plan', 'precio', 'vence', 'desde', 'ultimo_pago', 'origen', 'notas', 'visible'],
  },
  pendientes: {
    table: 'pendientes', order: 'recibido DESC', json: ['datos', 'cambios'], filterable: ['tipo', 'origen'], private: true,
    cols: ['id', 'tipo', 'origen', 'recibido', 'datos', 'lugar_id', 'cambios', 'mensaje'],
  },
  notificaciones: {
    table: 'notificaciones', order: 'fecha, hora', json: [], filterable: ['estado', 'tema'], private: true,
    cols: ['id', 'estado', 'tema', 'cliente_id', 'titulo', 'texto', 'abre', 'cuando', 'fecha', 'hora', 'dia_semana', 'creada'],
  },
  manual: {
    table: 'manual', order: 'orden, titulo', json: [], filterable: [], private: true,
    cols: ['id', 'titulo', 'emoji', 'orden', 'resumen', 'cuerpo', 'actualizado'],
  },
  notas: {
    table: 'notas', order: 'hecha, recordar, creada DESC', json: [], filterable: ['cliente_id'], private: true,
    cols: ['id', 'texto', 'cliente_id', 'recordar', 'hecha', 'creada'],
  },
};

function parseJsonFields(row, fields) {
  const out = { ...row };
  for (const f of fields) {
    if (typeof out[f] === 'string') {
      try { out[f] = JSON.parse(out[f]); } catch { /* se deja como string si no es JSON */ }
    }
  }
  return out;
}

function stringifyJsonFields(body, fields) {
  const out = { ...body };
  for (const f of fields) {
    if (out[f] !== undefined && out[f] !== null && typeof out[f] !== 'string') {
      out[f] = JSON.stringify(out[f]);
    }
  }
  return out;
}

// Solo deja pasar columnas conocidas (evita que un nombre raro termine dentro del SQL).
function soloColumnas(body, cfg) {
  const out = {};
  for (const c of cfg.cols) if (Object.prototype.hasOwnProperty.call(body, c)) out[c] = body[c];
  return out;
}

const faltaColumna = (err) => /no such column/i.test(String(err && err.message));

async function listHandler(env, key, searchParams, admin) {
  const cfg = TABLES[key];
  const where = [];
  const binds = [];
  const filterParam = cfg.filterable.find((f) => searchParams.has(f));
  if (filterParam) {
    where.push(`${filterParam} = ?`);
    binds.push(searchParams.get(filterParam));
  }
  const conVisible = cfg.visible && !admin;
  // Eventos con fecha: la app solo recibe los que no pasaron (hora de Argentina, UTC-3).
  // Sin fecha (Todo el año, Temporada o cargados a mano) se muestran siempre.
  const conFecha = key === 'eventos';
  const filtraFecha = conFecha && !admin;
  const hoyAR = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 10);
  const armar = (completo) => {
    const w = [...where];
    const b = [...binds];
    if (completo && conVisible) w.push('COALESCE(visible, 1) = 1');
    if (completo && filtraFecha) {
      w.push("(fecha IS NULL OR fecha = '' OR COALESCE(NULLIF(fecha_fin, ''), fecha) >= ?)");
      b.push(hoyAR);
    }
    const orden = completo && conFecha
      ? "CASE WHEN fecha IS NULL OR fecha = '' THEN 1 ELSE 0 END, fecha, mes, dia"
      : cfg.order;
    return { sql: `SELECT * FROM ${cfg.table}${w.length ? ' WHERE ' + w.join(' AND ') : ''} ORDER BY ${orden}`, b };
  };
  let results;
  try {
    const q = armar(true);
    ({ results } = await env.DB.prepare(q.sql).bind(...q.b).all());
  } catch (err) {
    // Si todavía no se corrió una migración (falta "visible" o "fecha"), se responde como antes.
    if (!(conVisible || conFecha) || !faltaColumna(err)) throw err;
    const q = armar(false);
    ({ results } = await env.DB.prepare(q.sql).bind(...q.b).all());
  }
  return results.map((row) => parseJsonFields(row, cfg.json));
}

async function byIdHandler(env, id, admin) {
  const row = await env.DB.prepare('SELECT * FROM lugares WHERE id = ?').bind(id).first();
  if (!row) return null;
  if (!admin && row.visible !== undefined && row.visible !== null && Number(row.visible) === 0) return null;
  return parseJsonFields(row, ['tags', 'info']);
}

function isAdmin(request, env) {
  const k = request.headers.get('X-Admin-Key');
  return !!k && !!env.ADMIN_KEY && k === env.ADMIN_KEY;
}

async function createRow(env, key, body) {
  const cfg = TABLES[key];
  const clean = soloColumnas(stringifyJsonFields(body, cfg.json), cfg);
  const columns = Object.keys(clean);
  if (!columns.length) throw new Error('Sin datos para guardar');
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map((c) => clean[c]);
  const sql = `INSERT INTO ${cfg.table} (${columns.join(', ')}) VALUES (${placeholders})`;
  await env.DB.prepare(sql).bind(...values).run();
  return { ok: true };
}

async function updateRow(env, key, id, body) {
  const cfg = TABLES[key];
  const clean = soloColumnas(stringifyJsonFields(body, cfg.json), cfg);
  delete clean.id; // el ID no se cambia
  const columns = Object.keys(clean);
  if (!columns.length) return { ok: true };
  const setClause = columns.map((c) => `${c} = ?`).join(', ');
  const values = columns.map((c) => clean[c]);
  const sql = `UPDATE ${cfg.table} SET ${setClause} WHERE id = ?`;
  await env.DB.prepare(sql).bind(...values, id).run();
  return { ok: true };
}

async function deleteRow(env, key, id) {
  const cfg = TABLES[key];
  await env.DB.prepare(`DELETE FROM ${cfg.table} WHERE id = ?`).bind(id).run();
  return { ok: true };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
      'Content-Type': 'application/json; charset=utf-8',
    };
    const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });

    if (request.method === 'OPTIONS') return new Response(null, { headers });

    try {
      const admin = isAdmin(request, env);

      // GET /api/admin/ping  -> el panel prueba la clave sin tocar datos
      if (pathname === '/api/admin/ping') {
        return admin ? json({ ok: true }) : json({ error: 'No autorizado' }, 401);
      }

      // GET /api/rio  (altura del río Uruguay en Colón, desde Prefectura)
      if (pathname === '/api/rio' && request.method === 'GET') {
        return await handleRio(searchParams, headers, admin);
      }

      // GET /api/lugares/:id
      const lugarById = pathname.match(/^\/api\/lugares\/([^/]+)$/);
      if (lugarById && request.method === 'GET') {
        const row = await byIdHandler(env, decodeURIComponent(lugarById[1]), admin);
        if (!row) return json({ error: 'Not found' }, 404);
        return json(row);
      }

      // /api/<tabla>  o  /api/<tabla>/:id
      const match = pathname.match(/^\/api\/([^/]+)(?:\/([^/]+))?$/);
      if (match) {
        const [, key, rawId] = match;
        const id = rawId ? decodeURIComponent(rawId) : undefined;
        const cfg = Object.prototype.hasOwnProperty.call(TABLES, key) ? TABLES[key] : null;

        if (cfg) {
          if (request.method === 'GET' && !cfg.private) {
            return json(await listHandler(env, key, searchParams, admin));
          }

          if (!admin) return json({ error: 'No autorizado' }, 401);

          if (request.method === 'GET') return json(await listHandler(env, key, searchParams, true));

          if (request.method === 'POST') return json(await createRow(env, key, await request.json()));

          if (request.method === 'PUT' && id) return json(await updateRow(env, key, id, await request.json()));

          if (request.method === 'DELETE' && id) return json(await deleteRow(env, key, id));
        }
      }

      return json({ error: 'Not found', path: pathname }, 404);
    } catch (err) {
      return json({ error: 'Internal server error', message: err.message }, 500);
    }
  },
};
