import { useState, useEffect, useRef } from "react";

// Consejos para usuarios nuevos: aparecen de a uno, cada tanto, en la pantalla a la que corresponden.
// Burbuja semitransparente que se cierra con la ✕ o tocándola 2 veces.
const CLAVE = "c360_consejos";
const ENTRE_CONSEJOS_MS = 3 * 60 * 60 * 1000; // mínimo 3 horas entre un consejo y el siguiente
const DURACION_MS = 15000;                    // se esconde sola a los 15 segundos
let yaMostradoEnEstaSesion = false;

// target: elemento marcado con data-tut (si no hay, la burbuja va arriba del menú de abajo)
export const CONSEJOS = [
  { id: "bienvenida", tab: "inicio", icon: "👋", titulo: "¡Bienvenido a Colón 360!", texto: "Tu guía de Colón en el bolsillo. Cada tanto te vamos a mostrar un truco. Cuando quieras uno, tocá el ? de arriba." },
  { id: "ahora", tab: "inicio", target: "ahora", icon: "⚡", titulo: "¿Qué hago ahora?", texto: "Te propone planes gratis o baratos según la hora, el clima y dónde estés. Cada vez salen ideas distintas." },
  { id: "rio", tab: "inicio", target: "rio", icon: "🌊", titulo: "El río y el clima", texto: "Mirá cómo está el río Uruguay y el clima de hoy antes de salir." },
  { id: "playas", tab: "playas", icon: "🏖️", titulo: "Paradores y campings", texto: "Entrá a una playa y mirá sus paradores, carritos y campings. Podés filtrar por lo que buscás." },
  { id: "ruleta", tab: "gastronomia", icon: "🎰", titulo: "¿No sabés qué comer?", texto: "Probá la ruleta: elegí qué te gusta y que decida la suerte. En cada lugar podés ver la carta." },
  { id: "alojamiento", tab: "alojamientos", icon: "🛏️", titulo: "Consultá disponibilidad", texto: "Abrí un alojamiento, elegí las fechas y se arma el mensaje de WhatsApp listo para enviar." },
  { id: "mapa", tab: "mapa", icon: "📍", titulo: "El mapa de Colón", texto: "Tocá un lugar para ver su ficha y cómo llegar. También podés ver el mapa real." },
  { id: "agenda", tab: "atractivos", icon: "🎟️", titulo: "Eventos y agenda", texto: "En la solapa Eventos están las fiestas, ferias y actividades que se vienen en Colón." },
  { id: "planner", tab: "planner", icon: "🗓️", titulo: "Armá tu itinerario", texto: "Elegí qué querés hacer y te ayudamos a organizar tu día." },
];

function leer() {
  try { return JSON.parse(localStorage.getItem(CLAVE) || "null") || { vistos: [], ultimo: 0 }; } catch { return { vistos: [], ultimo: 0 }; }
}
function guardar(v) { try { localStorage.setItem(CLAVE, JSON.stringify(v)); } catch {} }

export default function Consejos({ tab, forzar = 0 }) {
  const [activo, setActivo] = useState(null);
  const [rect, setRect] = useState(null);
  const ultimoToque = useRef(0);
  const primeraVez = useRef(true);

  const cerrar = () => setActivo(null);

  const mostrar = (c) => {
    const est = leer();
    if (!est.vistos.includes(c.id)) guardar({ vistos: [...est.vistos, c.id], ultimo: Date.now() });
    yaMostradoEnEstaSesion = true;
    setActivo(c);
  };

  // Aparece solo al entrar a la pantalla (con las reglas de "cada tanto")
  useEffect(() => {
    setActivo(null);
    const est = leer();
    const candidato = CONSEJOS.find(c => c.tab === tab && !est.vistos.includes(c.id));
    if (!candidato) return;
    const esPrimero = est.vistos.length === 0;
    const toca = esPrimero || (!yaMostradoEnEstaSesion && Date.now() - est.ultimo >= ENTRE_CONSEJOS_MS);
    if (!toca) return;
    const t = setTimeout(() => mostrar(candidato), 1400);
    return () => clearTimeout(t);
  }, [tab]);

  // Botón "?": muestra un consejo ahora (el próximo que falte; si ya vio todos, repite)
  useEffect(() => {
    if (primeraVez.current) { primeraVez.current = false; return; }
    const est = leer();
    const delTab = CONSEJOS.filter(c => c.tab === tab);
    if (!delTab.length) return;
    const faltan = delTab.filter(c => !est.vistos.includes(c.id));
    mostrar(faltan.length ? faltan[0] : delTab[forzar % delTab.length]);
  }, [forzar]);

  // Ubicación de la flecha
  useEffect(() => {
    if (!activo) return;
    const medir = () => {
      const el = activo.target && document.querySelector(`[data-tut="${activo.target}"]`);
      const r = el && el.getBoundingClientRect();
      setRect(r && r.width ? { top: r.top, bottom: r.bottom, left: r.left, width: r.width } : null);
    };
    medir();
    const t = setTimeout(medir, 400);
    const auto = setTimeout(cerrar, DURACION_MS);
    window.addEventListener("resize", medir);
    return () => { clearTimeout(t); clearTimeout(auto); window.removeEventListener("resize", medir); };
  }, [activo]);

  if (!activo) return null;

  const W = typeof window !== "undefined" ? window.innerWidth : 390;
  const ANCHO = Math.min(272, W - 24);
  const alto = 112;
  let left = (W - ANCHO) / 2, top, flecha = null;
  if (rect) {
    const cx = rect.left + rect.width / 2;
    top = rect.top - alto - 10;
    let lado = "arriba";
    if (top < 60) { top = rect.bottom + 10; lado = "abajo"; }
    flecha = { lado, x: Math.min(Math.max(cx - left, 22), ANCHO - 22) };
  } else if (activo.tab === "inicio") {
    top = 84;
  } else {
    top = (typeof window !== "undefined" ? window.innerHeight : 780) - alto - 100;
  }

  const borde = "1.5px solid rgba(94,189,235,0.9)";
  const fondo = "rgba(232,246,254,0.9)";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, pointerEvents: "none" }}>
      <div
        onClick={() => { const t = Date.now(); if (t - ultimoToque.current < 350) cerrar(); ultimoToque.current = t; }}
        style={{ position: "absolute", left, top, width: ANCHO, boxSizing: "border-box", pointerEvents: "auto", background: fondo,
          backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", color: "#123842", borderRadius: 18, padding: "12px 34px 12px 14px",
          boxShadow: "0 8px 26px rgba(33,138,201,0.28)", border: borde, fontFamily: "'DM Sans',sans-serif", userSelect: "none", cursor: "pointer",
          animation: "consejoIn .35s ease both" }}>
        <button aria-label="Cerrar" onClick={(e) => { e.stopPropagation(); cerrar(); }}
          style={{ position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: "50%", border: "none", background: "rgba(94,189,235,0.28)", color: "#218AC9", fontSize: 13, lineHeight: 1, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>✕</button>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: "#D98A00", marginBottom: 3 }}>Consejo</div>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 3 }}>{activo.icon} {activo.titulo}</div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: "#2c5360" }}>{activo.texto}</div>
        {flecha && (
          <div style={{ position: "absolute", left: flecha.x - 7, [flecha.lado === "arriba" ? "bottom" : "top"]: -7, width: 14, height: 14, background: fondo, transform: "rotate(45deg)",
            borderRight: flecha.lado === "arriba" ? borde : "none", borderBottom: flecha.lado === "arriba" ? borde : "none",
            borderLeft: flecha.lado === "abajo" ? borde : "none", borderTop: flecha.lado === "abajo" ? borde : "none" }} />
        )}
      </div>
      <style>{`@keyframes consejoIn{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
