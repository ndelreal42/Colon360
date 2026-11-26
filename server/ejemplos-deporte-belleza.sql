-- EJEMPLOS para probar las secciones Deporte y Belleza (ids "ej-..."; se borran con quitar-ejemplos.sql)
INSERT OR REPLACE INTO lugares (id, nombre, tipo, categoria, emoji, color, tags, horario, whatsapp, dir, "desc", visible) VALUES
('ej-cancha-1','Complejo Los Amigos (EJEMPLO)','cancha','Fútbol 5','⚽','#E65100','["Fútbol 5","Césped sintético"]','Todos los días 08:00–00:00','3447000001','Av. Ejemplo 123, Colón','Canchas de fútbol 5 con césped sintético, buffet y vestuarios.',1),
('ej-cancha-2','Pádel Colón (EJEMPLO)','cancha','Pádel','🎾','#E65100','["Pádel","Techada"]','Lun–Dom 09:00–23:00','3447000002','Calle Ejemplo 456, Colón','Canchas de pádel techadas. Alquiler de paletas.',1),
('ej-cancha-3','Club Ejemplo (EJEMPLO)','cancha','Fútbol 5','⚽','#E65100','["Fútbol 5"]','Lun–Sáb 17:00–23:00','','Calle Ejemplo 789, Colón','Cancha sin WhatsApp cargado (se ve "WhatsApp próximamente").',1),
('ej-belleza-1','Estudio Aura (EJEMPLO)','belleza','Peluquería','💇','#C2185B','["Corte","Color","Peinado","Tratamientos"]','Mar–Sáb 09:00–20:00','3447000003','Calle Ejemplo 111, Colón','Peluquería unisex: cortes, color y tratamientos.',1),
('ej-belleza-2','Uñas Lu (EJEMPLO)','belleza','Uñas','💅','#C2185B','["Semipermanente","Esculpidas","Pedicuría"]','Lun–Vie 10:00–19:00','3447000004','Calle Ejemplo 222, Colón','Manicuría y pedicuría. Diseños a pedido.',1),
('ej-belleza-3','Barbería El Corte (EJEMPLO)','belleza','Barbería','💈','#C2185B','["Corte","Barba","Perfilado"]','Mar–Sáb 10:00–20:00','3447000005','Calle Ejemplo 333, Colón','Cortes clásicos y modernos, arreglo de barba.',1);
INSERT OR REPLACE INTO eventos (id, titulo, dia, mes, emoji, color, lugar, horario, "desc", tags, fecha, fecha_fin) VALUES
('ej-partido-1','Partido de ejemplo: Club A vs Club B','13','DIC','⚽','#E65100','Estadio de ejemplo','17:00','Partido de ejemplo para probar la sección Deporte.','["Deporte","Partido"]','2026-12-13','2026-12-13');
