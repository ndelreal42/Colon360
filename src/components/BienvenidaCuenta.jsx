import { useState } from "react";
import LOGO_APP from "../assets/logo-app.png";
import { entrarConGoogle } from "../lib/cuenta.js";

const CLAVE_OCULTO = "c360_bienvenida";
const DIAS_OCULTO = 7; // si toca "Entrar sin cuenta", vuelve a aparecer a la semana
const URL_PRIVACIDAD = "https://ndelreal42.github.io/Colon360/privacidad.html";

export function bienvenidaDescartada() {
  try {
    const t = Number(localStorage.getItem(CLAVE_OCULTO));
    return !!t && Date.now() - t < DIAS_OCULTO * 86400000;
  } catch { return false; }
}

const G_LOGO = (
  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const BENEFICIOS = [
  { e: "🗺️", t: "Mapa de playas, comercios y lugares" },
  { e: "🌊", t: "Estado del río y pronóstico al día" },
  { e: "🎉", t: "Eventos y novedades de Colón" },
];

// Pantalla de bienvenida: se muestra al abrir la app si todavía no hay cuenta.
// Entrar con Google es lo principal, pero siempre se puede "Entrar sin cuenta" (nadie queda bloqueado).
export default function BienvenidaCuenta({ onEntro, onSinCuenta }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const sinCuenta = () => {
    try { localStorage.setItem(CLAVE_OCULTO, String(Date.now())); } catch { /* sin almacenamiento */ }
    onSinCuenta();
  };
  const entrar = async () => {
    setError(""); setCargando(true);
    try {
      const r = await entrarConGoogle();
      if (r.sesion) onEntro(r.sesion);
    } catch (e) { setError(e.message || "No se pudo entrar. Probá de nuevo."); }
    setCargando(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 20000, background: "linear-gradient(170deg,#218AC9 0%,#5EBDEB 55%,#FFC43D 130%)", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", padding: "calc(env(safe-area-inset-top) + 36px) 24px calc(env(safe-area-inset-bottom) + 24px)" }}>
      <div style={{ width: "100%", maxWidth: 430, flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={LOGO_APP} alt="Colón 360" style={{ width: 92, height: 92, borderRadius: 24, boxShadow: "0 8px 28px rgba(0,0,0,0.25)", marginTop: 10 }} />
        <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", marginTop: 16, letterSpacing: -0.5, textShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
          Colón<span style={{ color: "#FFC43D" }}>360</span>
        </div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,0.92)", marginTop: 4, textAlign: "center" }}>Tu guía de Colón, Entre Ríos</div>

        <div style={{ background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "16px 18px", marginTop: 28, width: "100%", backdropFilter: "blur(6px)" }}>
          {BENEFICIOS.map((b) => (
            <div key={b.t} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", color: "#fff", fontSize: 14.5, fontWeight: 600 }}>
              <span style={{ fontSize: 22, width: 28, textAlign: "center" }}>{b.e}</span><span>{b.t}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minHeight: 20 }} />

        <div style={{ width: "100%", background: "#fff", borderRadius: 24, padding: "20px 18px 14px", boxShadow: "0 12px 40px rgba(0,0,0,0.25)", textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#123842" }}>Ingresá con tu correo de Google</div>
          <div style={{ fontSize: 13, color: "#5b6670", lineHeight: 1.4, marginTop: 4, marginBottom: 14 }}>Un toque y listo, sin escribir nada ni crear contraseñas. Con tu cuenta vas a tener ventajas que vamos sumando.</div>
          <button onClick={entrar} disabled={cargando} style={{ width: "100%", background: "#fff", border: "1.5px solid #c9ced6", borderRadius: 30, padding: "14px 16px", fontSize: 16, fontWeight: 800, color: "#1a1a2e", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", opacity: cargando ? 0.6 : 1 }}>
            {G_LOGO}<span>{cargando ? "Conectando…" : "Continuar con Google"}</span>
          </button>
          {error && <div role="alert" style={{ marginTop: 10, fontSize: 12.5, color: "#8e1f1f", lineHeight: 1.35 }}>{error}</div>}
          <button onClick={sinCuenta} disabled={cargando} style={{ background: "none", border: "none", color: "#6b7580", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 10, padding: 6, textDecoration: "underline" }}>
            Entrar sin cuenta
          </button>
          <div style={{ fontSize: 11.5, color: "#8a949e", lineHeight: 1.35, marginTop: 2 }}>La app funciona igual, pero sin las ventajas de tener cuenta.</div>
        </div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.9)", textAlign: "center", marginTop: 12, lineHeight: 1.4 }}>
          Al continuar aceptás la <span onClick={() => window.open(URL_PRIVACIDAD, "_blank")} style={{ textDecoration: "underline", cursor: "pointer" }}>Política de privacidad</span>. No guardamos tu contraseña de Google.
        </div>
      </div>
    </div>
  );
}
