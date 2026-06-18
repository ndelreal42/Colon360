const db = require('../db/client.js');

const parse = (row) => ({
  ...row,
  instrucciones: JSON.parse(row.instrucciones || '[]'),
  datos: JSON.parse(row.datos || '{}'),
});

function list(req, res, query) {
  let rows;
  if (query.categoria) {
    rows = db.prepare('SELECT * FROM juegos WHERE categoria = ? ORDER BY id').all(query.categoria);
  } else {
    rows = db.prepare('SELECT * FROM juegos ORDER BY categoria, id').all();
  }
  res.end(JSON.stringify(rows.map(parse)));
}

module.exports = { list };
