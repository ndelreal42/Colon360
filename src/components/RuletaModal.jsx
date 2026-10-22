import { useState, useRef, useEffect, useMemo } from "react";

// ─── RULETA GASTRONÓMICA ─────────────────────────────────────────────────────
// 1) Elegís qué etiquetas entran (Parrilla, Pizza, Café...). 2) La ruleta gira ~3 segundos.
// 3) El lugar elegido se agranda y muestra su información.

const DURACION_GIRO_MS = 3000;
const MAX_SEGMENTOS = 10; // más que esto no se lee en una ruleta chica
const COLORES = ["#F9A825", "#E65100", "#FB8C00", "#FFB300", "#EF6C00", "#FFA726", "#F57C00", "#FFCA28", "#E64A19", "#FF9800"];

const norm = (t) => String(t || "").normalize("NFC");

function sortear(lista, cantidad) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, cantidad);
}

function puntoCircular(cx, cy, r, grados) {
  const rad = ((grados - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function Rueda({ items, angulo, girando }) {
  const R = 130;
  const n = items.length;
  const seg = 360 / n;
  return (
    <div style={{ position: "relative", width: 280, height: 290, margin: "0 auto" }}>
      {/* puntero fijo arriba */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 3, width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderTop: "26px solid #fff", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }} />
      <svg width="280" height="280" viewBox="-140 -140 280 280" style={{ position: "absolute", top: 12, left: 0 }}>
        <g style={{ transform: `rotate(${angulo}deg)`, transformOrigin: "0px 0px", transition: girando ? `transform ${DURACION_GIRO_MS}ms cubic-bezier(0.12, 0.65, 0.12, 1)` : "none" }}>
          {items.map((it, i) => {
            const a0 = i * seg;
            const a1 = (i + 1) * seg;
            const [x0, y0] = puntoCircular(0, 0, R, a0);
            const [x1, y1] = puntoCircular(0, 0, R, a1);
            const largo = seg > 180 ? 1 : 0;
            const [ex, ey] = puntoCircular(0, 0, R * 0.7, a0 + seg / 2);
            return (
              <g key={it.id || i}>
                <path d={n === 1 ? `M 0 -${R} A ${R} ${R} 0 1 1 -0.01 -${R} Z` : `M 0 0 L ${x0} ${y0} A ${R} ${R} 0 ${largo} 1 ${x1} ${y1} Z`} fill={COLORES[i % COLORES.length]} stroke="#fff" strokeWidth="2" />
                <text x={ex} y={ey} fontSize={n > 7 ? 22 : 26} textAnchor="middle" dominantBaseline="central" transform={`rotate(${a0 + seg / 2} ${ex} ${ey})`}>{it.emoji || "🍽️"}</text>
              </g>
            );
          })}
        </g>
        <circle r="26" fill="#fff" stroke="#F9A825" strokeWidth="3" />
        <text textAnchor="middle" dominantBaseline="central" fontSize="22">🍽️</text>
      </svg>
    </div>
  );
}

export default function RuletaModal({ lugares, etiquetaInicial, onClose, onVer }) {
  const [fase, setFase] = useState("elegir"); // elegir | girando | resultado
  const [seleccion, setSeleccion] = useState(() => (etiquetaInicial && etiquetaInicial !== "Todo" ? [norm(etiquetaInicial)] : []));
  const [items, setItems] = useState([]);
  const [angulo, setAngulo] = useState(0);
  const [animar, setAnimar] = useState(false);
  const [ganador, setGanador] = useState(null);
  const timer = useRef(null);
  const anguloRef = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Etiquetas disponibles, de la más usada a la menos usada.
  const etiquetas = useMemo(() => {
    const cuenta = {};
    lugares.forEach((l) => (l.tags || []).forEach((t) => { const k = norm(t); cuenta[k] = (cuenta[k] || 0) + 1; }));
    return Object.entries(cuenta).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [lugares]);

  const pool = useMemo(
    () => (seleccion.length === 0 ? lugares : lugares.filter((l) => (l.tags || []).some((t) => seleccion.includes(norm(t))))),
    [lugares, seleccion]
  );

  const alternar = (t) => setSeleccion((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const girar = () => {
    if (!pool.length) return;
    const elegidos = sortear(pool, MAX_SEGMENTOS);
    const w = Math.floor(Math.random() * elegidos.length);
    const seg = 360 / elegidos.length;
    // Para que el ganador quede bajo el puntero (arriba): el centro de su sector debe terminar en 0°.
    const objetivo = -((w + 0.5) * seg) + (Math.random() - 0.5) * seg * 0.6;
    const base = anguloRef.current;
    const avance = (((objetivo - base) % 360) + 360) % 360 + 360 * 4;
    const final = base + avance;

    setItems(elegidos);
    setGanador(null);
    setFase("girando");
    setAnimar(false);
    setAngulo(base);
    // Un instante después arranca la animación hacia el ángulo final.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setAnimar(true);
      setAngulo(final);
      anguloRef.current = final;
    }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setGanador(elegidos[w]); setFase("resultado"); }, DURACION_GIRO_MS + 250);
  };

  const cerrar = () => { clearTimeout(timer.current); onClose(); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 18px" }} onClick={() => { if (fase !== "girando") cerrar(); }}>
      <style>{`@keyframes ruletaZoom{0%{transform:scale(.55);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}`}</style>
      <div style={{ background: "#fff", borderRadius: 28, width: "100%", maxWidth: 380, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>

        {fase === "elegir" && (
          <>
            <div style={{ background: "linear-gradient(135deg,#F9A825,#E65100)", padding: "22px 20px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 4 }}>🎰</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>Ruleta para comer</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>Elegí qué querés que entre en la ruleta</div>
            </div>
            <div style={{ padding: "16px 18px 6px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                <button onClick={() => setSeleccion([])} style={chip(seleccion.length === 0)}>Todos</button>
                {etiquetas.map(([t, c]) => (
                  <button key={t} onClick={() => alternar(t)} style={chip(seleccion.includes(t))}>{t} <span style={{ opacity: 0.6 }}>{c}</span></button>
                ))}
              </div>
              <div style={{ textAlign: "center", fontSize: 12, color: pool.length ? "#888" : "#c62828", margin: "14px 0 12px" }}>
                {pool.length ? `${pool.length} ${pool.length === 1 ? "lugar entra" : "lugares entran"} en la ruleta` : "No hay lugares con esas etiquetas"}
              </div>
              <button onClick={girar} disabled={!pool.length} style={{ width: "100%", background: pool.length ? "linear-gradient(135deg,#F9A825,#E65100)" : "#ccc", border: "none", borderRadius: 14, padding: "14px", fontSize: 15, fontWeight: 800, color: "#fff", cursor: pool.length ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                🎰 ¡Girar!
              </button>
            </div>
            <button onClick={cerrar} style={botonCerrar}>Cerrar</button>
          </>
        )}

        {fase === "girando" && (
          <div style={{ padding: "22px 12px 16px", background: "linear-gradient(180deg,#FFF8E1,#fff)" }}>
            <div style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#E65100", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Girando...</div>
            <Rueda items={items} angulo={angulo} girando={animar} />
          </div>
        )}

        {fase === "resultado" && ganador && (
          <div style={{ animation: "ruletaZoom .55s ease-out both" }}>
            <div style={{ background: "linear-gradient(135deg,#F9A825,#E65100)", padding: "26px 20px 22px", textAlign: "center" }}>
              <div style={{ fontSize: 64, lineHeight: 1, marginBottom: 8 }}>{ganador.emoji || "🍽️"}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>¡Tu lugar para comer!</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>{ganador.nombre}</div>
              {ganador.tipo && <div style={{ marginTop: 8, display: "inline-block", background: "rgba(255,255,255,0.22)", borderRadius: 20, padding: "3px 12px", fontSize: 11, color: "#fff", fontWeight: 600 }}>{ganador.tipo}</div>}
            </div>
            <div style={{ padding: "18px 20px 8px" }}>
              {ganador.desc && <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 14 }}>{ganador.desc}</div>}
              {(ganador.tags || []).length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {ganador.tags.slice(0, 4).map((t) => <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "#FFF3E0", color: "#E65100" }}>{t}</span>)}
                </div>
              )}
              {ganador.horario && ganador.horario !== "—" && <div style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>🕐 {ganador.horario}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { cerrar(); onVer(ganador); }} style={{ flex: 1, background: "linear-gradient(135deg,#F9A825,#E65100)", border: "none", borderRadius: 14, padding: "13px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Ver más info</button>
                <button onClick={girar} aria-label="Girar de nuevo" style={{ background: "#f5f5f5", border: "none", borderRadius: 14, padding: "13px 16px", fontSize: 20, cursor: "pointer" }}>🔄</button>
              </div>
              <button onClick={() => setFase("elegir")} style={{ width: "100%", background: "none", border: "none", padding: "12px 0 4px", fontSize: 12, color: "#E65100", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Cambiar etiquetas</button>
            </div>
            <button onClick={cerrar} style={botonCerrar}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
}

const chip = (activo) => ({
  padding: "7px 13px", fontSize: 12, fontWeight: 700, borderRadius: 20, cursor: "pointer", fontFamily: "inherit",
  background: activo ? "linear-gradient(135deg,#F9A825,#E65100)" : "#FFF3E0",
  color: activo ? "#fff" : "#E65100",
  border: activo ? "1.5px solid #E65100" : "1.5px solid #FFE0B2",
});

const botonCerrar = { width: "100%", background: "none", border: "none", borderTop: "1px solid #f0f0f0", padding: "14px", fontSize: 13, color: "#aaa", cursor: "pointer", fontFamily: "inherit", marginTop: 8 };
