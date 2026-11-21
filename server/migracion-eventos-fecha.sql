-- Colón 360 — Fecha real en eventos (para que se oculten solos de la app al pasar).
-- Correr UNA sola vez:  npx wrangler d1 execute colon360 --remote --file=migracion-eventos-fecha.sql
-- OJO: si una línea dice "duplicate column name", la base deshace TODO el archivo: avisar antes de repetir.
ALTER TABLE eventos ADD COLUMN fecha TEXT;       -- AAAA-MM-DD (día de inicio)
ALTER TABLE eventos ADD COLUMN fecha_fin TEXT;   -- AAAA-MM-DD (último día, solo si dura varios días)
