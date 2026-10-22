import { useState } from "react";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MESES_MIN = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS = ["LU","MA","MI","JU","VI","SA","DO"];

const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const txt = (s) => { const [y, m, d] = s.split("-").map(Number); return `${d} de ${MESES_MIN[m - 1]}`; };

// Calendario para elegir un rango (llegada → salida). Fechas como "YYYY-MM-DD".
export default function CalendarioRango({ desde, hasta, onChange, minISO, color = "#2E7D32" }) {
  const base = desde ? desde.split("-").map(Number) : (minISO || iso(new Date().getFullYear(), new Date().getMonth(), 1)).split("-").map(Number);
  const [vista, setVista] = useState({ y: base[0], m: base[1] - 1 });

  const primerDia = (new Date(vista.y, vista.m, 1).getDay() + 6) % 7; // lunes = 0
  const diasMes = new Date(vista.y, vista.m + 1, 0).getDate();
  const diasPrev = new Date(vista.y, vista.m, 0).getDate();
  const celdas = [];
  for (let i = primerDia - 1; i >= 0; i--) celdas.push({ d: diasPrev - i, fuera: true });
  for (let d = 1; d <= diasMes; d++) celdas.push({ d, iso: iso(vista.y, vista.m, d) });
  while (celdas.length % 7) celdas.push({ d: celdas.length - primerDia - diasMes + 1, fuera: true });

  const mover = (n) => setVista(v => { const t = new Date(v.y, v.m + n, 1); return { y: t.getFullYear(), m: t.getMonth() }; });

  const elegir = (f) => {
    if (minISO && f < minISO) return;
    if (!desde || (desde && hasta)) onChange(f, "");
    else if (f <= desde) onChange(f, "");
    else onChange(desde, f);
  };

  const noches = desde && hasta ? Math.round((new Date(hasta) - new Date(desde)) / 86400000) : 0;
  const claro = color + "22";

  const flecha = { width: 32, height: 32, borderRadius: "50%", border: "none", background: "#fff", cursor: "pointer", fontSize: 16, color: "#333", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" };

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e8e8e8", overflow: "hidden", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ padding: "12px 12px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f3f4f6", borderRadius: 12, padding: "6px 8px", marginBottom: 10 }}>
          <button type="button" aria-label="Mes anterior" onClick={() => mover(-1)} style={flecha}>‹</button>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>{MESES[vista.m]} {vista.y}</div>
          <button type="button" aria-label="Mes siguiente" onClick={() => mover(1)} style={flecha}>›</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
          {DIAS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#999", fontWeight: 600, padding: "6px 0" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", rowGap: 2 }}>
          {celdas.map((c, i) => {
            if (c.fuera) return <div key={i} style={{ textAlign: "center", padding: "10px 0", fontSize: 14, color: "#d4d4d4" }}>{c.d}</div>;
            const esDesde = c.iso === desde, esHasta = c.iso === hasta;
            const enRango = desde && hasta && c.iso > desde && c.iso < hasta;
            const bloqueado = minISO && c.iso < minISO;
            const extremo = esDesde || esHasta;
            const fondo = (desde && hasta && (esDesde || esHasta || enRango)) ? claro : "transparent";
            const radio = esDesde && hasta ? "999px 0 0 999px" : esHasta ? "0 999px 999px 0" : 0;
            return (
              <div key={i} style={{ background: fondo, borderRadius: radio }}>
                <button type="button" disabled={bloqueado} onClick={() => elegir(c.iso)}
                  style={{ width: "100%", height: 38, border: "none", cursor: bloqueado ? "not-allowed" : "pointer", fontSize: 14, fontFamily: "inherit",
                    borderRadius: extremo ? 999 : 0, background: extremo ? color : "transparent",
                    color: extremo ? "#fff" : bloqueado ? "#ccc" : enRango ? color : "#333", fontWeight: extremo || enRango ? 700 : 500 }}>
                  {c.d}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ borderTop: "1px solid #eee", padding: "12px 14px", fontSize: 12.5, color: "#777" }}>
        {desde && hasta ? <>Del <b style={{ color: "#222" }}>{txt(desde)}</b> al <b style={{ color: "#222" }}>{txt(hasta)}</b> · {noches} {noches === 1 ? "noche" : "noches"}</>
          : desde ? <>Llegada: <b style={{ color: "#222" }}>{txt(desde)}</b> · ahora elegí la salida</>
          : "Tocá el día de llegada"}
      </div>
    </div>
  );
}
