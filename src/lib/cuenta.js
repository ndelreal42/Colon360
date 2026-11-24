// Cuenta opcional con Google (versión 1.2).
// La app funciona igual sin cuenta. Acá vive todo lo que tiene que ver con entrar, salir y borrar la cuenta.
import { Capacitor } from "@capacitor/core";

const API_URL = "https://colon360-api.colon360.workers.dev";
// ID del cliente "Colon360 Web" de Google Cloud (no es un secreto).
const WEB_CLIENT_ID = "341901557376-eoohasgumo5le22064pm7r2t43oqavgu.apps.googleusercontent.com";
const CLAVE = "c360_sesion";

// El login con Google solo funciona dentro de la app de Android. En la versión web se avisa.
export const loginDisponible = () => Capacitor.isNativePlatform();

export function leerSesion() {
  try {
    const s = JSON.parse(localStorage.getItem(CLAVE));
    return s && s.token && s.usuario ? s : null;
  } catch { return null; }
}
function guardarSesion(s) { try { localStorage.setItem(CLAVE, JSON.stringify(s)); } catch { /* sin almacenamiento */ } }
function borrarSesionLocal() { try { localStorage.removeItem(CLAVE); } catch { /* sin almacenamiento */ } }

let plugin = null;
async function cargarPlugin() {
  if (plugin) return plugin;
  const { SocialLogin } = await import("@capgo/capacitor-social-login");
  // skipAuthOnlyAuthorizationAfterSignIn: solo necesitamos saber quién es (idToken), no acceder a datos de Google.
  await SocialLogin.initialize({ google: { webClientId: WEB_CLIENT_ID, skipAuthOnlyAuthorizationAfterSignIn: true } });
  plugin = SocialLogin;
  return plugin;
}

async function pedirAlServidor(ruta, opciones = {}) {
  const res = await fetch(`${API_URL}${ruta}`, opciones);
  let data = null;
  try { data = await res.json(); } catch { /* sin cuerpo */ }
  return { res, data };
}

// Devuelve { sesion } si entró, { cancelado:true } si la persona cerró la ventana de Google,
// o lanza un Error con un mensaje para mostrar.
export async function entrarConGoogle() {
  if (!loginDisponible()) throw new Error("Entrar con Google está disponible en la app de Android.");
  let idToken;
  try {
    const SocialLogin = await cargarPlugin();
    const login = await SocialLogin.login({ provider: "google", options: {} });
    idToken = login && login.result && login.result.idToken;
  } catch (err) {
    const texto = `${(err && err.code) || ""} ${(err && err.message) || ""}`;
    if (/cancel/i.test(texto)) return { cancelado: true };
    console.error("Login Google:", err);
    throw new Error("No se pudo abrir el acceso con Google. Revisá que tengas una cuenta de Google en el celular y probá de nuevo.");
  }
  if (!idToken) throw new Error("Google no devolvió los datos de tu cuenta. Probá de nuevo.");

  let respuesta;
  try {
    respuesta = await pedirAlServidor("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch {
    throw new Error("No hay conexión con el servidor. Revisá tu internet y probá de nuevo.");
  }
  if (!respuesta.res.ok || !respuesta.data || !respuesta.data.token) {
    throw new Error("No pudimos confirmar tu cuenta. Probá de nuevo en unos minutos.");
  }
  const sesion = { token: respuesta.data.token, usuario: respuesta.data.usuario };
  guardarSesion(sesion);
  return { sesion };
}

async function olvidarGoogle() {
  // Para que la próxima vez Google deje elegir cuenta de nuevo. Si falla no importa.
  try { const SocialLogin = await cargarPlugin(); await SocialLogin.logout({ provider: "google" }); } catch { /* nada */ }
}

export async function cerrarSesion() {
  const s = leerSesion();
  borrarSesionLocal();
  if (s) {
    try { await pedirAlServidor("/api/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${s.token}` } }); } catch { /* sin conexión: la sesión local ya se borró */ }
  }
  if (loginDisponible()) await olvidarGoogle();
}

// Borra la cuenta en el servidor. Si no hay conexión lanza un Error y NO borra nada local.
export async function borrarCuenta() {
  const s = leerSesion();
  if (!s) return;
  let respuesta;
  try {
    respuesta = await pedirAlServidor("/api/me", { method: "DELETE", headers: { Authorization: `Bearer ${s.token}` } });
  } catch {
    throw new Error("No hay conexión. Conectate a internet y probá de nuevo.");
  }
  // 401 = la sesión ya no existía en el servidor (cuenta ya borrada o vencida): se limpia igual.
  if (!respuesta.res.ok && respuesta.res.status !== 401) throw new Error("No pudimos borrar la cuenta. Probá de nuevo en unos minutos.");
  borrarSesionLocal();
  if (loginDisponible()) await olvidarGoogle();
}

// Al abrir la app: si la sesión guardada ya no vale en el servidor, se limpia. Sin conexión no se toca nada.
export async function verificarSesion() {
  const s = leerSesion();
  if (!s) return null;
  try {
    const { res, data } = await pedirAlServidor("/api/me", { headers: { Authorization: `Bearer ${s.token}` } });
    if (res.status === 401) { borrarSesionLocal(); return null; }
    if (res.ok && data && data.usuario) {
      const nueva = { token: s.token, usuario: data.usuario };
      guardarSesion(nueva);
      return nueva;
    }
  } catch { /* sin conexión: se conserva la sesión guardada */ }
  return s;
}
