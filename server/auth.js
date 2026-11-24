// Cuentas de usuario con Google (versión 1.2 de la app).
//
// Cómo funciona:
//  1. La app le pide a Google que identifique a la persona y recibe un "ID token" firmado por Google.
//  2. La app manda ese token a POST /api/auth/google.
//  3. Acá se verifica la firma con las claves públicas de Google, que el token sea de Colón 360 (aud)
//     y que no esté vencido. Si todo está bien, se crea/actualiza el usuario y se devuelve un token
//     de sesión propio (al azar; en la base se guarda solo su huella SHA-256).
//  4. La app guarda ese token y lo manda en la cabecera Authorization: Bearer <token>.
//
// Se guarda lo mínimo: email, nombre y foto que Google ya muestra. Nunca la contraseña de Google.

// ID del cliente "Colon360 Web" de Google Cloud (no es un secreto). Se puede pisar con la variable WEB_CLIENT_ID.
const WEB_CLIENT_ID_POR_DEFECTO = '341901557376-eoohasgumo5le22064pm7r2t43oqavgu.apps.googleusercontent.com';

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];
const SESION_DIAS = 180;

let jwksCache = { keys: null, hasta: 0 };

const b64urlABytes = (s) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};
const b64urlAJson = (s) => JSON.parse(new TextDecoder().decode(b64urlABytes(s)));

async function clavesDeGoogle(forzar = false) {
  const ahora = Date.now();
  if (!forzar && jwksCache.keys && ahora < jwksCache.hasta) return jwksCache.keys;
  const res = await fetch(GOOGLE_JWKS_URL);
  if (!res.ok) throw new Error('No se pudieron leer las claves de Google');
  const { keys } = await res.json();
  jwksCache = { keys, hasta: ahora + 60 * 60 * 1000 };
  return keys;
}

// Devuelve los datos del token si es válido; si no, lanza un Error con mensaje claro.
export async function verificarIdTokenGoogle(idToken, clientId, ahoraSeg = Math.floor(Date.now() / 1000)) {
  if (typeof idToken !== 'string' || idToken.split('.').length !== 3) throw new Error('Token con formato inválido');
  const [h, p, s] = idToken.split('.');
  const header = b64urlAJson(h);
  if (header.alg !== 'RS256') throw new Error('Algoritmo no permitido');

  let keys = await clavesDeGoogle();
  let jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) { // Google pudo rotar las claves: se vuelve a leer una vez
    keys = await clavesDeGoogle(true);
    jwk = keys.find((k) => k.kid === header.kid);
  }
  if (!jwk) throw new Error('Clave de firma desconocida');

  const key = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'],
  );
  const firmaOk = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5', key, b64urlABytes(s), new TextEncoder().encode(`${h}.${p}`),
  );
  if (!firmaOk) throw new Error('Firma inválida');

  const datos = b64urlAJson(p);
  if (!ISSUERS.includes(datos.iss)) throw new Error('Emisor inválido');
  if (datos.aud !== clientId) throw new Error('El token no es de esta app');
  if (!datos.exp || datos.exp < ahoraSeg - 30) throw new Error('Token vencido');
  if (!datos.sub) throw new Error('Token sin identificador');
  if (datos.email && datos.email_verified === false) throw new Error('Email sin verificar');
  return datos;
}

async function sha256Hex(texto) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function tokenAlAzar() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const ahoraISO = () => new Date().toISOString();
const usuarioPublico = (u) => ({ id: u.id, nombre: u.nombre || '', email: u.email || '', foto: u.foto || '' });

async function usuarioDeSesion(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const m = auth.match(/^Bearer\s+([a-f0-9]{64})$/i);
  if (!m) return null;
  const huella = await sha256Hex(m[1].toLowerCase());
  const fila = await env.DB.prepare(
    `SELECT u.id, u.nombre, u.email, u.foto, s.vence
       FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.huella = ?`,
  ).bind(huella).first();
  if (!fila) return null;
  if (fila.vence && fila.vence < ahoraISO()) {
    await env.DB.prepare('DELETE FROM sesiones WHERE huella = ?').bind(huella).run();
    return null;
  }
  return { ...fila, huella };
}

// Devuelve una Response si la ruta es de cuentas; null si no (para que siga el resto del Worker).
export async function manejarCuentas(request, env, pathname, json) {
  const metodo = request.method;

  // POST /api/auth/google  { idToken }
  if (pathname === '/api/auth/google' && metodo === 'POST') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Pedido inválido' }, 400); }
    const clientId = env.WEB_CLIENT_ID || WEB_CLIENT_ID_POR_DEFECTO;
    let datos;
    try {
      datos = await verificarIdTokenGoogle(body && body.idToken, clientId);
    } catch (err) {
      return json({ error: 'No se pudo verificar tu cuenta de Google', motivo: err.message }, 401);
    }

    const ahora = ahoraISO();
    let usuario = await env.DB.prepare('SELECT * FROM usuarios WHERE google_sub = ?').bind(datos.sub).first();
    if (usuario) {
      await env.DB.prepare(
        'UPDATE usuarios SET email = ?, nombre = ?, foto = ?, ultimo_ingreso = ? WHERE id = ?',
      ).bind(datos.email || usuario.email, datos.name || usuario.nombre, datos.picture || usuario.foto, ahora, usuario.id).run();
      usuario = { ...usuario, email: datos.email || usuario.email, nombre: datos.name || usuario.nombre, foto: datos.picture || usuario.foto };
    } else {
      const id = 'u_' + tokenAlAzar().slice(0, 20);
      await env.DB.prepare(
        'INSERT INTO usuarios (id, google_sub, email, nombre, foto, creado, ultimo_ingreso) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ).bind(id, datos.sub, datos.email || '', datos.name || '', datos.picture || '', ahora, ahora).run();
      usuario = { id, email: datos.email || '', nombre: datos.name || '', foto: datos.picture || '' };
    }

    const token = tokenAlAzar();
    const vence = new Date(Date.now() + SESION_DIAS * 86400000).toISOString();
    await env.DB.prepare('INSERT INTO sesiones (huella, usuario_id, creada, vence) VALUES (?, ?, ?, ?)')
      .bind(await sha256Hex(token), usuario.id, ahora, vence).run();
    return json({ token, usuario: usuarioPublico(usuario) });
  }

  // POST /api/auth/logout  -> cierra solo esta sesión
  if (pathname === '/api/auth/logout' && metodo === 'POST') {
    const u = await usuarioDeSesion(request, env);
    if (u) await env.DB.prepare('DELETE FROM sesiones WHERE huella = ?').bind(u.huella).run();
    return json({ ok: true });
  }

  // GET /api/me  -> quién soy (la app lo usa para saber si la sesión sigue valiendo)
  if (pathname === '/api/me' && metodo === 'GET') {
    const u = await usuarioDeSesion(request, env);
    if (!u) return json({ error: 'Sesión inválida' }, 401);
    return json({ usuario: usuarioPublico(u) });
  }

  // DELETE /api/me  -> borra la cuenta y todo lo asociado
  if (pathname === '/api/me' && metodo === 'DELETE') {
    const u = await usuarioDeSesion(request, env);
    if (!u) return json({ error: 'Sesión inválida' }, 401);
    await env.DB.prepare('DELETE FROM sesiones WHERE usuario_id = ?').bind(u.id).run();
    await env.DB.prepare('DELETE FROM usuarios WHERE id = ?').bind(u.id).run();
    return json({ ok: true });
  }

  return null;
}
