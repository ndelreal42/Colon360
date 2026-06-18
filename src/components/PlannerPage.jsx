import { useState } from "react";
import {
  PERFILES,
  TEMAS,
  FRANJA_ORDER,
  FRANJA_COLOR,
  FRANJA_LABEL,
  FRANJA_EMOJI,
  ALMUERZOS_FALLBACK,
  PERFIL_TIPS,
} from "../data/constants.js";

const POOL = {
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

function generarItinerario(dias, perfil, temas) {
  const diasNum     = Math.max(parseInt(dias)||1, 1);
  const temasActivos = temas.length > 0 ? temas : ["playa","gastronomia"];
  const resultado   = [];
  const usadosGlobal = new Set();

  const quierePalmar = temasActivos.includes("naturaleza");
  const quierePesca  = temasActivos.includes("aventura") && !["ninos","familia"].includes(perfil);

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
    if((perfil==="ninos"||perfil==="familia") && !usadosGlobal.has("Heladería El Rey")){
      usadosGlobal.add("Heladería El Rey");
      diaFranjas.tarde = {franja:"tarde", emoji:"🍦", titulo:"Heladería El Rey", desc:"Helados artesanales de generación en generación. El ritual colonense.", color:"#F9A825"};
    }
    if(perfil==="mascotas" && !usadosGlobal.has("Parque Quirós")){
      usadosGlobal.add("Parque Quirós");
      diaFranjas.tarde = {franja:"tarde", emoji:"🐾", titulo:"Parque Quirós", desc:"El espacio verde más amigable para pasear con tu mascota sobre la costanera.", color:"#2E7D32"};
    }

    const bloques = FRANJA_ORDER.map(f=>diaFranjas[f]).filter(Boolean);
    resultado.push({dia:d, bloques});
  }
  return resultado;
}


// ─── Info extra por lugar (para modal) ──────────────────────────────────────
const LUGAR_INFO = {
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


export default function PlannerPage({ dias, setDias, perfil, setPerfil, temas, setTemas, result, setResult, modalBloque, setModalBloque, go }) {
  const canGen = dias && perfil && temas.length > 0;

  const toggleTema = (id) => {
    setTemas(prev => prev.includes(id) ? prev.filter(t=>t!==id) : [...prev,id]);
  };

  const generar = () => {
    const r = generarItinerario(dias, perfil, temas);
    setResult(r);
    window.scrollTo(0,0);
  };

  const reset = () => { setResult(null); setDias(""); setPerfil(null); setTemas([]); };

  const descargarPDF = () => {
    const perfilLabel = PERFILES.find(p=>p.id===perfil)?.label || "";
    const temasLabel = temas.map(t=>TEMAS.find(x=>x.id===t)?.label).filter(Boolean).join(", ");
    const tips = PERFIL_TIPS[perfil]||[];

    let html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body{font-family:'Georgia',serif;max-width:700px;margin:0 auto;padding:32px;color:#1a1a2e;background:#fff;}
  h1{font-size:28px;color:#1E88E5;margin-bottom:4px;}
  .sub{font-size:13px;color:#888;margin-bottom:24px;font-family:sans-serif;}
  .dia-header{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#bbb;font-family:sans-serif;margin:24px 0 12px;text-align:center;border-top:1px solid #f0ede6;padding-top:16px;}
  .bloque{display:flex;gap:14px;margin-bottom:12px;align-items:flex-start;}
  .dot{width:36px;height:36px;border-radius:10px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .card{flex:1;background:#fafafa;border-radius:10px;padding:12px 14px;border-left:3px solid #1E88E5;}
  .hora{font-size:10px;color:#1E88E5;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;font-family:sans-serif;}
  .titulo{font-size:16px;font-weight:700;margin:3px 0;}
  .desc{font-size:12px;color:#555;line-height:1.6;font-family:sans-serif;}
  .tips{background:#E3F2FD;border-radius:10px;padding:16px;margin-top:24px;}
  .tips-title{font-size:11px;font-weight:700;color:#1E88E5;text-transform:uppercase;letter-spacing:2px;font-family:sans-serif;margin-bottom:8px;}
  .tip{font-size:12px;color:#333;font-family:sans-serif;margin-bottom:4px;}
  .footer{text-align:center;margin-top:32px;font-size:11px;color:#bbb;font-family:sans-serif;}
</style>
</head>
<body>
<h1>Tu recorrido en Colon 360</h1>
<div class="sub">${dias} dia${dias>1?"s":""} · ${perfilLabel} · Temas: ${temasLabel}</div>
`;
    result.forEach(({dia,bloques,excursionLabel})=>{
      if(result.length>1) html += `<div class="dia-header">Dia ${dia}${excursionLabel?" · "+excursionLabel:""}</div>`;
      bloques.forEach(b=>{
        const franja = b.franja||"manana";
        const fl = ({"manana":"Manana","mediodia":"Mediodia","tarde":"Tarde","noche":"Noche"}[franja]||franja);
        html += `<div class="bloque">
  <div class="dot">${b.emoji}</div>
  <div class="card">
    <div class="hora">${fl}</div>
    <div class="titulo">${b.titulo}</div>
    <div class="desc">${b.desc}</div>
  </div>
</div>`;
      });
    });
    if(tips.length>0){
      html += `<div class="tips"><div class="tips-title">Consejos para tu viaje</div>`;
      tips.forEach(t=>{ html += `<div class="tip">• ${t}</div>`; });
      html += `</div>`;
    }
    html += `<div class="footer">Generado con Colon360 · colonturismo.tur.ar</div></body></html>`;

    const blob = new Blob([html],{type:"text/html"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recorrido-colon-${dias}dias.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const grad = "linear-gradient(135deg,#1E88E5,#2E7D32)";
  const perfilData = PERFILES.find(p=>p.id===perfil);

  return (
    <div style={{minHeight:"100vh",background:"#faf9f6",paddingBottom:100}}>
      {/* Header */}
      <div style={{background:grad,padding:"0 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        {/* Hojas decorativas flotantes */}
        <svg style={{position:"absolute",top:18,left:14,opacity:0.22,transform:"rotate(-25deg)"}} width="28" height="28" viewBox="0 0 30 30">
          <path d="M15,1 Q27,7 21,20 Q14,29 6,22 Q0,10 15,1Z" fill="#fff"/>
          <line x1="15" y1="3" x2="11" y2="21" stroke="#a5d6a7" strokeWidth="1.5"/>
        </svg>
        <svg style={{position:"absolute",top:10,right:56,opacity:0.18,transform:"rotate(18deg)"}} width="20" height="20" viewBox="0 0 30 30">
          <path d="M15,1 Q27,7 21,20 Q14,29 6,22 Q0,10 15,1Z" fill="#fff"/>
        </svg>
        <svg style={{position:"absolute",bottom:8,left:"38%",opacity:0.15,transform:"rotate(10deg)"}} width="16" height="16" viewBox="0 0 30 30">
          <path d="M15,1 Q27,7 21,20 Q14,29 6,22 Q0,10 15,1Z" fill="#fff"/>
        </svg>
        <div style={{padding:"48px 0 16px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
          <button onClick={result ? reset : ()=>go("inicio")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
          <div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.1,margin:0}}>
              {result ? "Tu recorrido ideal" : "Planner de viaje"}
            </h1>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2}}>
              {result
                ? `${dias} dia${dias>1?"s":""} · ${perfilData?.emoji} ${perfilData?.label}`
                : "Contanos cómo es tu viaje"}
            </div>
          </div>
        </div>
      </div>


      {!result ? (
        <div style={{padding:"0 16px"}}>

          {/* Días — campo de texto libre */}
          <div style={{background:"#fff",borderRadius:20,padding:"20px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid #f0ede6"}}>
            <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>CUANTOS DIAS?</div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <input
                type="number" min="1" max="30"
                value={dias||""}
                onChange={e=>setDias(Math.max(1,parseInt(e.target.value)||1))}
                placeholder="ej: 3"
                style={{width:90,height:56,borderRadius:14,border:`2px solid ${dias?"#1E88E5":"#ede9e0"}`,background:"#faf9f6",textAlign:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:"#1E88E5",outline:"none"}}
              />
              <div style={{flex:1}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,color:"#333"}}>{dias ? `${dias} día${dias!==1?"s":""} en Colón` : "Ingresá los días"}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#aaa",marginTop:3}}>Podés poner cualquier cantidad</div>
              </div>
            </div>
          </div>

          {/* Perfil — 5 opciones */}
          <div style={{background:"#fff",borderRadius:20,padding:"20px",marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid #f0ede6"}}>
            <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>CON QUIEN VIAJAS?</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {PERFILES.map(p=>(
                <button key={p.id} onClick={()=>setPerfil(p.id)} style={{padding:"14px 8px",borderRadius:14,border:`2px solid ${perfil===p.id?"#2E7D32":"#ede9e0"}`,background:perfil===p.id?"linear-gradient(135deg,#2E7D32,#43A047)":"#faf9f6",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <span style={{fontSize:22}}>{p.emoji}</span>
                  <span style={{fontSize:11,fontWeight:700,color:perfil===p.id?"#fff":"#333",textAlign:"center",lineHeight:1.2}}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Temas */}
          <div style={{background:"#fff",borderRadius:20,padding:"20px",marginBottom:20,boxShadow:"0 4px 20px rgba(0,0,0,0.06)",border:"1px solid #f0ede6"}}>
            <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}>QUE TE INTERESA?</div>
            <div style={{fontSize:11,color:"#bbb",marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>Elegí uno o mas temas</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
              {TEMAS.map(t=>{
                const sel = temas.includes(t.id);
                return (
                  <button key={t.id} onClick={()=>toggleTema(t.id)} style={{padding:"12px 14px",borderRadius:14,border:`2px solid ${sel?"#1E88E5":"#ede9e0"}`,background:sel?"linear-gradient(135deg,#E3F2FD,#BBDEFB)":"#faf9f6",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:19}}>{t.emoji}</span>
                    <span style={{fontSize:12,fontWeight:600,color:sel?"#1565C0":"#555",textAlign:"left"}}>{t.label}</span>
                    {sel && <span style={{marginLeft:"auto",fontSize:14,color:"#1E88E5"}}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <button onClick={generar} style={{width:"100%",padding:"17px",borderRadius:18,border:"none",background:canGen?"linear-gradient(135deg,#1E88E5,#2E7D32)":"#e8e4de",color:canGen?"#fff":"#bbb",fontSize:16,fontWeight:700,cursor:canGen?"pointer":"default",fontFamily:"'DM Sans',sans-serif",boxShadow:canGen?"0 8px 24px rgba(30,136,229,0.35)":"none",transition:"all 0.2s"}}>
            {canGen ? "Generar mi recorrido ✈️" : "Completá días, con quién y temas"}
          </button>
        </div>

      ) : (
        <div style={{padding:"0 16px"}}>
          {/* Tip del perfil */}
          {PERFIL_TIPS[perfil] && (
            <div style={{background:"linear-gradient(135deg,#E3F2FD,#E8F5E9)",borderRadius:16,padding:"14px 16px",marginBottom:16,border:"1px solid #BBDEFB"}}>
              <div style={{fontSize:10,color:"#1E88E5",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>CONSEJOS PARA TU VIAJE</div>
              {PERFIL_TIPS[perfil].map((t,i)=>(
                <div key={i} style={{fontSize:12,color:"#333",fontFamily:"'DM Sans',sans-serif",marginBottom:4,display:"flex",gap:6,alignItems:"flex-start"}}>
                  <span style={{color:"#1E88E5",flexShrink:0}}>•</span>{t}
                </div>
              ))}
            </div>
          )}

          {result.map((diaObj,di)=>(
            <div key={di} style={{marginBottom:24}}>
              {/* Cabecera de día */}
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <div style={{height:1,flex:1,background:"#ede9e0"}}/>
                <span style={{fontSize:11,fontWeight:700,color:"#bbb",letterSpacing:2,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>
                  {result.length>1 ? `DIA ${diaObj.dia}` : "TU DIA"}
                  {diaObj.excursionLabel ? ` · ${diaObj.excursionLabel}` : ""}
                </span>
                <div style={{height:1,flex:1,background:"#ede9e0"}}/>
              </div>

              {diaObj.bloques.map((b,bi)=>{
                const franja = b.franja || "manana";
                const fc = FRANJA_COLOR[franja] || "#888";
                const fl = FRANJA_EMOJI[franja]+" "+FRANJA_LABEL[franja];
                return (
                  <div key={bi} className="fu" style={{display:"flex",gap:12,marginBottom:10,animationDelay:`${bi*60}ms`}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:38,flexShrink:0}}>
                      <div style={{width:38,height:38,borderRadius:12,background:`${fc}15`,border:`1.5px solid ${fc}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{b.emoji}</div>
                      {bi < diaObj.bloques.length-1 && <div style={{width:2,flex:1,minHeight:18,background:"#f0ede6",margin:"3px 0"}}/>}
                    </div>
                    <div style={{flex:1,background:"#fff",borderRadius:16,padding:"13px 15px",border:"1px solid #f0ede6",boxShadow:"0 3px 14px rgba(0,0,0,0.05)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                        <span style={{fontSize:10,fontWeight:700,color:fc,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{fl}</span>
                        <button onClick={()=>setModalBloque(b)} style={{fontSize:10,fontWeight:700,color:fc,background:`${fc}12`,border:`1px solid ${fc}30`,borderRadius:20,padding:"3px 10px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>
                          + info
                        </button>
                      </div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:"#1a1a2e",lineHeight:1.2,marginBottom:5}}>{b.titulo}</div>
                      <p style={{fontSize:13,color:"#666",lineHeight:1.6,margin:0,fontWeight:400,fontFamily:"'DM Sans',sans-serif"}}>{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Modal detalle lugar */}
          {modalBloque && (
            <div onClick={()=>setModalBloque(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
              <div onClick={e=>e.stopPropagation()} className="fu" style={{background:"#fff",borderRadius:"24px 24px 0 0",padding:"0 0 32px",width:"100%",maxWidth:430,maxHeight:"75vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
                <div style={{width:38,height:4,background:"#e0ddd6",borderRadius:2,margin:"12px auto 0"}}/>
                <div style={{background:`${modalBloque.color||"#1E88E5"}15`,borderRadius:16,margin:"16px 20px 0",padding:"16px",border:`1px solid ${modalBloque.color||"#1E88E5"}20`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:50,height:50,borderRadius:14,background:modalBloque.color||"#1E88E5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:`0 6px 18px ${modalBloque.color||"#1E88E5"}40`}}>{modalBloque.emoji}</div>
                    <div>
                      <div style={{fontSize:9,color:modalBloque.color||"#1E88E5",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif",marginBottom:3}}>{FRANJA_EMOJI[modalBloque.franja]} {FRANJA_LABEL[modalBloque.franja]}</div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700,color:"#1a1a2e",lineHeight:1.15}}>{modalBloque.titulo}</div>
                    </div>
                  </div>
                </div>
                <div style={{padding:"16px 20px 0"}}>
                  <p style={{fontSize:14,color:"#444",lineHeight:1.8,fontFamily:"'DM Sans',sans-serif",margin:"0 0 16px"}}>{modalBloque.desc}</p>
                  {LUGAR_INFO[modalBloque.titulo] && (
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {LUGAR_INFO[modalBloque.titulo].map((item,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,background:"#faf9f6",borderRadius:12,padding:"10px 12px"}}>
                          <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
                          <div>
                            <div style={{fontSize:9,fontWeight:700,color:"#bbb",textTransform:"uppercase",letterSpacing:1.2,fontFamily:"'DM Sans',sans-serif",marginBottom:2}}>{item.label}</div>
                            <div style={{fontSize:13,color:"#333",fontFamily:"'DM Sans',sans-serif"}}>{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={()=>setModalBloque(null)} style={{width:"100%",marginTop:18,padding:"14px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${modalBloque.color||"#1E88E5"},#2E7D32)`,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                    Listo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div style={{background:"#fff",borderRadius:18,padding:"18px 20px",border:"1px solid #f0ede6",marginTop:8}}>
            <button onClick={descargarPDF} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#1565C0,#1E88E5)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:10,boxShadow:"0 6px 18px rgba(21,101,192,0.3)"}}>
              Descargar itinerario
            </button>
            <button onClick={reset} style={{width:"100%",padding:"13px",borderRadius:14,border:"1.5px solid #ede9e0",background:"#faf9f6",color:"#555",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Generar nuevo recorrido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
