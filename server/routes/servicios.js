const db = require('../db/client.js');

const parse = (row) => ({ ...row, urgente: row.urgente === 1 });

function list(req, res, query) {
  let rows;
  if (query.cat) {
    rows = db.prepare('SELECT * FROM servicios WHERE cat = ? ORDER BY urgente DESC, nombre').all(query.cat);
  } else {
    rows = db.prepare('SELECT * FROM servicios ORDER BY urgente DESC, cat, nombre').all();
  }
  res.end(JSON.stringify(rows.map(parse)));
}

module.exports = { list };
