const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');

const db = new DatabaseSync(path.join(__dirname, 'db', 'colon360.db'));

const tablas = ['lugares', 'eventos', 'servicios', 'mapa_marcadores', 'actividades', 'juegos'];

function escaparValor(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return v;
  return `'${String(v).replace(/'/g, "''")}'`;
}

let sql = '';

for (const tabla of tablas) {
  const rows = db.prepare(`SELECT * FROM ${tabla}`).all();
  if (rows.length === 0) continue;

  for (const row of rows) {
    const columnas = Object.keys(row);
    const valores = columnas.map((c) => escaparValor(row[c]));
    sql += `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${valores.join(', ')});\n`;
  }
}

fs.writeFileSync(path.join(__dirname, 'datos.sql'), sql);
console.log(`Listo. Se generó datos.sql con datos de ${tablas.length} tablas.`);