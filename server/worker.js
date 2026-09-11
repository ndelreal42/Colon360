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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json; charset=utf-8',
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
    }

    try {
      const lugarById = pathname.match(/^\/api\/lugares\/([^/]+)$/);
      if (lugarById) {
        const row = await byIdHandler(env, lugarById[1]);
        if (!row) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
        return new Response(JSON.stringify(row), { headers });
      }

      const routeMap = {
        '/api/lugares': 'lugares',
        '/api/eventos': 'eventos',
        '/api/servicios': 'servicios',
        '/api/mapa': 'mapa',
        '/api/actividades': 'actividades',
        '/api/juegos': 'juegos',
      };

      const key = routeMap[pathname];
      if (key) {
        const data = await listHandler(env, key, searchParams);
        return new Response(JSON.stringify(data), { headers });
      }

      return new Response(JSON.stringify({ error: 'Not found', path: pathname }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal server error', message: err.message }), { status: 500, headers });
    }
  },
};