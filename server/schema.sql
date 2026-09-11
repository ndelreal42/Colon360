CREATE TABLE IF NOT EXISTS lugares (
  id       TEXT PRIMARY KEY,
  nombre   TEXT NOT NULL,
  tipo     TEXT NOT NULL,
  categoria TEXT,
  emoji    TEXT,
  rating   REAL,
  color    TEXT,
  tags     TEXT,
  horario  TEXT,
  tel      TEXT,
  dir      TEXT,
  desc     TEXT,
  info     TEXT
);

CREATE TABLE IF NOT EXISTS eventos (
  id      TEXT PRIMARY KEY,
  titulo  TEXT NOT NULL,
  dia     TEXT,
  mes     TEXT,
  emoji   TEXT,
  color   TEXT,
  lugar   TEXT,
  horario TEXT,
  tel     TEXT,
  desc    TEXT,
  info    TEXT,
  tags    TEXT
);

CREATE TABLE IF NOT EXISTS servicios (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre  TEXT NOT NULL,
  cat     TEXT,
  emoji   TEXT,
  info    TEXT,
  horario TEXT,
  tel     TEXT,
  color   TEXT,
  urgente INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mapa_marcadores (
  id     INTEGER PRIMARY KEY,
  label  TEXT NOT NULL,
  cat    TEXT,
  x      REAL,
  y      REAL
);

CREATE TABLE IF NOT EXISTS actividades (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  tema   TEXT NOT NULL,
  franja TEXT NOT NULL,
  emoji  TEXT,
  titulo TEXT NOT NULL,
  desc   TEXT,
  color  TEXT
);

CREATE TABLE IF NOT EXISTS juegos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  categoria   TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  desc        TEXT,
  emoji       TEXT,
  duracion    TEXT,
  instrucciones TEXT,
  datos       TEXT
);