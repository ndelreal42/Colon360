// Altura del río Uruguay en el puerto de Colón, leída de Prefectura Naval Argentina.
// Se consulta desde el servidor (el navegador no puede por CORS) y se guarda en el
// caché de Cloudflare 15 minutos, así Prefectura recibe muy pocos pedidos sin
// importar cuánta gente abra la app.

const PNA_URL = 'https://contenidosweb.prefecturanaval.gob.ar/alturas/?page=historico&tiempo=7&id=710';
const USER_AGENT = 'Colon360/1.0 (app turistica de Colon, Entre Rios; +https://ndelreal42.github.io/Colon360/)';

// Niveles oficiales de Colón. Se usan sólo si la página no los trae.
const ALERTA_POR_DEFECTO = 7.1;
const EVACUACION_POR_DEFECTO = 7.9;

// Si la última lectura tiene más de estas horas, la app la trata como "sin datos".
const HORAS_MAX_ANTIGUEDAD = 48;

const MESES = { ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5, JUL: 6, AGO: 7, SEP: 8, SET: 8, OCT: 9, NOV: 10, DIC: 11 };

const num = (s) => parseFloat(String(s).replace(',', '.'));
const dos = (n) => String(n).padStart(2, '0');

// Pasa el HTML a texto plano para buscar con expresiones regulares sin depender del diseño de la página.
function aTexto(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&Uacute;/g, 'Ú').replace(/&uacute;/g, 'ú')
    .replace(/&Oacute;/g, 'Ó').replace(/&oacute;/g, 'ó')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

// Argentina no usa horario de verano: siempre UTC-3.
function aIso(anio, mes, dia, hora, min) {
  const a = anio < 100 ? 2000 + anio : anio;
  return `${a}-${dos(mes + 1)}-${dos(dia)}T${dos(hora)}:${dos(min)}:00-03:00`;
}

// "Último registro: 6.68 Mts el 21/OCT/26 - 1200"
function leerRegistroDelPanel(texto, etiqueta) {
  const re = new RegExp(
    etiqueta + '\\s*:?\\s*(-?\\d+(?:[.,]\\d+)?)\\s*Mts?\\.?\\s*el\\s*(\\d{1,2})\\s*/\\s*([A-Za-z]{3})[A-Za-z]*\\s*/\\s*(\\d{2,4})\\s*-?\\s*(\\d{1,2}):?(\\d{2})',
    'i'
  );
  const m = texto.match(re);
  if (!m) return null;
  const mes = MESES[m[3].toUpperCase()];
  if (mes === undefined) return null;
  return { altura: num(m[1]), fecha: aIso(Number(m[4]), mes, Number(m[2]), Number(m[5]), Number(m[6])) };
}

// Respaldo: la tabla "Últimos registros" ("2026-10-21 00:00  6.71 Mts"). Viene de más nuevo a más viejo.
function leerTabla(texto) {
  const re = /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})\s+(-?\d+(?:[.,]\d+)?)\s*Mts/g;
  const filas = [];
  let m;
  while ((m = re.exec(texto)) !== null) {
    filas.push({ altura: num(m[6]), fecha: `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00-03:00` });
  }
  return filas.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}

function leerNivel(texto, etiqueta, porDefecto) {
  const m = texto.match(new RegExp(etiqueta + '\\s*:\\s*(\\d+(?:[.,]\\d+)?)\\s*Mts', 'i'));
  return m ? num(m[1]) : porDefecto;
}

export function parsearRio(html) {
  const texto = aTexto(html);
  const tabla = leerTabla(texto);

  // 1) El cuadro "Datos del Puerto" es lo más actual; 2) si no está, la tabla.
  let ultimo = leerRegistroDelPanel(texto, 'ltimo\\s+registro');
  let anterior = leerRegistroDelPanel(texto, 'Registro\\s+anterior');
  if (!ultimo && tabla.length) ultimo = tabla[0];
  if (!ultimo || Number.isNaN(ultimo.altura)) return null;
  if (!anterior) anterior = tabla.find((f) => f.fecha < ultimo.fecha) || null;

  const alerta = leerNivel(texto, 'Alerta', ALERTA_POR_DEFECTO);
  const evacuacion = leerNivel(texto, 'Evacuaci\\S{1,6}n', EVACUACION_POR_DEFECTO);

  let tendencia = null;
  if (anterior && !Number.isNaN(anterior.altura)) {
    const dif = ultimo.altura - anterior.altura;
    tendencia = dif > 0.01 ? 'sube' : dif < -0.01 ? 'baja' : 'estable';
  }

  const estado = ultimo.altura >= evacuacion ? 'Evacuación' : ultimo.altura >= alerta ? 'Alerta' : 'Normal';

  return {
    altura: ultimo.altura,
    fecha: ultimo.fecha,
    anterior: anterior ? anterior.altura : null,
    tendencia,
    estado,
    alerta,
    evacuacion,
  };
}

async function pedirPagina() {
  const res = await fetch(PNA_URL, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/html' },
    cf: { cacheEverything: true, cacheTtl: 900, cacheTtlByStatus: { '200-299': 900, '400-599': 0 } },
  });
  return { status: res.status, html: res.ok ? await res.text() : '' };
}

// GET /api/rio          -> altura actual
// GET /api/rio?debug=1  -> (sólo con clave de admin) qué recibió el Worker de Prefectura, para diagnosticar
export async function handleRio(searchParams, headers, esAdmin) {
  const conCache = { ...headers, 'Cache-Control': 'public, max-age=300' };
  try {
    const { status, html } = await pedirPagina();

    if (searchParams.get('debug') === '1' && esAdmin) {
      const texto = aTexto(html);
      const i = texto.search(/ltimo\s+registro/i);
      return new Response(JSON.stringify({
        statusPrefectura: status,
        largoHtml: html.length,
        encontroPanel: i >= 0,
        fragmento: i >= 0 ? texto.slice(Math.max(0, i - 80), i + 400) : texto.slice(0, 600),
        resultado: html ? parsearRio(html) : null,
      }), { headers });
    }

    if (status !== 200) {
      return new Response(JSON.stringify({ error: `Prefectura respondió ${status}` }), { status: 502, headers });
    }
    const data = parsearRio(html);
    if (!data) {
      return new Response(JSON.stringify({ error: 'No se pudo leer la altura de la página de Prefectura' }), { status: 502, headers });
    }
    const horas = (Date.now() - new Date(data.fecha).getTime()) / 3600000;
    return new Response(JSON.stringify({ ...data, desactualizado: horas > HORAS_MAX_ANTIGUEDAD }), { headers: conCache });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'No se pudo consultar Prefectura', message: err.message }), { status: 502, headers });
  }
}
