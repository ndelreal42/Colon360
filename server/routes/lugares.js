const db = require('../db/client.js');

const parse = (row) => ({
  ...row,
  tags: JSON.parse(row.tags || '[]'),
  info: JSON.parse(row.info || '[]'),
});

function list(req, res, query) {
  let rows;
  if (query.tipo) {
    rows = db.prepare('SELECT * FROM lugares WHERE tipo = ? ORDER BY nombre').all(query.tipo);
  } else {
    rows = db.prepare('SELECT * FROM lugares ORDER BY tipo, nombre').all();
  }
  res.end(JSON.stringify(rows.map(parse)));
}

function byId(req, res, query, id) {
  const row = db.prepare('SELECT * FROM lugares WHERE id = ?').get(id);
  if (!row) { res.writeHead(404); return res.end(JSON.stringify({ error: 'Not found' })); }
  res.end(JSON.stringify(parse(row)));
}

module.exports = { list, byId };
