const TABLES = {
  lugares:     { table: 'lugares',         order: 'tipo, nombre',     json: ['tags', 'info'],       filterable: ['tipo', 'categoria'] },
  eventos:     { table: 'eventos',         order: 'mes, dia',         json: ['tags', 'info'],       filterable: ['dia', 'mes'] },
  servicios:   { table: 'servicios',       order: 'cat, nombre',      json: [],                     filterable: ['cat'] },
  mapa:        { table: 'mapa_marcadores', order: 'cat, label',       json: [],                     filterable: ['cat'] },
  actividades: { table: 'actividades',     order: 'tema, franja',     json: [],                     filterable: ['tema', 'franja'] },
  juegos:      { table: 'juegos',          order: 'categoria, nombre',json: ['instrucciones','datos'], filterable: ['categoria'] },
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
    if (out[f] !== undefined && typeof out[f] !== 'string') {
      out[f] = JSON.stringify(out[f]);
    }
  }
  return out;
}

async function listHandler(env, key, searchParams) {
  const cfg = TABLES[key];
  let sql = `SELECT * FROM ${cfg.table}`;
  const binds = [];
  const filterParam = cfg.filterable.find((f) => searchParams.has(f));
  if (filterParam) {
    sql += ` WHERE ${filterParam} = ?`;
    binds.push(searchParams.get(filterParam));
  }
  sql += ` ORDER BY ${cfg.order}`;
  const { results } = await env.DB.prepare(sql).bind(...binds).all();
  return results.map((row) => parseJsonFields(row, cfg.json));
}

async function byIdHandler(env, id) {
  const row = await env.DB.prepare('SELECT * FROM lugares WHERE id = ?').bind(id).first();
  return row ? parseJsonFields(row, ['tags', 'info']) : null;
}

function isAdmin(request, env) {
  return request.headers.get('X-Admin-Key') === env.ADMIN_KEY;
}

async function createRow(env, key, body) {
  const cfg = TABLES[key];
  const clean = stringifyJsonFields(body, cfg.json);
  const columns = Object.keys(clean);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map((c) => clean[c]);
  const sql = `INSERT INTO ${cfg.table} (${columns.join(', ')}) VALUES (${placeholders})`;
  await env.DB.prepare(sql).bind(...values).run();
  return { ok: true };
}

async function updateRow(env, key, id, body) {
  const cfg = TABLES[key];
  const clean = stringifyJsonFields(body, cfg.json);
  const columns = Object.keys(clean);
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

    if (request.method === 'OPTIONS') return new Response(null, { headers });

    try {
      // GET /api/lugares/:id
      const lugarById = pathname.match(/^\/api\/lugares\/([^/]+)$/);
      if (lugarById && request.method === 'GET') {
        const row = await byIdHandler(env, lugarById[1]);
        if (!row) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
        return new Response(JSON.stringify(row), { headers });
      }

      const routeMap = {
        lugares: 'lugares', eventos: 'eventos', servicios: 'servicios',
        mapa: 'mapa', actividades: 'actividades', juegos: 'juegos',
      };

      // /api/<tabla>  o  /api/<tabla>/:id
      const match = pathname.match(/^\/api\/([^/]+)(?:\/([^/]+))?$/);
      if (match) {
        const [, tableKey, id] = match;
        const key = routeMap[tableKey];

        if (key) {
          if (request.method === 'GET') {
            const data = await listHandler(env, key, searchParams);
            return new Response(JSON.stringify(data), { headers });
          }

          if (!isAdmin(request, env)) {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers });
          }

          if (request.method === 'POST') {
            const body = await request.json();
            const result = await createRow(env, key, body);
            return new Response(JSON.stringify(result), { headers });
          }

          if (request.method === 'PUT' && id) {
            const body = await request.json();
            const result = await updateRow(env, key, id, body);
            return new Response(JSON.stringify(result), { headers });
          }

          if (request.method === 'DELETE' && id) {
            const result = await deleteRow(env, key, id);
            return new Response(JSON.stringify(result), { headers });
          }
        }
      }

      return new Response(JSON.stringify({ error: 'Not found', path: pathname }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal server error', message: err.message }), { status: 500, headers });
    }
  },
};