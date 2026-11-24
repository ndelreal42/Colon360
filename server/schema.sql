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
  whatsapp TEXT,
  promo    TEXT,
  carta    TEXT,
  lat      REAL,
  lng      REAL,
  dir      TEXT,
  desc     TEXT,
  info     TEXT,
  visible  INTEGER DEFAULT 1,
  cliente_id TEXT
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

-- Clientes (comercios que pagan el plan). Privado: solo el panel lo ve.
CREATE TABLE IF NOT EXISTS clientes (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  cat         TEXT,              -- Alojamiento, Comer, Deportes, Servicios, Otros
  rubro       TEXT,              -- Cabaña, Restaurante, Gimnasio...
  contacto    TEXT,
  whatsapp    TEXT,
  estado      TEXT DEFAULT 'Prueba gratis',  -- Prueba gratis, Activo, Vencido, Sin plan, Baja
  plan        TEXT,
  precio      INTEGER,
  vence       TEXT,              -- AAAA-MM-DD
  desde       TEXT,              -- AAAA-MM-DD
  ultimo_pago TEXT,              -- AAAA-MM-DD
  origen      TEXT,              -- Alta manual, WhatsApp, Formulario web, n8n
  notas       TEXT,
  visible     INTEGER DEFAULT 1
);

-- Altas y cambios que llegan solos (formulario, bot, n8n) y esperan aprobación
CREATE TABLE IF NOT EXISTS pendientes (
  id        TEXT PRIMARY KEY,
  tipo      TEXT NOT NULL,       -- alta | cambio
  origen    TEXT,
  recibido  TEXT,                -- fecha y hora ISO
  datos     TEXT,                -- JSON con los datos del comercio (altas)
  lugar_id  TEXT,                -- ficha a cambiar (cambios)
  cambios   TEXT,                -- JSON [{campo, key, despues}]
  mensaje   TEXT                 -- lo que llegó, tal cual
);

-- Notificaciones armadas desde el panel (se envían cuando salga la versión 1.2)
CREATE TABLE IF NOT EXISTS notificaciones (
  id          TEXT PRIMARY KEY,
  estado      TEXT,              -- Programada, Borrador, Enviada
  tema        TEXT,              -- Promos, Eventos, Rio, Novedades
  cliente_id  TEXT,
  titulo      TEXT,
  texto       TEXT,
  abre        TEXT,
  cuando      TEXT,              -- Programar | Repetir
  fecha       TEXT,              -- AAAA-MM-DD
  hora        TEXT,              -- HH:MM
  dia_semana  TEXT,
  creada      TEXT
);
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
