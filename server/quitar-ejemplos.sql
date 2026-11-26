-- Borra los ejemplos (lugares y eventos cuyo id empieza con "ej-").
DELETE FROM lugares WHERE id LIKE 'ej-%';
DELETE FROM eventos WHERE id LIKE 'ej-%';
