-- Colón 360 — Cuentas de usuario con Google (versión 1.2 de la app).
-- Correr UNA sola vez:  npx wrangler d1 execute colon360 --remote --file=migracion-usuarios.sql
-- Solo crea tablas nuevas (si ya existen, no hace nada). No toca los datos de la app.

CREATE TABLE IF NOT EXISTS usuarios (
  id              TEXT PRIMARY KEY,
  google_sub      TEXT NOT NULL UNIQUE,   -- identificador estable de la persona en Google
  email           TEXT,
  nombre          TEXT,
  foto            TEXT,
  creado          TEXT,                   -- fecha y hora ISO
  ultimo_ingreso  TEXT
);

-- Sesiones: se guarda solo la huella (SHA-256) del token que tiene la app, nunca el token.
CREATE TABLE IF NOT EXISTS sesiones (
  huella      TEXT PRIMARY KEY,
  usuario_id  TEXT NOT NULL,
  creada      TEXT,
  vence       TEXT
);
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones (usuario_id);
