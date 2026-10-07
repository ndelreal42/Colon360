import { DATA } from "../data/lugares.js";


// ─── PRÓXIMO EVENTO ───────────────────────────────────────────────────────────
export const FECHAS_EVENTOS = {
  e0: new Date(2026,3,2),
  e6: new Date(2026,3,2),
  e7: new Date(2026,4,1),
  e8: new Date(2026,4,10),
  e9: new Date(2026,6,1),
  e10: new Date(2026,4,25),
  e1: new Date(2026,4,15),
};
export const FECHAS_FIN = {
  e0: new Date(2026,3,5),  // Semana Santa termina el 5 de abril
  e6: new Date(2026,3,5),
};
export const RUTAS_EVENTOS = {
  e0: "semanasanta",
};
export function getProximoEvento() {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  // Primero: evento que está pasando HOY (inicio <= hoy <= fin)
  const corriendo = DATA.eventos.find(e =>
    FECHAS_EVENTOS[e.id] && FECHAS_EVENTOS[e.id] <= hoy &&
    FECHAS_FIN[e.id] && FECHAS_FIN[e.id] >= hoy
  );
  if (corriendo) return corriendo;
  // Sino: próximo futuro
  const futuros = DATA.eventos
    .filter(e => FECHAS_EVENTOS[e.id] && FECHAS_EVENTOS[e.id] >= hoy)
    .sort((a,b) => FECHAS_EVENTOS[a.id] - FECHAS_EVENTOS[b.id]);
  return futuros[0] || DATA.eventos[0];
}

// ─── EN LA AGENDA (pool aleatorio) ────────────────────────────────────────────
export const AGENDA_POOL = [
  {emoji:"🌴", titulo:"Parque Nacional El Palmar",    sub:"Todo el año · Naturaleza y senderos"},
  {emoji:"♨️", titulo:"Termas Colón",                 sub:"Todo el año · Aguas termales 32-40°C"},
  {emoji:"🏛️", titulo:"Visitas al Molino Forclaz",    sub:"Todo el año · Tours teatralizados"},
  {emoji:"🏖️", titulo:"Playa Piedras Coloradas",      sub:"Temporada · Arena de colores únicos"},
  {emoji:"🎨", titulo:"Feria de Artesanos La Casona", sub:"Todo el año · Artesanías locales"},
  {emoji:"🍷", titulo:"Bodega Vulliez-Sermet",        sub:"Todo el año · Km 8 Ruta 135"},
  {emoji:"🛶", titulo:"Kayak en el Río Uruguay",      sub:"Todo el año · Desde el Puerto Fluvial"},
  {emoji:"🌿", titulo:"Refugio La Aurora del Palmar", sub:"Todo el año · Aves y biodiversidad"},
];
