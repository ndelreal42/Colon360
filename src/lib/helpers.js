
// ─── HORARIO UTILS ───────────────────────────────────────────────────────────
export function parseHora(str) {
  // "08:30" or "8" or "08" → minutes since midnight
  const s = str.trim().replace("hs","").trim();
  if(s.includes(":")) {
    const [h,m] = s.split(":").map(Number);
    return h*60 + (m||0);
  }
  return Number(s)*60;
}

export function isAbierto(horario) {
  if(!horario) return null;
  const h = horario.toLowerCase();
  if(h.includes("24hs") || h.includes("24 hs") || h.includes("todo el día") || h.includes("abierta todo")) return {abierto:true, label:"Abierto 24hs"};
  if(h.includes("cerrado") && !h.includes("–") && !h.includes("y") && !h.includes(":")) return {abierto:false, label:"Cerrado"};
  if(h.includes("consultar") || h.includes("reserva") || h.includes("temporada") || h.includes("check-in") || h.includes("mañana") || h.includes("tardes") || h.includes("—")) return null;

  const now = new Date();
  const dow = now.getDay(); // 0=Dom,1=Lun,...,6=Sáb
  const mins = now.getHours()*60 + now.getMinutes();

  // Detectar si hoy está cerrado por día explícito
  const DIAS = {lun:1,mar:2,mié:3,mie:3,jue:4,vie:5,sáb:6,sab:6,dom:0};
  const NOMBRES_DIA = ["dom","lun","mar","mié","jue","vie","sáb"];
  const diaHoy = NOMBRES_DIA[dow];

  // "Cerrado martes" / "Cerrado miércoles"
  const cerrHoy = h.match(/cerrado\s+(lun|mar|mi[eé]|jue|vie|s[aá]b|dom)/g);
  if(cerrHoy) {
    for(const c of cerrHoy) {
      const d = c.replace("cerrado","").trim().slice(0,3);
      if(DIAS[d]===dow) return {abierto:false, label:"Cerrado hoy"};
    }
  }

  // Extraer franjas horarias del texto: pares HH:MM – HH:MM o HH–HH
  function extraerFranjas(texto) {
    const franjas = [];
    // Formato "HH:MM – HH:MM" o "HH:MM–HH:MM" o "HHhs–HHhs"
    const re = /(\d{1,2}(?::\d{2})?)\s*(?:–|-|a)\s*(\d{1,2}(?::\d{2})?)\s*(?:hs)?/g;
    let m;
    while((m=re.exec(texto))!==null) {
      const ini = parseHora(m[1]);
      let fin = parseHora(m[2]);
      if(fin < ini) fin += 24*60; // cruza medianoche
      franjas.push({ini,fin});
    }
    return franjas;
  }

  function estaEnFranjas(franjas) {
    for(const f of franjas) {
      const minsAdj = f.fin>24*60 && mins<f.ini ? mins+24*60 : mins;
      if(minsAdj>=f.ini && minsAdj<f.fin) return true;
    }
    return false;
  }

  // Caso simple: "HH:MM – HH:MM y HH:MM – HH:MM · Todos los días / sin día específico"
  // Si no tiene referencia a días de la semana, aplicar directo
  const tieneDias = /lun|mar|mi[eé]|jue|vie|s[aá]b|dom|l-v/.test(h);
  if(!tieneDias) {
    const franjas = extraerFranjas(horario);
    if(!franjas.length) return null;
    const ab = estaEnFranjas(franjas);
    return {abierto:ab, label: ab ? "Abierto ahora" : "Cerrado ahora"};
  }

  // Con días: "Lun–Sáb 9–13hs y 16–20hs · Dom cerrado"
  // Dividir por segmentos "· " o ";" y analizar cuál aplica hoy
  const segmentos = horario.split(/[·;]/).map(s=>s.trim()).filter(Boolean);
  for(const seg of segmentos) {
    const sl = seg.toLowerCase();
    // detectar rango de días "lun–vie" / "lun a vie" / "L-V"
    const rangoRe = /(lun|mar|mi[eé]|jue|vie|s[aá]b|dom|l|v|s)\s*(?:–|-|a)\s*(lun|mar|mi[eé]|jue|vie|s[aá]b|dom|v|s)/;
    const diasPuntRe = /^((?:lun|mar|mi[eé]|jue|vie|s[aá]b|dom)(?:\s*,\s*(?:lun|mar|mi[eé]|jue|vie|s[aá]b|dom))*)/;
    const LV = {l:1,lun:1,mar:2,"mié":3,"mie":3,jue:4,vie:5,v:5,"sáb":6,"sab":6,s:6,dom:0};

    let aplica = false;
    const rm = sl.match(rangoRe);
    if(rm) {
      const d1 = LV[rm[1]]??-1;
      let d2 = LV[rm[2]]??-1;
      if(d1>=0 && d2>=0) {
        if(d2<d1) { // wrap: Vie–Lun
          aplica = dow>=d1 || dow<=d2;
        } else {
          aplica = dow>=d1 && dow<=d2;
        }
      }
    } else {
      // días sueltos: "Lun, Mié–Dom"
      const dp = sl.match(diasPuntRe);
      if(dp) {
        const partes = dp[1].split(/,/).map(p=>p.trim());
        for(const p of partes) {
          const key = p.slice(0,3);
          if(LV[key]===dow) { aplica=true; break; }
        }
      } else if(sl.includes("todos") || sl.includes("diario")) {
        aplica = true;
      }
    }

    if(sl.includes("cerrado")) {
      if(aplica) return {abierto:false, label:"Cerrado hoy"};
      continue;
    }

    if(aplica) {
      const franjas = extraerFranjas(seg);
      if(!franjas.length) return null;
      const ab = estaEnFranjas(franjas);
      return {abierto:ab, label: ab ? "Abierto ahora" : "Cerrado ahora"};
    }
  }

  // Viernes, Sábados y Domingos …
  if(h.includes("viernes") && h.includes("sábados") && h.includes("domingos")) {
    if(dow===5||dow===6||dow===0) {
      const franjas = extraerFranjas(horario);
      const ab = franjas.length ? estaEnFranjas(franjas) : false;
      return {abierto:ab, label: ab ? "Abierto ahora" : "Cerrado ahora"};
    }
    return {abierto:false, label:"Cerrado hoy"};
  }

  return null;
}

// ─── GEO UTILITIES ───────────────────────────────────────────────────────────
export function calcKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
export function abrirMaps(lat, lng, nombre) {
  const query = nombre
    ? encodeURIComponent(`${nombre}, Colón, Entre Ríos, Argentina`)
    : `${lat},${lng}`;
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
}
export const WA_MSG = encodeURIComponent("Hola! Te escribo desde la app Colón 360\nTe queria consultar:");
export function abrirContacto(tel) {
  if (!tel || tel.includes('Consultar') || tel === '—') return;
  const clean = tel.replace(/[^\d+]/g, '');
  // Fijos: tienen paréntesis con 0 adentro, ej: (03447)
  const esLandline = /\(0\d/.test(tel);
  if (esLandline) {
    window.open('tel:' + clean, '_self');
  } else {
    let wa = clean.startsWith('+') ? clean.slice(1) : clean;
    if (wa.startsWith('549')) {}           // ya tiene 549XXXXXXXXX
    else if (wa.startsWith('54')) wa = '5' + wa; // 54→549...
    else wa = '549' + wa;                  // número local → agregar 549
    window.open('https://wa.me/' + wa + '?text=' + WA_MSG, '_blank');
  }
}
