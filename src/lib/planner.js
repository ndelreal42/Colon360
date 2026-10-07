
// ─── PLANNER ──────────────────────────────────────────────────────────────────

export const PERFILES = [
  {id:"pareja",   emoji:"💑",  label:"En pareja",     sub:"Romántico y relajado"},
  {id:"amigos",   emoji:"🥂",  label:"Con amigos",    sub:"Diversión y aventura"},
  {id:"familia",  emoji:"🏠",  label:"En familia",    sub:"Para todas las edades"},
  {id:"ninos",    emoji:"👪",  label:"Con niños",     sub:"Actividades para chicos"},
  {id:"solo",     emoji:"🧭",  label:"Solo/a",        sub:"A tu ritmo y libertad"},
  {id:"mascotas", emoji:"🐾",  label:"Con mascotas",  sub:"Pet-friendly"},
];

export const TEMAS = [
  {id:"playa",    emoji:"🏖️", label:"Playa y río"},
  {id:"historia", emoji:"🏛️", label:"Historia y cultura"},
  {id:"gastronomia",emoji:"🍽️",label:"Gastronomía"},
  {id:"naturaleza",emoji:"🌴",label:"Naturaleza"},
  {id:"relax",   emoji:"♨️",  label:"Relax y termas"},
  {id:"aventura",emoji:"🧗",  label:"Aventura y deporte"},
  {id:"noche",   emoji:"🎶",  label:"Vida nocturna"},
  {id:"compras", emoji:"🛒",  label:"Artesanías"},
];

// ─── Actividades por FRANJA: una sola por franja por día
// franja: manana | mediodia | tarde | noche
export const POOL = {
  playa: [
    {franja:"manana",  emoji:"☀️",  titulo:"Playa Norte",             desc:"La más familiar y tranquila. Arena fina, aguas calmas y sombra natural.", color:"#1E88E5"},
    {franja:"manana",  emoji:"🏖️",  titulo:"Playa Honda",             desc:"Más íntima y serena. Aguas profundas y entorno verde. Ideal para descansar.", color:"#1E88E5"},
    {franja:"manana",  emoji:"🏄",  titulo:"Playa Inkier",            desc:"La más animada. Música, gente y energía con el Uruguay de fondo.", color:"#1565C0"},
    {franja:"tarde",   emoji:"🏝️",  titulo:"Excursión a las Islas",  desc:"Lancha hasta islas vírgenes del delta entrerriano. Una experiencia única.", color:"#1E88E5"},
    {franja:"tarde",   emoji:"🌅",  titulo:"Costanera al atardecer",  desc:"La caminata más fotogénica de Colón. El sol se hunde sobre el río Uruguay.", color:"#42A5F5"},
  ],
  historia: [
    {franja:"manana",  emoji:"🏛️",  titulo:"Molino Forclaz",          desc:"Visita guiada al patrimonio histórico del siglo XIX. Historia y arquitectura.", color:"#795548"},
    {franja:"manana",  emoji:"🏺",  titulo:"Museo Histórico Regional",desc:"La historia de Colón desde 1863. Arqueología, inmigrantes europeos y mucho más.", color:"#795548"},
    {franja:"tarde",   emoji:"🏚️",  titulo:"Ruinas del Falansterio",  desc:"El experimento social más singular del S.XIX en Argentina. Historia fascinante.", color:"#795548"},
    {franja:"tarde",   emoji:"🪖",  titulo:"Museo Zona Darwin",       desc:"Homenaje a los veteranos de Malvinas de Colón. Emotivo e histórico.", color:"#1565C0"},
    {franja:"noche",   emoji:"🎭",  titulo:"Visita Nocturna al Molino",desc:"La visita teatralizada nocturna más especial de Entre Ríos. Magia e historia.", color:"#795548"},
  ],
  gastronomia: [
    {franja:"manana",  emoji:"☕",  titulo:"Gaman Café",              desc:"Café de especialidad y laminados artesanales. El mejor desayuno de Colón.", color:"#795548"},
    {franja:"mediodia",emoji:"🎶",  titulo:"Campo Adentro",           desc:"Pescados de río, show folklórico y el ambiente más auténtico del litoral.", color:"#2E7D32"},
    {franja:"mediodia",emoji:"🥩",  titulo:"Parrilla Don Coco",       desc:"El asado de referencia en Colón. Fuego lento, cortes nobles y sabor criollo.", color:"#F9A825"},
    {franja:"mediodia",emoji:"🍝",  titulo:"La Estancia",             desc:"Pastas caseras en ambiente íntimo. Un clásico que no defrauda.", color:"#F9A825"},
    {franja:"mediodia",emoji:"🌊",  titulo:"Terrazas de Colón",       desc:"Cocina de autor con vista al río Uruguay. Para un almuerzo memorable.", color:"#F9A825"},
    {franja:"tarde",   emoji:"🍦",  titulo:"Heladería El Rey",        desc:"Helados artesanales de generación en generación. Parada obligatoria.", color:"#F9A825"},
    {franja:"noche",   emoji:"🎶",  titulo:"Campo Adentro (noche)",   desc:"La noche perfecta: dorado, peñas folklóricas y río Uruguay de fondo.", color:"#2E7D32"},
    {franja:"noche",   emoji:"🍺",  titulo:"Brown 38",                desc:"Picadas, tragos y buen ambiente. El lugar de la noche colonense.", color:"#1565C0"},
  ],
  naturaleza: [
    // Palmar = día entero, tiene sus propios sub-bloques por franja
    {franja:"dia_completo", emoji:"🌴", titulo:"Parque Nacional El Palmar", subBloques:[
      {franja:"manana",  emoji:"🌴",  titulo:"Partida y llegada al Palmar",     desc:"Salida temprana desde Colón. 55 km por Ruta 14. Vale cada kilómetro.", color:"#2E7D32"},
      {franja:"manana",  emoji:"🦜",  titulo:"Recorrido El Palmar",            desc:"Senderos entre palmeras yatay centenarias. Carpinchos, yacarés y aves en libertad.", color:"#2E7D32"},
      {franja:"mediodia",emoji:"🥙",  titulo:"Almuerzo en el Parque",          desc:"Picnic o parrilla en las instalaciones del Parque Nacional.", color:"#2E7D32"},
      {franja:"tarde",   emoji:"📸",  titulo:"Atardecer en el Palmar",         desc:"Las palmeras yatay se tiñen de naranja. La foto más buscada de Entre Ríos.", color:"#F9A825"},
      {franja:"noche",   emoji:"🚗",  titulo:"Regreso a Colón",                desc:"Vuelta tranquila por Ruta 14. Aprox. 45 minutos.", color:"#795548"},
    ]},
    {franja:"tarde",   emoji:"🌳",  titulo:"Parque Quirós",            desc:"El pulmón verde de Colón sobre la costanera. Caminata y vista al río.", color:"#2E7D32"},
    {franja:"tarde",   emoji:"🏝️",  titulo:"Excursión náutica",        desc:"Recorrido por el delta del Uruguay. Islas, fauna y naturaleza ribereña.", color:"#1E88E5"},
  ],
  relax: [
    {franja:"manana",  emoji:"♨️",  titulo:"Termas Colón",             desc:"Aguas minerales a 40°C. Spa, hidromasajes y relax total.", color:"#1E88E5"},
    {franja:"tarde",   emoji:"🌅",  titulo:"Atardecer en la costanera",desc:"La tarde más relajante: el sol se hunde sobre el río Uruguay.", color:"#42A5F5"},
    {franja:"noche",   emoji:"💆",  titulo:"Spa Termas Colón",         desc:"Masajes y tratamientos de bienestar en el complejo termal.", color:"#1E88E5"},
  ],
  aventura: [
    {franja:"manana",  emoji:"🧗",  titulo:"Molino Aventura",          desc:"Tirolesas, escalada y circuitos de cuerdas. Adrenalina en entorno natural.", color:"#F9A825"},
    {franja:"manana",  emoji:"🚴",  titulo:"Cicloturismo costanero",   desc:"Recorrido en bici por la costanera. 8 km de naturaleza y vistas al río.", color:"#2E7D32"},
    {franja:"tarde",   emoji:"⛵",  titulo:"Kayak en el río",          desc:"Recorrido en kayak por los arroyos del delta. Adrenalina suave y naturaleza.", color:"#1E88E5"},
    {franja:"manana",  emoji:"⛳",  titulo:"Golf Club Los Bretes",     desc:"Campo de 18 hoyos en entorno natural privilegiado. Abierto a visitantes.", color:"#2E7D32"},
    // Pesca = día entero
    {franja:"dia_completo", emoji:"🎣", titulo:"Pesca del Dorado", subBloques:[
      {franja:"manana",  emoji:"🎣",  titulo:"Salida de pesca al amanecer", desc:"Madrugada en el Puerto Fluvial. El guía te espera con la embarcación lista.", color:"#1565C0"},
      {franja:"manana",  emoji:"🌊",  titulo:"Pesca en el río Uruguay",    desc:"Con guía habilitado en el río Uruguay. El dorado entrerriano es legendario.", color:"#1565C0"},
      {franja:"mediodia",emoji:"🍽️", titulo:"Campo Adentro",              desc:"Llegás con hambre real. El dorado a la parrilla es el cierre perfecto.", color:"#2E7D32"},
      {franja:"tarde",   emoji:"😴",  titulo:"Tarde libre",                desc:"Después de madrugar, tarde tranquila para descansar o recorrer el centro.", color:"#795548"},
    ]},
  ],
  noche: [
    {franja:"noche",   emoji:"🎶",  titulo:"Campo Adentro (show)",    desc:"Show folklórico en vivo con el mejor pescado del litoral. Colón de noche.", color:"#2E7D32"},
    {franja:"noche",   emoji:"🍺",  titulo:"Brown 38",                desc:"El bar de Colón. Tragos, picadas y un ambiente que invita a quedarse.", color:"#1565C0"},
    {franja:"noche",   emoji:"🌟",  titulo:"Feria Costanera",         desc:"Artesanos, música y gastronomía sobre la costanera del río.", color:"#F9A825"},
  ],
  compras: [
    {franja:"manana",  emoji:"🎨",  titulo:"La Casona Artesanos",     desc:"Más de 30 artesanos locales. Tejidos, cerámica y madera en espacio histórico.", color:"#F9A825"},
    {franja:"tarde",   emoji:"⚓",  titulo:"Feria Manos del Puerto",  desc:"Artesanía regional con vista al Puente Internacional.", color:"#1E88E5"},
    {franja:"tarde",   emoji:"🛍️",  titulo:"Paseo del Sol",           desc:"Centro comercial a cielo abierto en el corazón de Colón.", color:"#F9A825"},
  ],
};

export const PERFIL_TIPS = {
  pareja:   ["Reservá mesa con vista al río en Terrazas de Colón","El atardecer desde la costanera es el momento más romántico","Las termas son ideales para una mañana en pareja"],
  amigos:   ["Brown 38 es el punto de encuentro nocturno","La Playa Inkier tiene el mejor ambiente grupal","Organizá una excursión náutica en grupo"],
  familia:  ["El Parque Quirós tiene juegos y es ideal para todas las edades","La Playa Norte es cómoda y segura para toda la familia","Las termas tienen piletas ideales para chicos y adultos"],
  ninos:    ["Playa Norte es la más segura para chicos","Molino Aventura tiene actividades desde 4 años","La Heladería El Rey es parada obligatoria"],
  solo:     ["La ciclovía costanera es perfecta para explorar a tu ritmo","El Parque El Palmar se recorre mejor temprano","Los guías locales ofrecen recorridos personalizados"],
  mascotas: ["Parque Quirós permite mascotas con correa","La Playa Norte tiene sectores pet-friendly","El Parque Nacional El Palmar no permite mascotas"],
};

export const FRANJA_ORDER = ["manana","mediodia","tarde","noche"];
export const FRANJA_COLOR = { manana:"#F9A825", mediodia:"#2E7D32", tarde:"#1E88E5", noche:"#7B1FA2" };
export const FRANJA_LABEL = { manana:"Mañana", mediodia:"Mediodía", tarde:"Tarde", noche:"Noche" };
export const FRANJA_EMOJI = { manana:"🌅", mediodia:"☀️", tarde:"🌇", noche:"🌙" };

// Almuerzos fallback rotativos
export const ALMUERZOS_FALLBACK = [
  {emoji:"🥩", titulo:"Parrilla Don Coco",  desc:"El asado de referencia en Colón. Fuego lento y cortes nobles.", color:"#F9A825"},
  {emoji:"🍝", titulo:"La Estancia",        desc:"Pastas caseras en ambiente íntimo. Un clásico que no falla.", color:"#F9A825"},
  {emoji:"🌊", titulo:"Terrazas de Colón",  desc:"Cocina de autor con vista al río Uruguay.", color:"#F9A825"},
  {emoji:"🥩", titulo:"El Establo",         desc:"Minutas, parrilla y pescado en el corazón de Colón.", color:"#F9A825"},
];

export function generarItinerario(dias, perfil, temas) {
  const diasNum     = Math.max(parseInt(dias)||1, 1);
  const temasActivos = temas.length > 0 ? temas : ["playa","gastronomia"];
  const resultado   = [];
  const usadosGlobal = new Set();

  const quierePalmar = temasActivos.includes("naturaleza");
  const quierePesca  = temasActivos.includes("aventura") && !perfil.some(p=>["ninos","familia"].includes(p));

  for(let d=1; d<=diasNum; d++){

    // ── Día excursión Palmar (día 2 si hay varios, sino día 1) ──────────────
    if(quierePalmar && !usadosGlobal.has("__palmar") && (diasNum===1 || d===2)){
      usadosGlobal.add("__palmar");
      const palmar = POOL.naturaleza.find(b=>b.franja==="dia_completo"&&b.titulo==="Parque Nacional El Palmar");
      resultado.push({dia:d, bloques:palmar.subBloques, esExcursion:true, excursionLabel:"Excursión · Parque El Palmar"});
      continue;
    }

    // ── Día excursión pesca (día 3 si hay suficientes días) ─────────────────
    if(quierePesca && !usadosGlobal.has("__pesca") && d===3){
      usadosGlobal.add("__pesca");
      const pesca = POOL.aventura.find(b=>b.franja==="dia_completo"&&b.titulo==="Pesca del Dorado");
      resultado.push({dia:d, bloques:pesca.subBloques, esExcursion:true, excursionLabel:"Excursión · Pesca del Dorado"});
      continue;
    }

    // ── Día normal: exactamente una actividad por franja ────────────────────
    const diaFranjas = {manana:null, mediodia:null, tarde:null, noche:null};
    const temasRot   = d%2===0 ? [...temasActivos].reverse() : [...temasActivos];

    for(const franja of FRANJA_ORDER){
      for(const tema of temasRot){
        const candidatos = (POOL[tema]||[]).filter(b=>
          b.franja===franja &&
          !b.subBloques &&
          !usadosGlobal.has(b.titulo)
        );
        if(!candidatos.length) continue;
        const b = candidatos[(d-1) % candidatos.length];
        diaFranjas[franja] = b;
        usadosGlobal.add(b.titulo);
        break; // una actividad por franja, siguiente franja
      }
    }

    // ── Garantizar mediodía (almuerzo) ──────────────────────────────────────
    if(!diaFranjas.mediodia){
      const opt = ALMUERZOS_FALLBACK.find(a=>!usadosGlobal.has(a.titulo)) || ALMUERZOS_FALLBACK[d%ALMUERZOS_FALLBACK.length];
      diaFranjas.mediodia = {franja:"mediodia", ...opt};
      usadosGlobal.add(opt.titulo);
    }

    // ── Garantizar tarde ────────────────────────────────────────────────────
    if(!diaFranjas.tarde){
      diaFranjas.tarde = {franja:"tarde", emoji:"🌅", titulo:"Costanera al atardecer", desc:"La caminata más fotogénica de Colón. El sol cae sobre el río Uruguay.", color:"#42A5F5"};
    }

    // ── Ajustes por perfil ──────────────────────────────────────────────────
    if((perfil.includes("ninos")||perfil.includes("familia")) && !usadosGlobal.has("Heladería El Rey")){
      usadosGlobal.add("Heladería El Rey");
      diaFranjas.tarde = {franja:"tarde", emoji:"🍦", titulo:"Heladería El Rey", desc:"Helados artesanales de generación en generación. El ritual colonense.", color:"#F9A825"};
    }
    if(perfil.includes("mascotas") && !usadosGlobal.has("Parque Quirós")){
      usadosGlobal.add("Parque Quirós");
      diaFranjas.tarde = {franja:"tarde", emoji:"🐾", titulo:"Parque Quirós", desc:"El espacio verde más amigable para pasear con tu mascota sobre la costanera.", color:"#2E7D32"};
    }

    const bloques = FRANJA_ORDER.map(f=>diaFranjas[f]).filter(Boolean);
    resultado.push({dia:d, bloques});
  }
  return resultado;
}


// ─── Info extra por lugar (para modal) ──────────────────────────────────────
export const LUGAR_INFO = {
  "Playa Norte":             [{icon:"📍",label:"Ubicación",value:"Costanera Norte, Colón"},{icon:"✅",label:"Servicios",value:"Parrillas, duchas, estacionamiento, sombrilla"},{icon:"👶",label:"Ideal para",value:"Familias con niños, aguas tranquilas"},{icon:"🕐",label:"Horario",value:"Todo el día, temporada dic-mar"}],
  "Playa Honda":             [{icon:"📍",label:"Ubicación",value:"Costanera Sur, Colón"},{icon:"🌊",label:"Característica",value:"Aguas profundas, menos concurrida"},{icon:"💑",label:"Ideal para",value:"Parejas y quienes buscan tranquilidad"},{icon:"⚠️",label:"Atención",value:"Aguas más profundas, cuidado con niños"}],
  "Playa Inkier":            [{icon:"📍",label:"Ubicación",value:"Acceso por Ruta 135"},{icon:"🎶",label:"Ambiente",value:"Animado, música, ideal para jóvenes"},{icon:"🏄",label:"Actividades",value:"Deportes acuáticos, vóley de playa"},{icon:"🕐",label:"Temporada alta",value:"Enero - Febrero"}],
  "Termas Colón":            [{icon:"📍",label:"Dirección",value:"Ruta 135 s/n, Colón"},{icon:"📞",label:"Teléfono",value:"(03447) 421-098"},{icon:"💰",label:"Precio",value:"Entrada general aprox. $8.000"},{icon:"🕐",label:"Horario",value:"8:00 a 20:00 todos los días"}],
  "Parque Nacional El Palmar":[{icon:"📍",label:"Distancia",value:"55 km de Colón por Ruta 14"},{icon:"🕐",label:"Horario",value:"8:00 a 18:00 todos los días"},{icon:"💰",label:"Entrada",value:"Arancelada, tarjeta aceptada"},{icon:"🌿",label:"Fauna",value:"Carpinchos, yacarés, garzas, zorros"}],
  "Parque Quirós":           [{icon:"📍",label:"Ubicación",value:"Costanera, entre Av. Quirós y Gouchon"},{icon:"🐾",label:"Mascotas",value:"Permitidas con correa"},{icon:"🏃",label:"Actividades",value:"Running, ciclismo, juegos infantiles"},{icon:"🕐",label:"Horario",value:"Abierto las 24hs"}],
  "Molino Forclaz":          [{icon:"📍",label:"Dirección",value:"Av. 12 de Abril s/n, Colón"},{icon:"🎭",label:"Visita",value:"Guiada, teatralizada y nocturna"},{icon:"📞",label:"Contacto",value:"Secretaría de Turismo Colón"},{icon:"🏛️",label:"Historia",value:"Construcción del S.XIX, declarado Patrimonio"}],
  "Gaman Café":              [{icon:"📍",label:"Dirección",value:"Centro de Colón"},{icon:"☕",label:"Especialidad",value:"Café de filtro, V60, cold brew"},{icon:"🥐",label:"Para comer",value:"Medialunas, tostados, laminados artesanales"},{icon:"🕐",label:"Horario",value:"7:00 a 13:00 y 16:00 a 21:00"}],
  "Campo Adentro":           [{icon:"📍",label:"Dirección",value:"Alejo Peyret y Chacabuco, Colón"},{icon:"📞",label:"Teléfono",value:"(03447) 422-003"},{icon:"🎶",label:"Show",value:"Folklore en vivo, viernes y sábados"},{icon:"🐟",label:"Especialidad",value:"Dorado y surubí a la parrilla"}],
  "Campo Adentro (noche)":   [{icon:"📍",label:"Dirección",value:"Alejo Peyret y Chacabuco, Colón"},{icon:"📞",label:"Teléfono",value:"(03447) 422-003"},{icon:"🎶",label:"Show",value:"Folklore en vivo, viernes y sábados"},{icon:"🕐",label:"Horario",value:"A partir de las 20:30"}],
  "Parrilla Don Coco":       [{icon:"🥩",label:"Especialidad",value:"Asado, vacío, costilla al fuego lento"},{icon:"📍",label:"Zona",value:"Centro de Colón"},{icon:"💰",label:"Precio",value:"Moderado, porciones generosas"},{icon:"👪",label:"Ideal para",value:"Familias y grupos"}],
  "La Estancia":             [{icon:"📍",label:"Dirección",value:"Av. Urquiza 212, Colón"},{icon:"📞",label:"Teléfono",value:"(03447) 422-153"},{icon:"🍝",label:"Especialidad",value:"Pastas caseras, ñoquis, ravioles"},{icon:"🕐",label:"Horario",value:"12:00 a 15:00 y 20:00 a 23:00"}],
  "Terrazas de Colón":       [{icon:"📍",label:"Dirección",value:"San Martín 144, Colón"},{icon:"🌊",label:"Vista",value:"Terraza con vista directa al río Uruguay"},{icon:"🍷",label:"Especialidad",value:"Cocina de autor, carta de vinos entrerrianos"},{icon:"💡",label:"Tip",value:"Reservar con anticipación en temporada"}],
  "Heladería El Rey":        [{icon:"📍",label:"Dirección",value:"12 de Abril 117, Colón"},{icon:"🍦",label:"Elaboración",value:"Artesanal, receta familiar de 3 generaciones"},{icon:"⭐",label:"Sabores top",value:"Dulce de leche granizado, crema tramontana"},{icon:"🕐",label:"Horario",value:"12:00 a 24:00 en temporada"}],
  "Brown 38":                [{icon:"📍",label:"Dirección",value:"Alte G. Brown 38, Colón"},{icon:"🍺",label:"Ambiente",value:"Bar con música, copetines y picadas"},{icon:"🕐",label:"Horario",value:"18:00 a 2:00"},{icon:"🎶",label:"Música",value:"Rock y pop en vivo los fines de semana"}],
  "Molino Aventura":         [{icon:"📍",label:"Ubicación",value:"Acceso por Ruta 135, Colón"},{icon:"🧗",label:"Actividades",value:"Tirolesa, escalada, circuito de cuerdas"},{icon:"👦",label:"Edad mínima",value:"Desde 4 años para circuitos infantiles"},{icon:"💰",label:"Precio",value:"Circuito completo aprox. $15.000"}],
  "Cicloturismo costanero":  [{icon:"🚴",label:"Recorrido",value:"8 km de ciclovía costera"},{icon:"📍",label:"Inicio",value:"Puerto Fluvial, Colón"},{icon:"🚲",label:"Alquiler",value:"Bicicletas disponibles en el puerto"},{icon:"🌅",label:"Mejor momento",value:"Temprano o al atardecer"}],
  "Kayak en el río":         [{icon:"📍",label:"Punto de partida",value:"Puerto Fluvial, Colón"},{icon:"⛵",label:"Duración",value:"1 a 3 horas según recorrido"},{icon:"👤",label:"Guía",value:"Con instructor certificado"},{icon:"💰",label:"Precio",value:"Aprox. $12.000 por persona"}],
  "La Casona Artesanos":     [{icon:"📍",label:"Dirección",value:"Av. Urquiza 40, Colón"},{icon:"📞",label:"Teléfono",value:"(03447) 422-604"},{icon:"🎨",label:"Artesanos",value:"Más de 30 artesanos locales"},{icon:"🕐",label:"Horario",value:"10:00 a 20:00 todos los días"}],
  "Excursión náutica":       [{icon:"📍",label:"Salida",value:"Puerto Fluvial de Colón"},{icon:"⏱️",label:"Duración",value:"2 a 4 horas"},{icon:"🦜",label:"Fauna",value:"Garzas, yacarés, carpinchos en las islas"},{icon:"💰",label:"Precio",value:"Aprox. $18.000 por persona"}],
  "Feria Costanera":         [{icon:"📍",label:"Ubicación",value:"Costanera de Colón"},{icon:"🗓️",label:"Temporada",value:"Diciembre a marzo, viernes a domingos"},{icon:"🎶",label:"Ambiente",value:"Música en vivo, gastronomía, artesanías"},{icon:"🆓",label:"Entrada",value:"Libre y gratuita"}],
  "Museo Histórico Regional":[{icon:"📍",label:"Dirección",value:"Av. 12 de Abril 94, Colón"},{icon:"📞",label:"Teléfono",value:"(03447) 422-116"},{icon:"🕐",label:"Horario",value:"Lunes a viernes 8:00 a 12:00 y 15:00 a 19:00"},{icon:"🆓",label:"Entrada",value:"Gratuita"}],
  "Pesca en el río Uruguay":  [{icon:"📍",label:"Salida",value:"Puerto Fluvial de Colón"},{icon:"🎣",label:"Especie",value:"Dorado y surubí, los más buscados"},{icon:"📋",label:"Requisito",value:"Habilitación de pesca deportiva obligatoria"},{icon:"💰",label:"Precio",value:"Con guía aprox. $30.000 por persona"}],
};
