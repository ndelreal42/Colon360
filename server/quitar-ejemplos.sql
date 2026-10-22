-- Borra los paradores y campings de ejemplo (solo los que tienen id que empieza con "ej-").
DELETE FROM lugares WHERE id LIKE 'ej-%';
