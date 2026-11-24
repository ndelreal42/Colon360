import { useState } from "react";
import { entrarConGoogle, cerrarSesion, borrarCuenta, loginDisponible } from "../lib/cuenta.js";

const URL_PRIVACIDAD = "https://ndelreal42.github.io/Colon360/privacidad.html";
const URL_BORRAR = "https://ndelreal42.github.io/Colon360/borrar-cuenta.html";

const G_LOGO = (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// Ajustes (sin cuenta) y Mi cuenta (con cuenta). Es opcional: la app funciona igual sin entrar.
export default function CuentaPage({ go, sesion, setSesion }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [confirmaBorrar, setConfirmaBorrar] = useState(false);
  const logueado = !!sesion;
  const u = sesion && sesion.usuario;
  const nombre = (u && (u.nombre || u.email)) || "";
  const inicial = (nombre.trim()[0] || "?").toUpperCase();

  const abrir = (url) => window.open(url, "_blank");

  const entrar = async () => {
    setError(""); setCargando(true);
    try {
      const r = await entrarConGoogle();
      if (r.sesion) setSesion(r.sesion);
    } catch (e) { setError(e.message || "No se pudo entrar. Probá de nuevo."); }
    setCargando(false);
  };
  const salir = async () => {
    setError(""); setCargando(true);
    await cerrarSesion();
    setSesion(null); setCargando(false);
  };
  const borrar = async () => {
    setError(""); setCargando(true);
    try { await borrarCuenta(); setSesion(null); setConfirmaBorrar(false); }
    catch (e) { setError(e.message || "No se pudo borrar la cuenta."); }
    setCargando(false);
  };

  const tarjeta = { background: "#fff", borderRadius: 20, padding: "22px 20px", boxShadow: "0 4px 18px rgba(0,0,0,0.06)", marginBottom: 12, textAlign: "center" };
  const btnPrimario = { width: "100%", background: "#fff", border: "1.5px solid #c9ced6", borderRadius: 30, padding: "13px 16px", fontSize: 15, fontWeight: 800, color: "#1a1a2e", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 };

  return (
    <div style={{ minHeight: "100svh", background: "#f2f4f8", paddingBottom: "calc(env(safe-area-inset-bottom) + 90px)" }}>
      {/* Encabezado */}
      <div style={{ background: "linear-gradient(160deg,#A0623F 0%,#E39A3A 100%)", padding: "calc(env(safe-area-inset-top) + 18px) 20px 34px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => go("inicio")} aria-label="Volver" style={{ background: "rgba(255,255,255,0.25)", border: "none", color: "#fff", width: 38, height: 38, borderRadius: "50%", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>‹</button>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>{logueado ? "Mi cuenta" : "Ajustes"}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>{logueado ? "Ajustes" : "Tu cuenta de Colón 360"}</div>
        </div>
      </div>

      <div style={{ padding: "0 16px", marginTop: -18 }}>
        {!logueado && (
          <div style={tarjeta}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#123842", marginBottom: 6 }}>Ingresá con tu cuenta</div>
            <div style={{ fontSize: 13.5, color: "#5b6670", lineHeight: 1.4, marginBottom: 16 }}>
              Es opcional. La app funciona igual sin cuenta.
            </div>
            {loginDisponible() ? (
              <button onClick={entrar} disabled={cargando} style={{ ...btnPrimario, opacity: cargando ? 0.6 : 1 }}>
                {G_LOGO}<span>{cargando ? "Conectando…" : "Continuar con Google"}</span>
              </button>
            ) : (
              <div style={{ background: "#fff7e6", border: "1px solid #f3d9a4", borderRadius: 14, padding: "12px 14px", fontSize: 13, color: "#7a5a12", lineHeight: 1.4 }}>
                Entrar con Google está disponible en la app de Colón 360 para Android.
              </div>
            )}
            <button onClick={() => go("inicio")} style={{ background: "none", border: "none", color: "#1E88E5", fontSize: 14.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", marginTop: 14, padding: 6 }}>
              Seguir sin cuenta
            </button>
          </div>
        )}

        {logueado && (
          <div style={tarjeta}>
            <div style={{ position: "relative", width: 92, height: 92, margin: "0 auto 12px" }}>
              {u.foto
                ? <img src={u.foto} alt="" referrerPolicy="no-referrer" style={{ width: 92, height: 92, borderRadius: "50%", objectFit: "cover" }} />
                : <div style={{ width: 92, height: 92, borderRadius: "50%", background: "#12A89E", color: "#fff", fontSize: 44, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{inicial}</div>}
              <div style={{ position: "absolute", right: 0, bottom: 2, width: 26, height: 26, borderRadius: "50%", background: "#2E9E5B", border: "3px solid #fff", color: "#fff", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, color: "#123842" }}>{u.nombre || "Tu cuenta"}</div>
            {u.email && <div style={{ fontSize: 14, color: "#5b6670", marginTop: 3, wordBreak: "break-all" }}>{u.email}</div>}
            <div style={{ display: "inline-block", background: "#e3f5ea", color: "#1f7a46", fontWeight: 800, fontSize: 13, borderRadius: 20, padding: "6px 16px", margin: "12px 0 18px" }}>Estás en tu cuenta</div>
            <button onClick={salir} disabled={cargando} style={{ width: "100%", background: "#fff", border: "2px solid #1E88E5", color: "#1E88E5", borderRadius: 30, padding: "12px 16px", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", opacity: cargando ? 0.6 : 1 }}>
              Cerrar sesión
            </button>

            {!confirmaBorrar ? (
              <button onClick={() => { setError(""); setConfirmaBorrar(true); }} disabled={cargando} style={{ background: "none", border: "none", color: "#C62828", fontSize: 14.5, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", marginTop: 14, padding: 6 }}>
                Borrar mi cuenta
              </button>
            ) : (
              <div style={{ marginTop: 16, background: "#fdecea", borderRadius: 14, padding: "14px 14px 12px", textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#8e1f1f", marginBottom: 4 }}>¿Borrar tu cuenta?</div>
                <div style={{ fontSize: 13, color: "#6d3030", lineHeight: 1.4, marginBottom: 12 }}>
                  Se borran tu nombre, tu email y tu sesión de nuestros servidores. No se puede deshacer. La app sigue funcionando sin cuenta.
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setConfirmaBorrar(false)} disabled={cargando} style={{ flex: 1, background: "#fff", border: "1.5px solid #d6d9de", borderRadius: 12, padding: "10px", fontSize: 14, fontWeight: 700, color: "#333", cursor: "pointer", fontFamily: "inherit" }}>Cancelar</button>
                  <button onClick={borrar} disabled={cargando} style={{ flex: 1, background: "#C62828", border: "none", borderRadius: 12, padding: "10px", fontSize: 14, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: "inherit", opacity: cargando ? 0.6 : 1 }}>{cargando ? "Borrando…" : "Sí, borrar"}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div role="alert" style={{ background: "#fdecea", border: "1px solid #f5c2c0", color: "#8e1f1f", borderRadius: 14, padding: "11px 14px", fontSize: 13, lineHeight: 1.4, marginBottom: 12 }}>{error}</div>
        )}

        <button onClick={() => abrir(URL_PRIVACIDAD)} style={{ width: "100%", background: "#fff", border: "none", borderRadius: 16, padding: "16px 18px", fontSize: 15, fontWeight: 800, color: "#123842", cursor: "pointer", fontFamily: "inherit", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", marginBottom: 12 }}>
          <span>Política de privacidad</span><span style={{ color: "#9aa3ad", fontSize: 18 }}>›</span>
        </button>

        {!logueado && (
          <div style={{ fontSize: 12, color: "#6b7580", lineHeight: 1.45, padding: "0 4px" }}>
            Al continuar aceptás la Política de privacidad. No guardamos tu contraseña de Google.
          </div>
        )}
        {logueado && (
          <button onClick={() => abrir(URL_BORRAR)} style={{ background: "none", border: "none", color: "#6b7580", fontSize: 12, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit", padding: "4px" }}>
            Cómo pedir el borrado de tus datos
          </button>
        )}
      </div>
    </div>
  );
}
