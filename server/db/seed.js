const db = require('./client.js');

// ─── Helpers ────────────────────────────────────────────────────────────────
const j = (v) => JSON.stringify(v);

// ─── Limpiar tablas ─────────────────────────────────────────────────────────
db.exec(`
  DELETE FROM lugares;
  DELETE FROM eventos;
  DELETE FROM servicios;
  DELETE FROM mapa_marcadores;
  DELETE FROM actividades;
  DELETE FROM juegos;
`);

// ════════════════════════════════════════════════════════════════════════════
// LUGARES (playas, restaurantes, alojamientos, atractivos)
// ════════════════════════════════════════════════════════════════════════════
const insLugar = db.prepare(`
  INSERT OR REPLACE INTO lugares
    (id, nombre, tipo, categoria, emoji, rating, color, tags, horario, tel, dir, desc, info)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const lugares = [
  // ── Playas ───────────────────────────────────────────────────────────────
  { id:"p1", nombre:"Playa Norte", tipo:"playa", cat:null, emoji:"🌿", rating:4.8, color:"#2E7D32",
    tags:["Familia","Parrillas","Arena","Verde"],
    horario:"Abierta todo el día", tel:null, dir:"Costanera Norte",
    desc:"La playa más familiar de Colón. Rodeada de verde, con espacios para parrillas, sombra natural y arena fina. Ideal para un día largo con niños, con servicios completos y acceso cómodo desde el centro.",
    info:["Parrillas disponibles","Guardavidas en temporada","Zona de juegos infantiles","Estacionamiento amplio"] },
  { id:"p2", nombre:"Playa Inkier", tipo:"playa", cat:null, emoji:"🎶", rating:4.9, color:"#1E88E5",
    tags:["Jóvenes","Enero","Punto de encuentro","Noche"],
    horario:"Mañana, tarde y noche", tel:null, dir:"Costanera Sur",
    desc:"El epicentro de la vida joven en Colón durante enero. Por las tardes y noches se convierte en el punto de encuentro festivo por excelencia: música, gente, energía y el río Uruguay como fondo.",
    info:["Ambiente festivo en enero","Música y DJs","Gastronomía y tragos","Vista al río"] },
  { id:"p3", nombre:"Playa Honda", tipo:"playa", cat:null, emoji:"🌊", rating:4.6, color:"#1565C0",
    tags:["Relax","Naturaleza","Tranquila"],
    horario:"Abierta todo el día", tel:null, dir:"Costanera Sur (pasando Inkier)",
    desc:"Pasando Inkier, Playa Honda ofrece un ambiente más tranquilo y natural. Aguas profundas y serenas, menor concurrencia y un entorno verde que invita al descanso.",
    info:["Aguas más profundas","Menor concurrencia","Entorno natural preservado","Acceso a pie desde Inkier"] },

  // ── Restaurantes ─────────────────────────────────────────────────────────
  { id:"r1", nombre:"Campo Adentro", tipo:"restaurante", cat:null, emoji:"🐟", rating:4.9, color:"#1E88E5",
    tags:["Pescados","El mejor","Show folklórico","Regional"],
    horario:"11:00 – 16:00 y 19:30 – 01:00 · Todos los días",
    tel:"(03447) 422-003", dir:"Alejo Peyret y Chacabuco",
    desc:"El mejor pescado de Colón, frente al río Uruguay. Más de 200 personas en un ambiente estilo campo con peñas folklóricas en vivo.",
    info:["Especialidad: dorado, surubí, pacú y boga","Parrilla a leña vista","Pastas y platos caseros","Peñas y shows folklóricos nocturnos","Capacidad para más de 200 personas","Estacionamiento con custodia"] },
  { id:"r2", nombre:"Parrilla Don Coco", tipo:"restaurante", cat:null, emoji:"🥩", rating:4.8, color:"#F9A825",
    tags:["Asado","El mejor","Parrilla","Criollo"],
    horario:"12:00 – 00:00", tel:"Consultar en colonturismo.tur.ar", dir:"Colón centro",
    desc:"La referencia del asado en Colón. Cortes nobles, fuego lento y parrilla que no decepciona.",
    info:["El mejor asado de Colón","Cortes nobles seleccionados","Parrilla a leña","Ambiente criollo auténtico","Ideal para grupos"] },
  { id:"r3", nombre:"Gaman Café", tipo:"cafe", cat:null, emoji:"☕", rating:4.7, color:"#2E7D32",
    tags:["Café","Merienda","Laminados","Especialidad"],
    horario:"08:00 – 20:00", tel:"Consultar en colonturismo.tur.ar", dir:"Colón centro",
    desc:"El mejor rincón de Colón para el desayuno o la merienda. Especialistas en café de especialidad y laminados artesanales.",
    info:["Café de especialidad","Laminados artesanales propios","Desayunos y meriendas","Ambiente acogedor y tranquilo"] },
  { id:"r4", nombre:"La Estancia", tipo:"restaurante", cat:null, emoji:"🍝", rating:4.6, color:"#1E88E5",
    tags:["Pastas","Familiar","Clásico"],
    horario:"12:00 – 15:00 y 20:00 – 23:00", tel:"(03447) 422-153", dir:"Av. Urquiza 212",
    desc:"Un clásico de Colón para quienes buscan buenas pastas caseras en un ambiente familiar.",
    info:["Pastas caseras artesanales","Menú para celíacos","Ambiente familiar","Precio accesible"] },
  { id:"r5", nombre:"El Establo", tipo:"restaurante", cat:null, emoji:"🍽️", rating:4.4, color:"#2E7D32",
    tags:["Variado","Pescado","Minutas","Céntrico"],
    horario:"12:00 – 23:00", tel:"(03447) 425-212", dir:"Av. Paysandú 185",
    desc:"Propuesta amplia y versátil en el corazón de Colón. Minutas, pescado de río, pastas y parrilla en un mismo lugar.",
    info:["Minutas, pescado y parrilla","Menú para celíacos","Buena ubicación céntrica","Estacionamiento cercano"] },
  { id:"r6", nombre:"Terrazas de Colón", tipo:"restaurante", cat:null, emoji:"🌅", rating:4.5, color:"#F9A825",
    tags:["Vista al río","Romántico","Cocina elaborada"],
    horario:"Consultar horarios vigentes", tel:"(03447) 421-133", dir:"San Martín 144",
    desc:"Cocina elaborada con una de las mejores vistas al río Uruguay de Colón. Ideal para una cena especial o un almuerzo tranquilo.",
    info:["Vista panorámica al río","Platos elaborados","Carta de vinos","Ideal para ocasiones especiales"] },
  { id:"r7", nombre:"Heladería El Rey", tipo:"cafe", cat:null, emoji:"🍦", rating:4.8, color:"#1E88E5",
    tags:["Helados","Artesanal","Clásico","Imperdible"],
    horario:"10:00 – 00:00 (temporada)", tel:"3447-606-666", dir:"12 de Abril 117",
    desc:"La heladería de referencia de Colón. Helados artesanales con sabores clásicos y regionales.",
    info:["Helados artesanales propios","Sabores regionales únicos","Parada clásica de Colón","Temporada alta: abierto hasta medianoche"] },
  { id:"r8", nombre:"Brown 38", tipo:"restaurante", cat:null, emoji:"🍺", rating:4.3, color:"#2E7D32",
    tags:["Bar","Variado","Nocturno","Ambiente"],
    horario:"12:00 – 02:00", tel:"Consultar en colonturismo.tur.ar", dir:"Alte G. Brown 38",
    desc:"Punto de encuentro con buena propuesta gastronómica y ambiente animado.",
    info:["Bar y cocina variada","Ambiente nocturno animado","Picadas y platos informales","Cócteles y bebidas"] },

  // ── Alojamientos ─────────────────────────────────────────────────────────
  { id:"a1", nombre:"Hotel Termas Colón", tipo:"hotel", cat:null, emoji:"♨️", rating:4.9, color:"#1E88E5",
    tags:["Termal","Spa","Lujo"],
    horario:"Check-in: 14hs · Check-out: 11hs", tel:"(03447) 421-098", dir:"Ruta 135 s/n",
    desc:"El complejo de mayor categoría de Colón. Aguas termales minerales, spa, piletas y habitaciones confortables.",
    info:["Piletas termales minerales","Spa y masajes","Restaurante y bar","WiFi y estacionamiento"] },
  { id:"a2", nombre:"Cabañas del Palmar", tipo:"hotel", cat:null, emoji:"🌴", rating:4.7, color:"#2E7D32",
    tags:["Naturaleza","Privacidad","Palmar"],
    horario:"Check-in: 13hs · Check-out: 10hs", tel:"Consultar", dir:"Zona del Palmar",
    desc:"Cabañas de madera en medio del palmar yatay. Privacidad absoluta, fauna autóctona a metros de la puerta.",
    info:["Rodeadas de palmar yatay","Fogón exterior privado","Fauna autóctona","Desayuno incluido"] },
  { id:"a3", nombre:"Apart Río Uruguay", tipo:"hotel", cat:null, emoji:"🏠", rating:4.5, color:"#1E88E5",
    tags:["Apart","Familiar","Equipado"],
    horario:"Check-in: 14hs · Check-out: 10hs", tel:"Consultar", dir:"Costanera de Colón",
    desc:"Departamentos equipados a metros del río. Cocina completa, living y dormitorios independientes.",
    info:["Cocina completa equipada","A metros del río Uruguay","Estacionamiento incluido","Ideal para familias"] },
  { id:"a4", nombre:"Hostel La Aventura", tipo:"hotel", cat:null, emoji:"🎒", rating:4.4, color:"#F9A825",
    tags:["Económico","Social","Jóvenes"],
    horario:"Check-in: 13hs · Check-out: 10hs", tel:"Consultar", dir:"Centro de Colón",
    desc:"El hostel de referencia para mochileros y viajeros jóvenes. Buen diseño, ambiente social activo y precio accesible.",
    info:["Dormitorios y habitaciones privadas","Cocina compartida","Excursiones grupales","Alquiler de bicicletas"] },

  // ── Atractivos Naturales ─────────────────────────────────────────────────
  { id:"at1", nombre:"Parque Nacional El Palmar", tipo:"atrativo", cat:"Natural", emoji:"🌴", rating:null, color:"#2E7D32",
    tags:["Naturaleza","Palmar","Fauna","Excursión","Fotosafari"],
    horario:"08:00 – 18:00 hs · Todo el año", tel:"(03447) 493-031", dir:"Ruta Nacional 14, km 198 · A 55 km de Colón",
    desc:"A solo 55 km de Colón, el Parque Nacional El Palmar preserva el último gran palmar de yatay del mundo.",
    info:["Palmeras yatay centenarias únicas en el mundo","Fauna: carpinchos, yacarés, ciervos, zorros","Senderos autoguiados y con guía","Camping habilitado con servicios","Miradores y acceso al río Uruguay","Entrada paga"] },
  { id:"at2", nombre:"Refugio La Aurora del Palmar", tipo:"atrativo", cat:"Natural", emoji:"🦜", rating:null, color:"#2E7D32",
    tags:["Biodiversidad","Aves","Naturaleza","Fotosafari"],
    horario:"Consultar horarios en temporada", tel:"Consultar en colonturismo.tur.ar", dir:"Ruta Provincial 26 · Zona rural",
    desc:"Reserva de vida silvestre privada que protege uno de los palmares de yatay más extensos y conservados de la región.",
    info:["Más de 200 especies de aves registradas","Safaris fotográficos diurnos y nocturnos","Caminatas guiadas con naturalistas","Alojamiento en cabañas con naturaleza"] },
  { id:"at3", nombre:"Termas Colón", tipo:"atrativo", cat:"Natural", emoji:"♨️", rating:null, color:"#1E88E5",
    tags:["Termal","Relax","Salud","Agua mineral"],
    horario:"08:00 – 22:00 hs · Todo el año", tel:"(03447) 421-098", dir:"Ruta 135 s/n · Acceso norte de Colón",
    desc:"Uno de los complejos termales más reconocidos de Entre Ríos. Aguas minerales que brotan a más de 40°C.",
    info:["Aguas termales a más de 40°C","Propiedades minerales terapéuticas","Piletas cubiertas y exteriores","Spa, masajes e hidromasajes","Abierto todo el año"] },
  { id:"at4", nombre:"Playas e Islas del Río Uruguay", tipo:"atrativo", cat:"Natural", emoji:"🏝️", rating:null, color:"#1E88E5",
    tags:["Río","Islas","Kayak","Excursiones"],
    horario:"Temporada alta: noviembre–marzo", tel:"Consultar excursiones en colonturismo.tur.ar", dir:"Costanera de Colón",
    desc:"El río Uruguay y sus islas son el corazón del turismo de Colón. El delta entrerriano esconde islas vírgenes accesibles en kayak o lancha.",
    info:["Islas accesibles en kayak o lancha","Excursiones náuticas guiadas","Pesca deportiva del dorado","Playas naturales vírgenes","Amanecer y atardecer sobre el río"] },
  { id:"at5", nombre:"Espacios Verdes y Parque Quirós", tipo:"atrativo", cat:"Natural", emoji:"🌳", rating:null, color:"#2E7D32",
    tags:["Parque","Deporte","Familia","Gratuito"],
    horario:"Abierto todo el día · Libre y gratuito", tel:"—", dir:"Av. Quirós · Frente a la costanera",
    desc:"El Parque Quirós es el pulmón verde de Colón sobre la costanera del río Uruguay.",
    info:["Acceso libre y gratuito","Canchas deportivas","Juegos infantiles","Ciclovías y senderos","Vista al río Uruguay"] },

  // ── Atractivos Culturales ────────────────────────────────────────────────
  { id:"at6", nombre:"Molino Forclaz", tipo:"atrativo", cat:"Cultural", emoji:"🏛️", rating:null, color:"#795548",
    tags:["Historia","Patrimonio","Visita guiada","Nocturno"],
    horario:"Visitas teatralizadas y nocturnas · Consultar fechas", tel:"(03447) 423-233", dir:"Av. Costanera Norte · Colón",
    desc:"Construcción histórica del siglo XIX declarada Patrimonio Provincial. Ofrece visitas guiadas teatralizadas y noches con atmósfera mágica.",
    info:["Patrimonio histórico provincial","Visitas teatralizadas diurnas","Visitas nocturnas especiales","Guías especializados en historia local","Reserva previa recomendada"] },
  { id:"at7", nombre:"Palacio San José", tipo:"atrativo", cat:"Cultural", emoji:"🏰", rating:null, color:"#795548",
    tags:["Historia","Urquiza","Museo","Arquitectura"],
    horario:"Mar a Dom: 09:00 – 13:00 y 14:00 – 18:00", tel:"(03446) 430-028", dir:"Ruta Provincial 39 · Caseros (35 km de Colón)",
    desc:"Residencia del General Justo José de Urquiza, máximo exponente de la arquitectura italianizante del siglo XIX en Argentina.",
    info:["Ex residencia del Gral. Urquiza","Arquitectura italianizante del S. XIX","Museo con objetos históricos originales","Jardines monumentales declarados patrimonio","A 35 km de Colón"] },
  { id:"at8", nombre:"Museo Histórico Regional", tipo:"atrativo", cat:"Cultural", emoji:"🏺", rating:null, color:"#795548",
    tags:["Historia","Colección","Cultura","Gratuito"],
    horario:"Lun a Vie: 08:00 – 12:00 y 15:00 – 19:00", tel:"(03447) 422-116", dir:"Av. 12 de Abril 94 · Centro de Colón",
    desc:"Recorre la historia de Colón desde su fundación en 1863 hasta la actualidad.",
    info:["Historia desde la fundación de Colón (1863)","Arqueología y etnografía regional","Documentos históricos originales","Historia de la inmigración europea","Entrada libre y gratuita"] },
  { id:"at9", nombre:"Granja La Administración", tipo:"atrativo", cat:"Cultural", emoji:"🏡", rating:null, color:"#2E7D32",
    tags:["Historia","Colonia","Inmigrantes","Rural"],
    horario:"Consultar en colonturismo.tur.ar", tel:"Consultar en colonturismo.tur.ar", dir:"Zona rural · Acceso desde Colón",
    desc:"Casa histórica de Alejo Peyret, pionero de la colonización francesa en Entre Ríos.",
    info:["Casa histórica siglo XIX conservada","Historia de la colonización francesa","Ambiente rural auténtico","Patrimonio histórico de Entre Ríos"] },
  { id:"at10", nombre:"Museo Zona Darwin / Malvinas", tipo:"atrativo", cat:"Cultural", emoji:"🪖", rating:null, color:"#1565C0",
    tags:["Malvinas","Historia","Homenaje","Memorial"],
    horario:"Consultar horarios vigentes", tel:"(03447) 423-233", dir:"Colón · Consultar dirección en turismo",
    desc:"Memorial y museo dedicado a los veteranos y caídos de Colón en la Guerra de las Islas Malvinas.",
    info:["Homenaje a veteranos de Malvinas","Objetos y documentos originales","Zona Darwin: historia del conflicto","Testimonio de combatientes entrerrianos","Entrada libre"] },
  { id:"at11", nombre:"Ruinas del Falansterio de Durandó", tipo:"atrativo", cat:"Cultural", emoji:"🏚️", rating:null, color:"#795548",
    tags:["Ruinas","Historia","Colonia","Singular"],
    horario:"Acceso libre · Todo el año", tel:"Consultar en colonturismo.tur.ar", dir:"Zona rural",
    desc:"Vestigios de uno de los experimentos sociales más singulares del siglo XIX en Argentina: un falansterio de inspiración fourierista.",
    info:["Único falansterio histórico de Argentina","Ruinas del siglo XIX conservadas","Experimento social fourierista","Historia de la colonización francesa"] },
  { id:"at12", nombre:"La Casona · Centro de Artesanos", tipo:"atrativo", cat:"Cultural", emoji:"🎨", rating:null, color:"#F9A825",
    tags:["Artesanía","Compras","Cultura","Centro"],
    horario:"Lun a Dom: 09:00 – 13:00 y 17:00 – 21:00", tel:"(03447) 422-604", dir:"Av. Urquiza 40 · Centro de Colón",
    desc:"El centro de referencia de la artesanía colonense. Más de 30 artesanos locales exhiben sus producciones.",
    info:["Más de 30 artesanos locales","Tejidos, cerámica, madera, cuero y joyería","Espacio histórico restaurado","Venta directa al artesano","Abierto todo el año"] },
  { id:"at13", nombre:"Feria Costanera", tipo:"atrativo", cat:"Cultural", emoji:"🌅", rating:null, color:"#F9A825",
    tags:["Feria","Costanera","Artesanía","Música"],
    horario:"Tardes y noches · Temporada alta (enero–feb)", tel:"—", dir:"Av. Costanera · Frente al río",
    desc:"La feria más popular del verano colonense. Artesanos, gastronomía regional y música en vivo.",
    info:["Artesanos y souvenirs regionales","Gastronomía típica del litoral","Música en vivo","Sobre la costanera del río","Entrada libre y gratuita"] },
  { id:"at14", nombre:"Feria Manos del Puerto", tipo:"atrativo", cat:"Cultural", emoji:"⚓", rating:null, color:"#1E88E5",
    tags:["Feria","Puerto","Artesanía","Regional"],
    horario:"Fines de semana y feriados · Todo el año", tel:"Consultar en colonturismo.tur.ar", dir:"Puerto Fluvial de Colón",
    desc:"Feria artesanal en el pintoresco entorno del Puerto Fluvial de Colón.",
    info:["Ubicación en el Puerto Fluvial","Vista al Puente Internacional","Artesanía regional de calidad","Fines de semana todo el año"] },
  { id:"at15", nombre:"Biblioteca Popular Fiat Lux", tipo:"atrativo", cat:"Cultural", emoji:"📚", rating:null, color:"#1565C0",
    tags:["Cultura","Biblioteca","Historia","Eventos"],
    horario:"Lun a Vie: 08:00 – 20:00 · Sáb: 09:00 – 13:00", tel:"(03447) 421-554", dir:"Av. San Martín 67 · Centro de Colón",
    desc:"Institución cultural fundacional de Colón con más de 100 años de historia.",
    info:["Más de 100 años de historia","Actividades culturales y exposiciones","Fondo bibliográfico histórico regional","Ingreso libre"] },
  { id:"at16", nombre:"Paseo del Sol", tipo:"atrativo", cat:"Cultural", emoji:"☀️", rating:null, color:"#F9A825",
    tags:["Paseo","Compras","Gastronomía","Centro"],
    horario:"Lunes a domingo · Consultar horarios", tel:"Consultar en colonturismo.tur.ar", dir:"Av. 12 de Abril · Centro de Colón",
    desc:"Centro comercial y de paseo a cielo abierto en el corazón de Colón.",
    info:["Tiendas y locales comerciales","Gastronomía variada","A cielo abierto","En el centro de Colón"] },
  { id:"at24", nombre:"Turismo de Bodegas", tipo:"atrativo", cat:"Cultural", emoji:"🍷", rating:null, color:"#795548",
    tags:["Vino","Bodega","Degustación","Rural"],
    horario:"Consultar cada establecimiento", tel:"Consultar en colonturismo.tur.ar", dir:"Zona rural de Colón y alrededores",
    desc:"La región de Colón cuenta con fincas y viñedos que ofrecen visitas guiadas y degustaciones.",
    info:["Visitas a viñedos y bodegas","Degustación de vinos regionales","Compra directa al productor"] },
  { id:"at25", nombre:"Turismo Arquitectónico Religioso", tipo:"atrativo", cat:"Cultural", emoji:"⛪", rating:null, color:"#795548",
    tags:["Iglesias","Arquitectura","Historia","Patrimonio"],
    horario:"Consultar en colonturismo.tur.ar", tel:"(03447) 423-233", dir:"Centro histórico de Colón",
    desc:"Colón conserva un notable patrimonio de arquitectura religiosa del siglo XIX y principios del XX.",
    info:["Iglesias de estilo europeo S.XIX","Patrimonio arquitectónico histórico","Recorrido guiado disponible"] },

  // ── Atractivos Deportivos ────────────────────────────────────────────────
  { id:"at17", nombre:"Excursiones Náuticas", tipo:"atrativo", cat:"Deporte", emoji:"⛵", rating:null, color:"#1E88E5",
    tags:["Náutica","Kayak","Río","Aventura"],
    horario:"Consultar operadores en colonturismo.tur.ar", tel:"Consultar en colonturismo.tur.ar", dir:"Puerto Fluvial de Colón",
    desc:"El río Uruguay es un escenario de primer nivel para la náutica de recreo.",
    info:["Excursiones a islas en lancha","Kayak en arroyos del delta","Pesca deportiva guiada","Travesías al atardecer"] },
  { id:"at18", nombre:"Excursiones Aéreas", tipo:"atrativo", cat:"Deporte", emoji:"✈️", rating:null, color:"#1E88E5",
    tags:["Vuelo","Aerodeporte","Vistas","Adrenalina"],
    horario:"Consultar operadores en colonturismo.tur.ar", tel:"Consultar en colonturismo.tur.ar", dir:"Aeródromo de Colón",
    desc:"Una perspectiva única del paisaje colonense desde las alturas. Vuelos panorámicos sobre el río Uruguay.",
    info:["Vuelos panorámicos en avioneta","Ala delta y parapente","Vista aérea del Parque El Palmar"] },
  { id:"at19", nombre:"Cicloturismo y Senderismo", tipo:"atrativo", cat:"Deporte", emoji:"🚴", rating:null, color:"#2E7D32",
    tags:["Bicicleta","Senderismo","Naturaleza","Activo"],
    horario:"Todo el año · Consultar guías locales", tel:"Consultar en colonturismo.tur.ar", dir:"Costanera de Colón",
    desc:"Colón ofrece circuitos de cicloturismo y senderismo que recorren la costanera, los palmares y el entorno rural.",
    info:["Circuitos urbanos y rurales","Alquiler de bicicletas disponible","Guías locales especializados","Circuito costanera: 8 km"] },
  { id:"at20", nombre:"Pesca Deportiva", tipo:"atrativo", cat:"Deporte", emoji:"🎣", rating:null, color:"#1565C0",
    tags:["Pesca","Dorado","Deportiva","Guías"],
    horario:"Todo el año · Mayor actividad: oct–abr", tel:"Consultar guías en colonturismo.tur.ar", dir:"Puerto Fluvial · Río Uruguay",
    desc:"El dorado del río Uruguay convierte a Colón en uno de los destinos de pesca deportiva más importantes de Sudamérica.",
    info:["Pesca del dorado y surubí","Guías habilitados con embarcación","Campeonatos y torneos anuales","Mejor temporada: octubre a abril"] },
  { id:"at21", nombre:"Golf Club Los Bretes", tipo:"atrativo", cat:"Deporte", emoji:"⛳", rating:null, color:"#2E7D32",
    tags:["Golf","Campo","Deporte","Naturaleza"],
    horario:"Consultar en el club directamente", tel:"Consultar en colonturismo.tur.ar", dir:"Camino Los Bretes · Zona rural Colón",
    desc:"Campo de golf de 18 hoyos en un entorno natural privilegiado a pocos minutos del centro.",
    info:["Campo de 18 hoyos","Entorno natural privilegiado","Open para visitantes","Clases y alquiler de equipo"] },
  { id:"at22", nombre:"Molino Aventura", tipo:"atrativo", cat:"Deporte", emoji:"🧗", rating:null, color:"#F9A825",
    tags:["Aventura","Niños","Tirolesa","Familia"],
    horario:"Fines de semana y feriados · Consultar temporada", tel:"Consultar en colonturismo.tur.ar", dir:"Zona del Molino Forclaz · Colón",
    desc:"Parque de aventura con actividades al aire libre para toda la familia. Tirolesas, escalada y circuitos de cuerdas.",
    info:["Tirolesas y escalada","Circuitos de cuerdas en altura","Apto para niños desde 4 años","Monitores con certificación"] },
  { id:"at23", nombre:"La Aldea Club de Campo", tipo:"atrativo", cat:"Deporte", emoji:"🏊", rating:null, color:"#2E7D32",
    tags:["Club","Pileta","Deporte","Familia"],
    horario:"Consultar horarios en temporada", tel:"Consultar en colonturismo.tur.ar", dir:"Zona rural · Acceso desde Colón",
    desc:"Club de campo con amplias instalaciones deportivas y de recreación.",
    info:["Pileta de natación","Canchas deportivas múltiples","Espacios verdes y picnic","Gastronomía en el lugar"] },
];

for (const l of lugares) {
  insLugar.run(l.id, l.nombre, l.tipo, l.cat ?? null, l.emoji ?? null, l.rating ?? null, l.color ?? null,
    j(l.tags ?? []), l.horario ?? null, l.tel ?? null, l.dir ?? null, l.desc ?? null, j(l.info ?? []));
}
console.log(`✓ ${lugares.length} lugares insertados`);

// ════════════════════════════════════════════════════════════════════════════
// EVENTOS
// ════════════════════════════════════════════════════════════════════════════
const insEvento = db.prepare(`
  INSERT OR REPLACE INTO eventos (id, titulo, dia, mes, emoji, color, lugar, horario, tel, desc, info, tags)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const eventos = [
  { id:"e0", titulo:"Finde Largo de Pascuas", dia:"17", mes:"ABR", emoji:"🎪", color:"#F9A825",
    lugar:"Puerto de Colón", horario:"Viernes a domingo · Todo el día", tel:"Entrada libre",
    desc:"El próximo gran evento de Colón. Durante el fin de semana largo de Pascuas, el Puerto se transforma con ferias artesanales y cantantes en vivo.",
    info:["Ferias artesanales","Cantantes locales en vivo","Gastronomía regional","Entrada libre y gratuita"],
    tags:["Próximo","Feria","Música","Puerto"] },
  { id:"e1", titulo:"Torneo de Pesca del Dorado", dia:"May", mes:"2026", emoji:"🎣", color:"#1E88E5",
    lugar:"Puerto Fluvial", horario:"Salida: 06:00 hs", tel:"municipio.colon.gov.ar",
    desc:"Competencia internacional de pesca deportiva del dorado en el río Uruguay.",
    info:["Categorías amateur y profesional","Premios en efectivo","Reglas IGFA","Pesaje en muelle oficial"],
    tags:["Pesca","Deportivo","Internacional"] },
  { id:"e2", titulo:"Feria de Artesanos La Casona", dia:"Todo", mes:"el año", emoji:"🎨", color:"#2E7D32",
    lugar:"La Casona · Centro de Colón", horario:"Consultar horarios vigentes", tel:"colonturismo.tur.ar",
    desc:"El Centro de Artesanos La Casona concentra la producción artesanal de la región.",
    info:["Artesanos locales y regionales","Venta directa al público","Productos únicos","Abierto todo el año"],
    tags:["Artesanía","Cultura","Permanente"] },
  { id:"e3", titulo:"Feria Costanera", dia:"Temp.", mes:"verano", emoji:"🌅", color:"#F9A825",
    lugar:"Costanera de Colón", horario:"Tardes y noches en temporada", tel:"Entrada libre",
    desc:"La feria más popular del verano colonense. Artesanos, gastronomía y música en vivo sobre la costanera.",
    info:["Artesanía y souvenirs","Gastronomía variada","Música en vivo","Sobre la costanera"],
    tags:["Verano","Feria","Costanera"] },
  { id:"e4", titulo:"Visitas al Molino Forclaz", dia:"Todo", mes:"el año", emoji:"🏛️", color:"#2E7D32",
    lugar:"Molino Forclaz · Colón", horario:"Visitas guiadas teatralizadas y nocturnas", tel:"colonturismo.tur.ar",
    desc:"El Molino Forclaz ofrece visitas guiadas teatralizadas durante el día y visitas nocturnas con atmósfera única.",
    info:["Visitas teatralizadas diurnas","Visitas nocturnas especiales","Guías especializados","Reserva previa recomendada"],
    tags:["Historia","Cultural","Patrimonio"] },
  { id:"e5", titulo:"Parque Nacional El Palmar", dia:"Todo", mes:"el año", emoji:"🌴", color:"#2E7D32",
    lugar:"Ruta 14, Entre Ríos", horario:"08:00 – 18:00 hs", tel:"Tel: (03447) info parque",
    desc:"A 55km de Colón, el Parque Nacional El Palmar protege el último gran palmar de yatay del mundo.",
    info:["Palmeras yatay centenarias","Fauna autóctona","Camping habilitado","A 55km de Colón"],
    tags:["Naturaleza","Excursión","Palmar"] },
];

for (const e of eventos) {
  insEvento.run(e.id, e.titulo, e.dia, e.mes, e.emoji, e.color, e.lugar, e.horario, e.tel, e.desc, j(e.info), j(e.tags));
}
console.log(`✓ ${eventos.length} eventos insertados`);

// ════════════════════════════════════════════════════════════════════════════
// SERVICIOS
// ════════════════════════════════════════════════════════════════════════════
const insSer = db.prepare(`
  INSERT INTO servicios (nombre, cat, emoji, info, horario, tel, color, urgente)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const servicios = [
  { nombre:"Policía",                    cat:"Emergencias",  emoji:"🚔", info:"Comisaría 1ª · Av. Costanera s/n",       horario:"24hs",          tel:"911",               color:"#1565C0", urgente:1 },
  { nombre:"Bomberos Colón",             cat:"Emergencias",  emoji:"🚒", info:"Cuerpo de Bomberos Voluntarios",         horario:"24hs",          tel:"100",               color:"#e53935", urgente:1 },
  { nombre:"Hospital San Benjamín",      cat:"Salud",        emoji:"🏥", info:"Almirante Brown 240, Colón",             horario:"Urgencias 24hs",tel:"107",               color:"#e53935", urgente:1 },
  { nombre:"SAME / Emergencias Médicas", cat:"Salud",        emoji:"🚑", info:"Servicio de emergencias médicas",        horario:"24hs",          tel:"107",               color:"#e53935", urgente:1 },
  { nombre:"Farmacia de Turno",          cat:"Salud",        emoji:"💊", info:"Ver turnos en colonturismo.tur.ar",      horario:"24hs",          tel:"(03447) 421-300",   color:"#2E7D32", urgente:0 },
  { nombre:"Centro de Salud N°1",        cat:"Salud",        emoji:"🩺", info:"San Martín 340, Colón",                  horario:"07:00–19:00",   tel:"(03447) 422-890",   color:"#2E7D32", urgente:0 },
  { nombre:"Oficina de Turismo",         cat:"Información",  emoji:"ℹ️", info:"Av. Quirós y Gouchon, Costanera",        horario:"08:00–20:00",   tel:"(03447) 423-233",   color:"#1E88E5", urgente:0 },
  { nombre:"Policía Turística",          cat:"Información",  emoji:"👮", info:"Av. Costanera s/n (frente al río)",      horario:"24hs temporada",tel:"(03447) 421-500",   color:"#1565C0", urgente:0 },
  { nombre:"YPF Colón",                  cat:"Combustible",  emoji:"⛽", info:"Ruta 135 km 0, ingreso a Colón",         horario:"24hs",          tel:"(03447) 421-700",   color:"#F9A825", urgente:0 },
  { nombre:"Shell / Axion",              cat:"Combustible",  emoji:"⛽", info:"Ruta Nacional 14, acceso norte",         horario:"24hs",          tel:"Consultar",         color:"#F9A825", urgente:0 },
  { nombre:"Remises Colón",              cat:"Transporte",   emoji:"🚗", info:"Servicio de remises las 24hs",           horario:"24hs",          tel:"(03447) 422-444",   color:"#795548", urgente:0 },
  { nombre:"Terminal de Ómnibus",        cat:"Transporte",   emoji:"🚌", info:"Av. Paysandú s/n, Colón",               horario:"06:00–22:00",   tel:"(03447) 421-716",   color:"#795548", urgente:0 },
  { nombre:"ACA Colón",                  cat:"Mecánica",     emoji:"🔧", info:"Asistencia en ruta · Automóvil Club",   horario:"24hs socios",   tel:"0800-888-9090",     color:"#1E88E5", urgente:0 },
  { nombre:"Auxilio Mecánico",           cat:"Mecánica",     emoji:"🛠️", info:"Mecánica de emergencia en ruta",         horario:"8:00–20:00",    tel:"(03447) 422-112",   color:"#795548", urgente:0 },
  { nombre:"Gomería 24hs",               cat:"Mecánica",     emoji:"🔩", info:"Ruta 135, ingreso a Colón",              horario:"24hs",          tel:"(03447) 421-999",   color:"#795548", urgente:0 },
  { nombre:"Lavadero Colón",             cat:"Lavadero",     emoji:"🧼", info:"Belgrano 234, centro",                   horario:"Lun–Sáb 8–18hs",tel:"(03447) 422-030",   color:"#42A5F5", urgente:0 },
  { nombre:"Supermercado Día",           cat:"Comercio",     emoji:"🛒", info:"Av. 12 de Abril s/n, centro",            horario:"08:00–22:00",   tel:"Consultar",         color:"#F9A825", urgente:0 },
  { nombre:"Cajero Automático",          cat:"Banco",        emoji:"💳", info:"Banco Nación · Urquiza 102, Colón",      horario:"24hs",          tel:"Consultar",         color:"#1E88E5", urgente:0 },
];

for (const s of servicios) {
  insSer.run(s.nombre, s.cat, s.emoji, s.info, s.horario, s.tel, s.color, s.urgente);
}
console.log(`✓ ${servicios.length} servicios insertados`);

// ════════════════════════════════════════════════════════════════════════════
// MAPA MARCADORES
// ════════════════════════════════════════════════════════════════════════════
const insMarca = db.prepare(`INSERT OR REPLACE INTO mapa_marcadores (id, label, cat, x, y) VALUES (?, ?, ?, ?, ?)`);

const marcadores = [
  [1,"Playa Norte","Playa",14,30],[2,"Playa Inkier","Playa",22,40],[3,"Playa Honda","Playa",28,48],
  [4,"Termas Colón","Hotel",60,22],[5,"Campo Adentro","Rest.",38,42],[6,"Parrilla Don Coco","Rest.",50,35],
  [7,"Gaman Café","Café",55,50],[8,"Puerto de Colón","Atracción",18,58],[9,"Molino Forclaz","Atracción",30,62],
  [10,"Hospital","Salud",48,65],[11,"La Estancia","Rest.",62,44],[12,"Heladería El Rey","Café",58,38],
  [13,"Terrazas de Colón","Rest.",44,30],[14,"Parque El Palmar","Atracción",82,55],[15,"La Casona","Atracción",52,43],
  [16,"Museo Histórico","Atracción",56,30],[17,"Palacio San José","Atracción",75,68],[18,"Parque Quirós","Atracción",20,36],
  [19,"Golf Los Bretes","Deporte",70,38],[20,"Molino Aventura","Deporte",32,68],
];

for (const [id, label, cat, x, y] of marcadores) insMarca.run(id, label, cat, x, y);
console.log(`✓ ${marcadores.length} marcadores insertados`);

// ════════════════════════════════════════════════════════════════════════════
// ACTIVIDADES (POOL del planner)
// ════════════════════════════════════════════════════════════════════════════
const insAct = db.prepare(`
  INSERT INTO actividades (tema, franja, emoji, titulo, desc, color)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const actividades = [
  // playa
  ["playa","manana","☀️","Playa Norte","La más familiar y tranquila. Arena fina, aguas calmas y sombra natural.","#1E88E5"],
  ["playa","manana","🏖️","Playa Honda","Más íntima y serena. Aguas profundas y entorno verde. Ideal para descansar.","#1E88E5"],
  ["playa","manana","🏄","Playa Inkier","La más animada. Música, gente y energía con el Uruguay de fondo.","#1565C0"],
  ["playa","tarde","🏝️","Excursión a las Islas","Lancha hasta islas vírgenes del delta entrerriano. Una experiencia única.","#1E88E5"],
  ["playa","tarde","🌅","Costanera al atardecer","La caminata más fotogénica de Colón. El sol se hunde sobre el río Uruguay.","#42A5F5"],
  // historia
  ["historia","manana","🏛️","Molino Forclaz","Visita guiada al patrimonio histórico del siglo XIX. Historia y arquitectura.","#795548"],
  ["historia","manana","🏺","Museo Histórico Regional","La historia de Colón desde 1863. Arqueología, inmigrantes europeos y mucho más.","#795548"],
  ["historia","tarde","🏚️","Ruinas del Falansterio","El experimento social más singular del S.XIX en Argentina. Historia fascinante.","#795548"],
  ["historia","tarde","🪖","Museo Zona Darwin","Homenaje a los veteranos de Malvinas de Colón. Emotivo e histórico.","#1565C0"],
  ["historia","noche","🎭","Visita Nocturna al Molino","La visita teatralizada nocturna más especial de Entre Ríos. Magia e historia.","#795548"],
  // gastronomia
  ["gastronomia","manana","☕","Gaman Café","Café de especialidad y laminados artesanales. El mejor desayuno de Colón.","#795548"],
  ["gastronomia","mediodia","🎶","Campo Adentro","Pescados de río, show folklórico y el ambiente más auténtico del litoral.","#2E7D32"],
  ["gastronomia","mediodia","🥩","Parrilla Don Coco","El asado de referencia en Colón. Fuego lento, cortes nobles y sabor criollo.","#F9A825"],
  ["gastronomia","mediodia","🍝","La Estancia","Pastas caseras en ambiente íntimo. Un clásico que no defrauda.","#F9A825"],
  ["gastronomia","mediodia","🌊","Terrazas de Colón","Cocina de autor con vista al río Uruguay. Para un almuerzo memorable.","#F9A825"],
  ["gastronomia","tarde","🍦","Heladería El Rey","Helados artesanales de generación en generación. Parada obligatoria.","#F9A825"],
  ["gastronomia","noche","🎶","Campo Adentro (noche)","La noche perfecta: dorado, peñas folklóricas y río Uruguay de fondo.","#2E7D32"],
  ["gastronomia","noche","🍺","Brown 38","Picadas, tragos y buen ambiente. El lugar de la noche colonense.","#1565C0"],
  // naturaleza
  ["naturaleza","manana","🌴","Parque Nacional El Palmar","55km de Colón. Palmeras yatay centenarias, fauna autóctona y senderos únicos.","#2E7D32"],
  ["naturaleza","tarde","🌳","Parque Quirós","El pulmón verde de Colón sobre la costanera. Caminata y vista al río.","#2E7D32"],
  ["naturaleza","tarde","🏝️","Excursión náutica","Recorrido por el delta del Uruguay. Islas, fauna y naturaleza ribereña.","#1E88E5"],
  // relax
  ["relax","manana","♨️","Termas Colón","Aguas minerales a 40°C. Spa, hidromasajes y relax total.","#1E88E5"],
  ["relax","tarde","🌅","Atardecer en la costanera","La tarde más relajante: el sol se hunde sobre el río Uruguay.","#42A5F5"],
  ["relax","noche","💆","Spa Termas Colón","Masajes y tratamientos de bienestar en el complejo termal.","#1E88E5"],
  // aventura
  ["aventura","manana","🧗","Molino Aventura","Tirolesas, escalada y circuitos de cuerdas. Adrenalina en entorno natural.","#F9A825"],
  ["aventura","manana","🚴","Cicloturismo costanero","Recorrido en bici por la costanera. 8 km de naturaleza y vistas al río.","#2E7D32"],
  ["aventura","tarde","⛵","Kayak en el río","Recorrido en kayak por los arroyos del delta. Adrenalina suave y naturaleza.","#1E88E5"],
  ["aventura","manana","⛳","Golf Club Los Bretes","Campo de 18 hoyos en entorno natural privilegiado. Abierto a visitantes.","#2E7D32"],
  ["aventura","manana","🎣","Salida de pesca al amanecer","Madrugada en el Puerto Fluvial. El guía te espera con la embarcación lista.","#1565C0"],
  // noche
  ["noche","noche","🎶","Campo Adentro (show)","Show folklórico en vivo con el mejor pescado del litoral. Colón de noche.","#2E7D32"],
  ["noche","noche","🍺","Brown 38","El bar de Colón. Tragos, picadas y un ambiente que invita a quedarse.","#1565C0"],
  ["noche","noche","🌟","Feria Costanera","Artesanos, música y gastronomía sobre la costanera del río.","#F9A825"],
  // compras
  ["compras","manana","🎨","La Casona Artesanos","Más de 30 artesanos locales. Tejidos, cerámica y madera en espacio histórico.","#F9A825"],
  ["compras","tarde","⚓","Feria Manos del Puerto","Artesanía regional con vista al Puente Internacional.","#1E88E5"],
  ["compras","tarde","🛍️","Paseo del Sol","Centro comercial a cielo abierto en el corazón de Colón.","#F9A825"],
];

for (const [tema, franja, emoji, titulo, desc, color] of actividades) {
  insAct.run(tema, franja, emoji, titulo, desc, color);
}
console.log(`✓ ${actividades.length} actividades insertadas`);

// ════════════════════════════════════════════════════════════════════════════
// JUEGOS
// ════════════════════════════════════════════════════════════════════════════
const insJuego = db.prepare(`
  INSERT INTO juegos (categoria, nombre, desc, emoji, duracion, instrucciones, datos)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const juegos = [
  // SOLO
  { cat:"solo", nombre:"20 Verdades de Colón", emoji:"🧠", duracion:"5-10 min",
    desc:"Tenés que adivinar un lugar o personaje de Colón. Solo podés hacer 20 preguntas con respuesta SÍ o NO.",
    instrucciones:["Pensá en un lugar secreto de Colón","Hacete estas preguntas mentalmente","¿Está en la costanera? ¿Tiene agua? ¿Es histórico?","Descubrí de qué lugar se trata en 20 preguntas o menos"],
    datos:{ lugares:["Molino Forclaz","Termas Colón","Playa Honda","Puerto Fluvial","Parque El Palmar","Museo Histórico"] } },
  { cat:"solo", nombre:"Fotógrafo Secreto", emoji:"📸", duracion:"10 min",
    desc:"Misiones fotográficas para completar. Cada foto tiene un puntaje según la dificultad.",
    instrucciones:["Tomate 10 minutos","Completá la mayor cantidad de fotos posibles","Cada foto vale puntos","Sumalas al final"],
    datos:{ misiones:[
      {puntos:1,tarea:"Una foto de algo azul natural"},{puntos:2,tarea:"El reflejo del río en algo"},
      {puntos:3,tarea:"Una foto artística del cielo"},{puntos:2,tarea:"Algo que solo existe en Colón"},
      {puntos:3,tarea:"Una sombra interesante"}
    ]} },
  { cat:"solo", nombre:"Trivia Colonense", emoji:"🏆", duracion:"5 min",
    desc:"¿Cuánto sabés de Colón? 10 preguntas de historia, naturaleza y cultura local.",
    instrucciones:["Leé cada pregunta","Pensá tu respuesta","Verificá el resultado","Sumá 1 punto por cada acierto"],
    datos:{ preguntas:[
      {p:"¿A cuántos km está el Parque Nacional El Palmar?",r:"55 km (por Ruta 14)"},
      {p:"¿Cómo se llama el molino histórico del S.XIX?",r:"Molino Forclaz"},
      {p:"¿En qué año fue fundada la ciudad de Colón?",r:"1863"},
      {p:"¿Qué río bordea la costa de Colón?",r:"El río Uruguay"},
      {p:"¿Cuál es el pez más buscado en la pesca deportiva local?",r:"El dorado"},
    ]} },
  { cat:"solo", nombre:"Bingo del Viajero", emoji:"🎰", duracion:"indefinido",
    desc:"Cartón de bingo con cosas para ver y vivir en Colón. ¡Marcá lo que encontrés a tu alrededor!",
    instrucciones:["Mirá el cartón","Marcá todo lo que veas o hayas hecho hoy","¿Completás una línea?"],
    datos:{ casillas:["Palmera","Barco en el río","Heladería","Persona con mate","Bandera argentina","Cartel de playa","Bicicleta","Pájaro colorido","Puesto de artesanías","Persona haciendo running"] } },
  // PAREJA
  { cat:"pareja", nombre:"¿Me conocés?", emoji:"💑", duracion:"15 min",
    desc:"Uno escribe la respuesta a una pregunta sobre sí mismo. El otro adivina.",
    instrucciones:["Cada uno anota su respuesta en silencio","El otro adivina en voz alta","Comparen resultados","Gana quien más acierta"],
    datos:{ preguntas:["¿Cuál sería tu plan ideal para este fin de semana?","¿Qué plato pedirías si fueras a Campo Adentro?","¿Preferís la playa de mañana o al atardecer?","¿Qué lugar de Colón te gustaría volver a visitar?","¿Termas o río? ¿Por qué?","¿Qué recordarías más de este viaje?"] } },
  { cat:"pareja", nombre:"Adivina Mi Foto", emoji:"📷", duracion:"10 min",
    desc:"Uno saca una foto sin mostrarla. El otro tiene que adivinar qué fotografió solo con 5 pistas.",
    instrucciones:["Uno saca una foto de algo a su alrededor sin mostrarla","Da 5 pistas de a una, de más difícil a más fácil","El otro adivina cuándo puede","Más rápido = más puntos"],
    datos:{} },
  { cat:"pareja", nombre:"Este o Aquél — Colón Edition", emoji:"🔀", duracion:"10 min",
    desc:"Dilemas relacionados con el viaje. Turnos alternados, sin pensarlo más de 5 segundos.",
    instrucciones:["Turnos alternados","Sin pensarlo más de 5 segundos","Si tarda más de 5 seg, el otro elige"],
    datos:{ dilemas:["¿Termas o río natural?","¿Amanecer o atardecer en la costa?","¿Parrilla o pescado del río?","¿Playa sola o llena de gente?","¿Quedarse más días o explorar otro destino?","¿Kayak o excursión náutica?"] } },
  // AMIGOS
  { cat:"amigos", nombre:"Yo nunca... en Colón", emoji:"🙅", duracion:"20 min",
    desc:"Versión viajera del clásico. Quien SÍ lo hizo, toma o hace una penitencia.",
    instrucciones:["En ronda, cada uno dice: 'Yo nunca...' + algo del viaje","Quien sí lo hizo, cumple la penitencia","Penitencias: contar un secreto, hacer un reto, etc."],
    datos:{ ejemplos:["Yo nunca me tiré al río Uruguay","Yo nunca fui a las termas","Yo nunca probé el dorado a la parrilla","Yo nunca madrugué para ver el amanecer en la playa","Yo nunca me perdí en Colón"] } },
  { cat:"amigos", nombre:"Carrera de Conocimiento", emoji:"🏁", duracion:"20 min",
    desc:"Trivia en equipos sobre Colón y Entre Ríos. Primer equipo en llegar a 10 puntos gana.",
    instrucciones:["Dividirse en 2 equipos","Turnos alternados de preguntas","1 punto por respuesta correcta","Primero en llegar a 10 gana"],
    datos:{ preguntas:[
      {p:"¿Qué palma es emblema del Parque El Palmar?",r:"Palma yatay"},
      {p:"¿En qué provincia argentina está Colón?",r:"Entre Ríos"},
      {p:"¿Cómo se llama el palacio del Gral. Urquiza cerca de Colón?",r:"Palacio San José"},
      {p:"¿Qué animal autóctono abunda en el Parque El Palmar?",r:"Carpincho / yacaré"},
      {p:"¿Qué puente une Colón (AR) con Paysandú (UY)?",r:"Puente Gral. Artigas"},
    ]} },
  { cat:"amigos", nombre:"Reto Físico Costanero", emoji:"🏃", duracion:"15 min",
    desc:"Minijuegos para hacer en la costanera. Cada reto vale puntos.",
    instrucciones:["Solo se necesita el cuerpo y el entorno","Un árbitro con el teléfono","Completar el reto para sumar puntos"],
    datos:{ retos:[
      {pts:1,reto:"¿Quién llega primero a ese árbol? (sprint 20m)"},
      {pts:2,reto:"¿Quién aguanta más tiempo en equilibrio sobre un pie?"},
      {pts:3,reto:"Contar los barcos/kayaks visibles desde la orilla"},
      {pts:2,reto:"Tirar una piedra al río — ¿quién hace más rebotes?"},
    ]} },
  // FAMILIA
  { cat:"familia", nombre:"Buscador de Colón", emoji:"🔍", duracion:"15 min",
    desc:"Lista de objetos y cosas para encontrar caminando por la costanera.",
    instrucciones:["Cada uno tiene la misma lista","Salen juntos a buscar","Primero en encontrar todo o más cosas en 15 min gana"],
    datos:{ buscar:["Una piedra redonda","Algo del color naranja","Un pájaro","El nombre de una calle","Algo de madera vieja","Un barco o lancha","Una flor silvestre","La sombra de una persona"] } },
  { cat:"familia", nombre:"¿Quién soy? — Versión Colón", emoji:"🎭", duracion:"20 min",
    desc:"Post-it en la frente (o usar la mano tapando). Adivinás quién sos haciendo preguntas SÍ/NO.",
    instrucciones:["Un jugador piensa en un 'personaje' o lugar de Colón","Los demás hacen preguntas de SÍ/NO","Máximo 20 preguntas"],
    datos:{ personajes:["El Dorado","El Molino Forclaz","Las Termas","El río Uruguay","El Carpincho","La Palmera Yatay","Un kayak","La Playa Norte"] } },
  { cat:"familia", nombre:"Cuentacuentos del Río", emoji:"📖", duracion:"15 min",
    desc:"Todos juntos inventan una historia de aventuras ambientada en Colón.",
    instrucciones:["Alguien empieza: 'Había una vez en Colón...'","Cada uno agrega UNA frase en su turno","La historia debe incluir: el río, un animal, una aventura"],
    datos:{ inicio:["Había una vez un carpincho que vivía en la orilla del Uruguay...","Una tarde en la Playa Norte, una familia encontró una botella con un mapa...","El guardaparques del Palmar descubrió algo increíble entre las palmeras..."] } },
  { cat:"familia", nombre:"Mini Olimpiadas Familiares", emoji:"🥇", duracion:"20 min",
    desc:"5 pruebas rápidas para hacer en cualquier lugar.",
    instrucciones:["5 pruebas, 5 campeones posibles","Árbitro: el que tiene el teléfono","Al final, el que ganó más pruebas es el Campeón Familiar"],
    datos:{ pruebas:["Equilibrio: ¿quién para más tiempo en un pie con los ojos cerrados?","Memoria: mirar 10 segundos la pantalla, dar vuelta y decir de qué color era cada emoji","Velocidad mental: primero en decir 5 cosas que se ven desde acá","Artístico: mejor dibujo de un carpincho en el teléfono (notas)","Conocimiento: ¿quién sabe más capitales de provincias argentinas?"] } },
];

for (const j2 of juegos) {
  insJuego.run(j2.cat, j2.nombre, j2.desc, j2.emoji, j2.duracion, j(j2.instrucciones), j(j2.datos));
}
console.log(`✓ ${juegos.length} juegos insertados`);

console.log('\n✅ Seed completado. Base de datos lista en server/db/colon360.db');
