const db = require('../db/client.js');

function list(req, res, query) {
  let rows;
  if (query.cat) {
    rows = db.prepare('SELECT * FROM mapa_marcadores WHERE cat = ? ORDER BY label').all(query.cat);
  } else {
    rows = db.prepare('SELECT * FROM mapa_marcadores ORDER BY id').all();
  }
  res.end(JSON.stringify(rows));
}

module.exports = { list };
