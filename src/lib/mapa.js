import { LUGAR_COORDS } from "../data/geo.js";
import { MAP_MARKERS } from "../data/lugares.js";

export const MAPA_CATS = ["Todos", "Playa", "Hotel", "Rest.", "Café", "Atracción", "Deporte"];
const ORDEN_CAT = ["Playa", "Hotel", "Rest.", "Café", "Atracción", "Deporte", "Salud"];

const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

// Índice de coordenadas por nombre (sin tildes ni mayúsculas)
const COORDS_INDEX = {};
Object.entries(LUGAR_COORDS).forEach(([nombre, c]) => { COORDS_INDEX[norm(nombre)] = c; });

export function catDeLugar(l) {
  const tipo = norm(l.tipo);
  if (tipo === "playa") return "Playa";
  if (tipo === "hotel") return "Hotel";
  if (tipo === "restaurante") return "Rest.";
  if (tipo === "cafe") return "Café";
  if (tipo.startsWith("atr")) return norm(l.categoria) === "deporte" ? "Deporte" : "Atracción";
  return null;
}

// Arma la lista del mapa a partir de los lugares reales (los mismos que muestran las otras pantallas).
// Cada lugar guarda su "item" original para poder abrir la ficha con el botón Ver.
// Si todavía no llegaron los datos del servidor, se usan los marcadores locales (sin botón Ver).
export function armarLugaresMapa(lugares) {
  let lista;
  if (Array.isArray(lugares) && lugares.length) {
    lista = lugares
      .map((l) => {
        const cat = catDeLugar(l);
        if (!cat) return null;
        const c = COORDS_INDEX[norm(l.nombre)];
        return { id: l.id, label: l.nombre, cat, lat: c?.lat ?? null, lng: c?.lng ?? null, address: l.dir || "", item: l };
      })
      .filter(Boolean);
  } else {
    lista = MAP_MARKERS.map((m) => ({ id: "m" + m.id, label: m.label, cat: m.cat, lat: m.lat, lng: m.lng, address: "", item: null }));
  }
  return lista.sort((a, b) => {
    const ca = ORDEN_CAT.indexOf(a.cat), cb = ORDEN_CAT.indexOf(b.cat);
    return ca - cb || a.label.localeCompare(b.label, "es");
  });
}
