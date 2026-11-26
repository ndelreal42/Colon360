import { useState, useRef } from "react";
import { elegirIdeas, ETIQUETA_COSTO, atardecerHoy, estaEnColon } from "../lib/planesAhora.js";

function abrirMaps(idea) {
  const query = idea.lugar
    ? encodeURIComponent(`${idea.lugar}, Colón, Entre Ríos, Argentina`)
    : idea.lat != null ? `${idea.lat},${idea.lng}` : null;
  if (!query) return;
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
}

const COLOR_COSTO = { gratis: ["#E8F5E9", "#2E7D32"], poco: ["#FFF8E1", "#B26A00"], medio: ["#FDECEA", "#C62828"] };
const NOMBRE_ABRE = { juegos: "Abrir juegos", gastronomia: "Ver dónde comer", planner: "Abrir Planner", mapa: "Abrir el mapa", deporte: "Ver Deporte", belleza: "Ver Belleza", atractivos: "Ver eventos", playas: "Ver playas", alojamientos: "Ver alojamientos" };

export default function AhoraModePage({ go, userPos, clima, planes = [], lugares = [], eventos = [] }) {
  const [hora] = useState(new Date());
  const mostradas = useRef([]); // ideas ya vistas en esta visita, para no repetirlas al pedir otras
  const armar = () => {
    let r = elegirIdeas({ planes, fecha: new Date(), clima, eventos, lugares, userPos, n: 5, excluir: mostradas.current });
    if (r.length < 3) { mostradas.current = []; r = elegirIdeas({ planes, fecha: new Date(), clima, eventos, lugares, userPos, n: 5 }); }
    mostradas.current = [...mostradas.current, ...r.map((x) => x.id)];
    return r;
  };
  const [ideas, setIdeas] = useState(armar);
  const [giro, setGiro] = useState(0);
  const otras = () => { setIdeas(armar()); setGiro((g) => g + 1); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const gradA = "linear-gradient(135deg,#F9A825,#FF6F00)";
  const horaTxt = hora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", paddingBottom: 100 }}>
      <div style={{ background: gradA, padding: "0 16px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ padding: "48px 0 18px", position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => go("inicio")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 38, height: 38, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>‹</button>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>¿Qué hago ahora?</h1>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>Planes simples según la hora, el clima y dónde estés</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
          {[
            { icon: "🕐", label: "Hora", val: horaTxt },
            { icon: clima?.icon || "🌤️", label: "Clima", val: clima?.temp ? `${clima.temp} · ${clima.desc || ""}` : "—" },
            { icon: "🌅", label: "Atardecer", val: `${atardecerHoy(hora)} hs` },
          ].map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "10px 8px", textAlign: "center", border: "1px solid #f0ede6" }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{c.icon}</div>
              <div style={{ fontSize: 9, color: "#bbb", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#333", lineHeight: 1.25 }}>{c.val}</div>
            </div>
          ))}
        </div>

        <div key={giro} style={{ animation: "fadeUp .35s ease" }}>
          {ideas.map((it) => {
            const [bg, fg] = COLOR_COSTO[it.costo] || [];
            const distTxt = it.dist != null ? (it.dist < 1 ? `${Math.round(it.dist * 1000)} m` : `${it.dist.toFixed(1)} km`) : null;
            const puedeRuta = !!(it.lugar || it.lat != null);
            return (
              <div key={it.id} style={{ background: "#fff", borderRadius: 18, padding: "16px", marginBottom: 10, border: "1px solid #f0ede6", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#FFF8E1,#FFF3E0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{it.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.25, marginBottom: 4 }}>{it.texto}</div>
                    <div style={{ fontSize: 12, color: "#777", lineHeight: 1.55, fontFamily: "'DM Sans',sans-serif" }}>{it.detalle}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {it.costo && ETIQUETA_COSTO[it.costo] && <span style={{ background: bg, color: fg, borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 800 }}>{ETIQUETA_COSTO[it.costo]}</span>}
                      {distTxt && <span style={{ background: "#F1F4F8", color: "#556", borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 700 }}>📍 {distTxt}</span>}
                    </div>
                  </div>
                </div>
                {(puedeRuta || it.abre) && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f5f5f5", display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    {it.abre && (
                      <button onClick={() => go(it.abre)} style={{ border: "none", background: "#1a1a2e", color: "#fff", borderRadius: 20, padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{NOMBRE_ABRE[it.abre] || "Abrir"} ›</button>
                    )}
                    {puedeRuta && (
                      <button onClick={() => abrirMaps(it)} style={{ border: "none", background: "#E53935", color: "#fff", borderRadius: 20, padding: "7px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>📍 Cómo llegar</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={otras} style={{ width: "100%", marginTop: 6, padding: "14px", borderRadius: 14, border: "none", background: gradA, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 18px rgba(249,168,37,0.35)" }}>
          🔄 Mostrame otras ideas
        </button>
        {!estaEnColon(userPos) && (
          <div style={{ marginTop: 10, fontSize: 11, color: "#aaa", textAlign: "center" }}>Activá tu ubicación en Colón y te mostramos qué tan lejos queda cada plan.</div>
        )}

        <div onClick={() => go("juegos")} style={{ marginTop: 14, background: "linear-gradient(135deg,#6A1B9A,#AB47BC)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <span style={{ fontSize: 24 }}>🎲</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>¿Te quedás un rato más?</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>Juegos para hacer en Colón →</div>
          </div>
        </div>
      </div>
    </div>
  );
}
