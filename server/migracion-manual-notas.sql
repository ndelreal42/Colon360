-- Colón 360 — Manual de procedimientos y notas rápidas del panel.
-- Correr UNA sola vez:  npx wrangler d1 execute colon360 --remote --file=migracion-manual-notas.sql
-- Solo crea tablas nuevas (si ya existen, no hace nada). No toca los datos de la app.

CREATE TABLE IF NOT EXISTS manual (
  id          TEXT PRIMARY KEY,
  titulo      TEXT NOT NULL,
  emoji       TEXT,
  orden       INTEGER DEFAULT 0,
  resumen     TEXT,              -- cuándo se usa este procedimiento
  cuerpo      TEXT,              -- pasos: "1. …" numerados, "- …" viñetas, "! …" consejo, "## …" subtítulo
  actualizado TEXT               -- AAAA-MM-DD
);

CREATE TABLE IF NOT EXISTS notas (
  id          TEXT PRIMARY KEY,
  texto       TEXT NOT NULL,
  cliente_id  TEXT,              -- opcional: nota pegada a un cliente
  recordar    TEXT,              -- AAAA-MM-DD (opcional)
  hecha       INTEGER DEFAULT 0,
  creada      TEXT               -- fecha y hora ISO
);
