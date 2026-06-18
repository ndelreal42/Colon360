const db = require('../db/client.js');

const parse = (row) => ({
  ...row,
  info: JSON.parse(row.info || '[]'),
  tags: JSON.parse(row.tags || '[]'),
});

function list(req, res, query) {
  const rows = db.prepare('SELECT * FROM eventos ORDER BY id').all();
  res.end(JSON.stringify(rows.map(parse)));
}

module.exports = { list };
