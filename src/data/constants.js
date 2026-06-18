// ─── Constantes de UI que viven en el frontend ───────────────────────────────

export const FRANJA_ORDER = ["manana", "mediodia", "tarde", "noche"];
export const FRANJA_COLOR = { manana:"#F9A825", mediodia:"#2E7D32", tarde:"#1E88E5", noche:"#7B1FA2" };
export const FRANJA_LABEL = { manana:"Mañana", mediodia:"Mediodía", tarde:"Tarde", noche:"Noche" };
export const FRANJA_EMOJI = { manana:"🌅", mediodia:"☀️", tarde:"🌇", noche:"🌙" };

export const CAT_COLOR = {
  Playa:"#1E88E5", Hotel:"#2E7D32", "Rest.":"#F9A825",
  Café:"#795548", Atracción:"#1565C0", Salud:"#e53935", Deporte:"#2E7D32",
};

export const HEAT_ZONES = [
  { id:"playa_norte",  label:"Playa Norte",   lat:-32.2118, lng:-58.1335, type:"playa",       peak:[9,16],  emoji:"🏖️" },
  { id:"playa_honda",  label:"Playa Honda",   lat:-32.2332, lng:-58.1315, type:"playa",       peak:[9,15],  emoji:"🏖️" },
  { id:"costanera",    label:"Costanera",     lat:-32.2252, lng:-58.1330, type:"paseo",       peak:[17,20], emoji:"🌊" },
  { id:"centro_gast",  label:"Zona Gastro",   lat:-32.2278, lng:-58.1440, type:"gastronomia", peak:[12,14], emoji:"🍽️" },
  { id:"centro_noche", label:"Vida Nocturna", lat:-32.2263, lng:-58.1435, type:"noche",       peak:[21,0],  emoji:"🎶" },
  { id:"palmar",       label:"El Palmar",     lat:-32.1868, lng:-58.0896, type:"naturaleza",  peak:[8,17],  emoji:"🌴" },
];
export const HEAT_COLOR = {
  playa:"#1E88E5", paseo:"#FF6F00", gastronomia:"#2E7D32", noche:"#7B1FA2", naturaleza:"#43A047",
};

export const PERFILES = [
  { id:"pareja",   emoji:"💑",  label:"En pareja",    sub:"Romántico y relajado" },
  { id:"amigos",   emoji:"🥂",  label:"Con amigos",   sub:"Diversión y aventura" },
  { id:"familia",  emoji:"🏠",  label:"En familia",   sub:"Para todos las edades" },
  { id:"ninos",    emoji:"👪",  label:"Con niños",    sub:"Actividades para chicos" },
  { id:"solo",     emoji:"🧭",  label:"Solo/a",       sub:"A tu ritmo y libertad" },
  { id:"mascotas", emoji:"🐾",  label:"Con mascotas", sub:"Pet-friendly al máximo" },
];

export const TEMAS = [
  { id:"playa",       emoji:"🏖️", label:"Playa y río" },
  { id:"historia",    emoji:"🏛️", label:"Historia y cultura" },
  { id:"gastronomia", emoji:"🍽️", label:"Gastronomía" },
  { id:"naturaleza",  emoji:"🌴", label:"Naturaleza" },
  { id:"relax",       emoji:"♨️", label:"Relax y termas" },
  { id:"aventura",    emoji:"🧗", label:"Aventura y deporte" },
  { id:"noche",       emoji:"🎶", label:"Vida nocturna" },
  { id:"compras",     emoji:"🛒", label:"Artesanías" },
];

export const PERFIL_TIPS = {
  pareja:   ["Reservá mesa con vista al río en Terrazas de Colón","El atardecer desde la costanera es el momento más romántico","Las termas son ideales para una mañana en pareja"],
  amigos:   ["Brown 38 es el punto de encuentro nocturno","La Playa Inkier tiene el mejor ambiente grupal","Organizá una excursión náutica en grupo"],
  familia:  ["El Parque Quirós tiene juegos y es ideal para todas las edades","La Playa Norte es cómoda y segura para toda la familia","Las termas tienen piletas ideales para chicos y adultos"],
  ninos:    ["Playa Norte es la más segura para chicos","Molino Aventura tiene actividades desde 4 años","La Heladería El Rey es parada obligatoria"],
  solo:     ["La ciclovía costanera es perfecta para explorar a tu ritmo","El Parque El Palmar se recorre mejor temprano","Los guías locales ofrecen recorridos personalizados"],
  mascotas: ["Parque Quirós permite mascotas con correa","La Playa Norte tiene sectores pet-friendly","El Parque Nacional El Palmar no permite mascotas"],
};

export const ALMUERZOS_FALLBACK = [
  { emoji:"🥩", titulo:"Parrilla Don Coco",  desc:"El asado de referencia en Colón. Fuego lento y cortes nobles.", color:"#F9A825" },
  { emoji:"🍝", titulo:"La Estancia",        desc:"Pastas caseras en ambiente íntimo. Un clásico que no falla.", color:"#F9A825" },
  { emoji:"🌊", titulo:"Terrazas de Colón",  desc:"Cocina de autor con vista al río Uruguay.", color:"#F9A825" },
  { emoji:"🥩", titulo:"El Establo",         desc:"Minutas, parrilla y pescado en el corazón de Colón.", color:"#F9A825" },
];

// Fases del ejercicio de respiración
export const BREATH_CYCLE = [
  { phase:"inhale", label:"Inhalá...",     duration:4000, scale:1.4 },
  { phase:"hold",   label:"Sostené...",    duration:4000, scale:1.4 },
  { phase:"exhale", label:"Exhalá...",     duration:6000, scale:1.0 },
  { phase:"rest",   label:"Descansá...",   duration:2000, scale:1.0 },
];
