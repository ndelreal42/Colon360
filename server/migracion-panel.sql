-- Colón 360 — Migración del panel unificado (correr UNA sola vez en la base remota)
-- npx wrangler d1 execute colon360 --remote --file=migracion-panel.sql
-- Si dice "duplicate column name", esa parte ya estaba hecha: no pasa nada.

-- Fichas: poder ocultarlas de la app y vincularlas a un cliente que paga
ALTER TABLE lugares ADD COLUMN visible INTEGER DEFAULT 1;
ALTER TABLE lugares ADD COLUMN cliente_id TEXT;

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
