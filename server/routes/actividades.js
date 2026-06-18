const db = require('../db/client.js');

function list(req, res, query) {
  let sql = 'SELECT * FROM actividades WHERE 1=1';
  const params = [];
  if (query.tema) { sql += ' AND tema = ?'; params.push(query.tema); }
  if (query.franja) { sql += ' AND franja = ?'; params.push(query.franja); }
  sql += ' ORDER BY tema, franja';
  const rows = db.prepare(sql).all(...params);
  res.end(JSON.stringify(rows));
}

module.exports = { list };
