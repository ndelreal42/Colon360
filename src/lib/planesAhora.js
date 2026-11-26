// Planes de "¿Qué hago ahora?": la lista base vive acá y también se carga en la base de datos (server/migracion-planes.sql),
// así Nahuel puede sumar, editar o borrar planes desde el panel. Si la API no responde, la app usa esta lista.
//
// Campos:
//  tipo     paseo | mate | comida | cultura | playa | deporte | compras | relax | familia | app
//  costo    gratis | poco | medio | "" (no se muestra)
//  momento  manana,mediodia,tarde,atardecer,noche (vacío = a cualquier hora)
//  clima    "" (cualquiera) | lindo | calor | frio | lluvia
//  dias     "" (todos) | finde | semana
//  lugar    nombre para buscar en Google Maps ("" = sin botón de ruta)
//  abre     sección de la app que abre el botón (juegos, gastronomia, planner, mapa, deporte, belleza, atractivos, playas…)

const COSTA = { lat: -32.2255, lng: -58.1405 };
const PUERTO = { lat: -32.2298, lng: -58.1408 };
const QUIROS = { lat: -32.2190, lng: -58.1452 };
const TERMAS = { lat: -32.2157, lng: -58.1238 };
const MOLINO = { lat: -32.2350, lng: -58.1420 };

const p = (emoji, tipo, titulo, detalle, costo, momento, clima, dias, lugar, c, abre) => ({
  emoji, tipo, titulo, detalle, costo, momento, clima, dias, lugar,
  lat: c ? c.lat : null, lng: c ? c.lng : null, abre: abre || "",
});

export const PLANES_BASE = [
  // ── Mates y relax ──
  p("🧉", "mate", "Tomar unos mates en el Cartel de Colón", "Llevá el termo, sentate frente al río y sacate la foto con las letras.", "gratis", "manana,mediodia,tarde,atardecer", "lindo", "", "Cartel de Colón"),
  p("🧉", "mate", "Mates en el puerto mirando el río", "Un banco, el termo y el ir y venir del puerto. Plan clásico de Colón.", "gratis", "manana,mediodia,tarde,atardecer", "lindo", "", "Puerto de Colón", PUERTO),
  p("🧉", "mate", "Mates en la plaza San Martín", "Sentate en un banco de la plaza principal y mirá pasar el centro.", "gratis", "manana,mediodia,tarde", "lindo", "", "Plaza San Martín"),
  p("🌳", "mate", "Mates a la sombra en el Parque Quirós", "Césped, árboles y el río cerquita. Llevá algo para picar.", "gratis", "tarde", "lindo", "", "Parque Quirós", QUIROS),
  p("🧉", "mate", "Mates en la costanera al atardecer", "El mejor momento para el termo: cielo naranja y el río quieto.", "gratis", "atardecer", "lindo", "", "Costanera de Colón", COSTA),
  p("📖", "relax", "Leer un rato frente al río", "Llevate un libro y buscá un banco de la costanera con buena vista.", "gratis", "manana,mediodia,tarde", "lindo", "", "Costanera de Colón", COSTA),
  p("🌌", "relax", "Mirar las estrellas desde la costanera", "Sin luces fuertes y con el río de fondo, una noche despejada se luce.", "gratis", "noche", "lindo", "", "Costanera de Colón", COSTA),

  // ── Caminatas y paseos ──
  p("🚶", "paseo", "Salir a caminar por la costanera", "Ida y vuelta mirando el río. Lindo para despejarse sin gastar nada.", "gratis", "manana,mediodia,tarde,atardecer", "lindo", "", "Costanera de Colón", COSTA),
  p("🚶", "paseo", "Caminata costera hasta el Parque Quirós", "Seguí la costa hasta el parque y volvé por la playa.", "gratis", "manana,mediodia,tarde", "lindo", "", "Parque Quirós", QUIROS),
  p("🏃", "deporte", "Trotar o caminar temprano junto al río", "Poca gente, aire fresco y la mejor luz del día.", "gratis", "manana", "lindo", "", "Costanera de Colón", COSTA),
  p("🌅", "paseo", "Ver el atardecer en la costanera", "El sol cae sobre el río Uruguay: llegá unos minutos antes.", "gratis", "atardecer", "lindo", "", "Costanera de Colón", COSTA),
  p("📸", "paseo", "Atardecer desde el mirador del puerto", "Buena altura para las fotos y para ver pasar las lanchas.", "gratis", "atardecer", "lindo", "", "Mirador del puerto", PUERTO),
  p("🌄", "paseo", "Fotos del amanecer en la costanera", "Si madrugás, el río se pone dorado y no hay nadie.", "gratis", "manana", "lindo", "", "Costanera de Colón", COSTA),
  p("🌙", "paseo", "Paseo de noche por la costanera", "Salí a tomar fresco: el río de noche tiene otra calma.", "gratis", "noche", "lindo", "", "Costanera de Colón", COSTA),
  p("🛍️", "compras", "Caminar el centro y mirar vidrieras", "Recorré las calles céntricas y entrá a lo que te llame la atención.", "gratis", "mediodia,tarde", "", "", "Centro de Colón"),
  p("⛵", "paseo", "Ver los barcos y los pescadores del puerto", "Siempre hay movimiento. Muy lindo para ir con chicos.", "gratis", "manana,mediodia,tarde", "lindo", "", "Puerto de Colón", PUERTO),
  p("🎣", "paseo", "Probar suerte pescando desde la costa", "Si tenés caña, el río es el lugar. Consultá las reglas de pesca.", "poco", "manana,atardecer", "lindo", "", "Costanera de Colón", COSTA),

  // ── Cultura y lugares para conocer ──
  p("🪵", "cultura", "Recorrer las esculturas de caricaturas en madera", "Un paseo distinto: figuras talladas para ir descubriendo.", "gratis", "manana,mediodia,tarde", "lindo", "", "Esculturas de caricaturas en madera, Colón"),
  p("🏛️", "cultura", "Conocer el Molino Forclaz", "Patrimonio histórico de Colón. Fijate los horarios de visita.", "", "manana,mediodia,tarde", "", "", "Molino Forclaz", MOLINO),
  p("🏠", "cultura", "Visitar la Casa de la Primera Administración", "Un pedacito de la historia de la ciudad.", "", "manana,mediodia,tarde", "", "", "Casa de la Primera Administración, Colón"),
  p("🔥", "cultura", "Ver la Llama de la Esperanza", "Un punto simbólico de la ciudad, ideal para sumar a tu caminata.", "gratis", "manana,mediodia,tarde,atardecer", "lindo", "", "Llama de la Esperanza, Colón"),
  p("⛪", "cultura", "Entrar a la parroquia Santos Justo y Pastor", "Tranquila y bonita, a pasos de la plaza principal.", "gratis", "manana,mediodia,tarde", "", "", "Parroquia Santos Justo y Pastor, Colón"),
  p("🍇", "cultura", "Visitar una bodega de la zona", "Conocé cómo se hace el vino entrerriano. Consultá horarios antes de ir.", "medio", "mediodia,tarde", "", "", "Bodega Vulliez-Sermet, Colón"),

  // ── Feria, compras y regionales ──
  p("🛍️", "compras", "Ir a la feria de la costanera", "Artesanías, comida y música frente al río (en temporada y fines de semana).", "poco", "tarde,atardecer,noche", "lindo", "finde", "Feria de la costanera, Colón", COSTA),
  p("🎁", "compras", "Llevarte un recuerdo artesanal", "Dulces regionales, tejidos y cosas hechas en Colón.", "poco", "mediodia,tarde,atardecer", "", "", "Costanera de Colón", COSTA),

  // ── Comer y tomar ──
  p("☕", "comida", "Tomar un café en el centro", "Un cortado tranquilo y a mirar la gente pasar.", "poco", "manana,mediodia,tarde", "", "", "Café en el centro de Colón"),
  p("🥐", "comida", "Desayuno con medialunas", "Arrancá el día en una confitería del centro.", "poco", "manana", "", "", "Confitería en el centro de Colón"),
  p("🍰", "comida", "Merienda: café con algo dulce", "Hora ideal para una torta o unos churros.", "poco", "tarde", "", "", "Café en el centro de Colón"),
  p("🥖", "comida", "Pasar por la panadería y llevar facturas para el mate", "Facturas calentitas y a la costanera a compartir.", "poco", "manana,mediodia,tarde", "", "", "Panadería en Colón"),
  p("🍦", "comida", "Un helado artesanal y a caminar", "Helado en mano y paseo por la costanera.", "poco", "tarde,noche", "calor", "", "Heladería en Colón"),
  p("🥤", "comida", "Algo fresco: limonada o licuado", "Para bajar la temperatura sin complicarte.", "poco", "tarde", "calor", "", "Café en el centro de Colón"),
  p("🍺", "comida", "Una cerveza artesanal con amigos", "Una cervecería o un bar con buena onda para charlar.", "poco", "atardecer,noche", "", "", "Cervecería en Colón"),
  p("🐟", "comida", "Almorzar pescado de río", "Surubí, boga o lo que haya del día: un clásico de la costa.", "medio", "mediodia", "", "", "Restaurante de pescado en Colón"),
  p("🥩", "comida", "Parrillada para compartir", "Plan de todos los tiempos: carne, ensalada y sobremesa.", "medio", "mediodia,noche", "", "", "Parrilla en Colón"),
  p("🍕", "comida", "Pizza o picada con amigos", "Algo para compartir y charlar sin apuro.", "poco", "noche", "", "", "Pizzería en Colón"),
  p("🍽️", "comida", "Cenar con vista al río", "Reservá mesa si es fin de semana.", "medio", "noche", "", "finde", "Restaurante con vista al río, Colón"),
  p("🥡", "comida", "Comida para llevar y comer en la costanera", "Rotisería, banco frente al río y listo.", "poco", "mediodia,noche", "lindo", "", "Rotisería en Colón"),
  p("🍫", "comida", "Chocolate caliente con algo dulce", "Para los días fríos: manos calentitas y charla.", "poco", "tarde,noche", "frio", "", "Café en el centro de Colón"),
  p("🍲", "comida", "Un guiso o una sopa bien calentita", "Perfecto para un día de frío.", "poco", "mediodia,noche", "frio", "", "Restaurante en Colón"),
  p("🎰", "app", "Dejá que la ruleta decida qué comer", "Elegí qué te gusta y que la suerte elija el lugar.", "gratis", "mediodia,noche", "", "", "", null, "gastronomia"),

  // ── Playa y río ──
  p("🏖️", "playa", "Día de playa en la costa del río", "Sombrilla, reposera y el río Uruguay enfrente.", "gratis", "mediodia,tarde", "calor", "", "Playa junto al Parque Quirós", QUIROS),
  p("🌊", "playa", "Refrescarte en la playa", "Si hace calor, el río es el mejor aire acondicionado. Cuidá las zonas habilitadas.", "gratis", "mediodia,tarde", "calor", "", "Playa junto al Parque Quirós", QUIROS),
  p("⛱️", "playa", "Un parador de playa con algo fresco", "Pedí una bebida y quedate a mirar el río.", "poco", "mediodia,tarde", "calor", "", "", null, "playas"),
  p("🏐", "playa", "Jugar a la paleta o al voley en la playa", "Armá un partido con quien tengas cerca.", "gratis", "tarde", "calor", "", "Playa junto al Parque Quirós", QUIROS),
  p("🌇", "playa", "Atardecer con los pies en la arena", "La playa después de las 18 es otra cosa: menos gente y luz suave.", "gratis", "atardecer", "lindo", "", "Playa junto al Parque Quirós", QUIROS),

  // ── Termas y bienestar ──
  p("♨️", "relax", "Un rato de termas", "Agua caliente para entrar en calor o cerrar un día largo.", "medio", "manana,mediodia,tarde,noche", "frio", "", "Termas de Colón", TERMAS),
  p("♨️", "relax", "Termas en un día de lluvia", "Cuando llueve, el agua termal es el mejor plan.", "medio", "manana,mediodia,tarde,atardecer,noche", "lluvia", "", "Termas de Colón", TERMAS),
  p("🌿", "relax", "Conocer las Termas San José", "Otra opción termal cerca de Colón.", "medio", "manana,mediodia,tarde", "", "", "Termas San José"),
  p("💅", "app", "Date un gustito: peluquería, uñas o barbería", "Mirá los locales de belleza y sacá turno por WhatsApp.", "poco", "manana,mediodia,tarde", "", "semana", "", null, "belleza"),

  // ── Deporte ──
  p("🚴", "deporte", "Andar en bici por la costanera", "Si no tenés, preguntá por alquiler de bicicletas.", "poco", "manana,mediodia,tarde", "lindo", "", "Costanera de Colón", COSTA),
  p("🏋️", "deporte", "Entrenar al aire libre en el parque", "Estiramientos, trote o ejercicios en el Parque Quirós.", "gratis", "manana,mediodia,tarde", "lindo", "", "Parque Quirós", QUIROS),
  p("⚽", "deporte", "Armar un fútbol 5 con amigos", "Mirá las canchas de la zona y reservá turno desde la app.", "poco", "tarde,noche", "", "", "", null, "deporte"),
  p("🎾", "deporte", "Jugar un partido de pádel", "Cuatro jugadores, una cancha y un turno por WhatsApp.", "poco", "tarde,noche", "", "", "", null, "deporte"),
  p("🏟️", "deporte", "Mirar un partido de los clubes de Colón", "Fijate qué se juega y llevá el equipo de mate.", "poco", "tarde", "", "finde", "", null, "deporte"),
  p("🛶", "deporte", "Preguntar por paseos en lancha o kayak", "En el puerto suelen ofrecer salidas por el río.", "medio", "manana,mediodia,tarde", "lindo", "", "Puerto de Colón", PUERTO),

  // ── Con chicos ──
  p("🛝", "familia", "Tarde de plaza con los chicos", "Hamacas, tobogán y los mates para los grandes.", "gratis", "tarde", "lindo", "", "Plaza San Martín"),
  p("🦆", "familia", "Dar de comer a los patos y pasear por el parque", "Plan tranquilo y gratis para toda la familia.", "gratis", "manana,mediodia,tarde", "lindo", "", "Parque Quirós", QUIROS),
  p("🎲", "app", "Jugar a los juegos de Colón en la app", "Trivias y desafíos para hacer en familia o con amigos.", "gratis", "", "lluvia", "", "", null, "juegos"),

  // ── Plan B (lluvia o día feo) ──
  p("☕", "comida", "Tarde de café y charla", "Con lluvia, un café calentito y buena compañía.", "poco", "manana,mediodia,tarde,atardecer", "lluvia", "", "Café en el centro de Colón"),
  p("🗓️", "app", "Armá tu itinerario en el Planner", "Aprovechá el día gris para organizar lo que viene.", "gratis", "", "lluvia", "", "", null, "planner"),
  p("🛍️", "compras", "Recorrer galerías y comercios del centro", "Con lluvia, el centro es un buen refugio.", "gratis", "mediodia,tarde", "lluvia", "", "Centro de Colón"),

  // ── Más ideas ──
  p("🥪", "mate", "Almuerzo al aire libre: sándwiches y mate en el parque", "Llevá todo armado y comé a la sombra, con el río cerca.", "poco", "mediodia", "lindo", "", "Parque Quirós", QUIROS),
  p("☕", "comida", "Un café mirando el atardecer en el puerto", "Pedí algo caliente y quedate hasta que caiga el sol.", "poco", "atardecer", "lindo", "", "Puerto de Colón", PUERTO),
  p("🥐", "comida", "Desayunar frente al río", "Llevá medialunas y termo: la costanera a la mañana es una gloria.", "poco", "manana", "lindo", "", "Costanera de Colón", COSTA),
  p("📸", "paseo", "Sacarte fotos en los rincones más lindos de Colón", "Cartel de Colón, puerto y costanera: tres fotos y listo el recuerdo.", "gratis", "tarde,atardecer", "lindo", "", "Cartel de Colón"),
  p("😴", "relax", "Siesta a la sombra en el Parque Quirós", "Hamaca paraguaya o manta sobre el pasto, sin apuro.", "gratis", "mediodia,tarde", "calor", "", "Parque Quirós", QUIROS),
  p("🧣", "mate", "Mates calentitos con campera en la costanera", "Abrigate bien y tomá unos mates mirando el río.", "gratis", "manana,tarde", "frio", "", "Costanera de Colón", COSTA),
  p("🍦", "comida", "Helado después de cenar", "Un clásico de las noches de verano en Colón.", "poco", "noche", "calor", "", "Heladería en Colón"),
  p("🍝", "comida", "Cena tranquila en un restaurante del centro", "Con lluvia, una buena mesa y sobremesa larga.", "medio", "atardecer,noche", "lluvia", "", "Restaurante en el centro de Colón"),
  p("🍕", "comida", "Pizza y cerveza bajo techo", "Plan seguro para una noche de lluvia.", "poco", "atardecer,noche", "lluvia", "", "Pizzería en Colón"),
  p("🎶", "app", "Buscá música en vivo: mirá la agenda", "Fijate qué hay esta noche en bares y escenarios.", "gratis", "noche", "", "finde", "", null, "atractivos"),
  p("🗓️", "app", "Planificá la semana con la agenda de eventos", "Fiestas, ferias y torneos que se vienen.", "gratis", "atardecer,noche", "lluvia", "", "", null, "atractivos"),

  // ── Descubrir con la app ──
  p("🗺️", "app", "Descubrí un rincón nuevo en el mapa", "Abrí el mapa ilustrado y tocá un lugar que no conozcas.", "gratis", "", "", "", "", null, "mapa"),
  p("🎟️", "app", "Mirá los eventos y la agenda", "Fiestas, ferias y actividades que se vienen en Colón.", "gratis", "", "", "", "", null, "atractivos"),
  p("🛏️", "app", "Ver alojamientos para tu próxima escapada", "Cabañas, casas y hoteles con consulta directa por WhatsApp.", "gratis", "noche", "", "", "", null, "alojamientos"),
];

// ── Motor ───────────────────────────────────────────────────────────────────

// Hora aproximada del atardecer en Colón según el mes (0 = enero)
const ATARDECER = [20.2, 19.9, 19.3, 18.5, 18.0, 17.8, 17.9, 18.2, 18.7, 19.2, 19.8, 20.2];
const CENTRO = { lat: -32.223, lng: -58.14 };
const CLAVE_VISTOS = "c360_ahora_vistos";

export const ETIQUETA_COSTO = { gratis: "Gratis", poco: "Poco gasto", medio: "$$" };

export function momentoDe(fecha = new Date()) {
  const h = fecha.getHours() + fecha.getMinutes() / 60;
  const at = ATARDECER[fecha.getMonth()];
  if (h >= 6 && h < 11) return "manana";
  if (h >= 11 && h < 15) return "mediodia";
  if (h >= 15 && h < at - 1.5) return "tarde";
  if (h >= at - 1.5 && h < at + 0.4) return "atardecer";
  return "noche";
}

export function atardecerHoy(fecha = new Date()) {
  const at = ATARDECER[fecha.getMonth()];
  const h = Math.floor(at), m = Math.round((at - h) * 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}

// A partir del texto del clima de la app: { llueve, calor, frio, lindo, conocido }
export function leerClima(clima = {}) {
  const desc = String(clima.desc || "").toLowerCase();
  const temp = parseInt(String(clima.temp || "").replace(/[^\d-]/g, ""), 10);
  const conocido = !Number.isNaN(temp) && !desc.includes("cargando");
  if (!conocido) return { conocido: false };
  const llueve = /lluvi|chubasc|tormenta|llovizn/.test(desc);
  return { conocido: true, temp, llueve, calor: !llueve && temp >= 29, frio: temp <= 13, lindo: !llueve && temp > 13 && temp < 33 };
}

export function estaEnColon(pos) {
  return !!pos && km(pos.lat, pos.lng, CENTRO.lat, CENTRO.lng) < 20;
}

export function km(lat1, lng1, lat2, lng2) {
  const r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r, dLng = (lng2 - lng1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function leerVistos() { try { return JSON.parse(localStorage.getItem(CLAVE_VISTOS) || "[]"); } catch { return []; } }
function guardarVistos(ids) { try { localStorage.setItem(CLAVE_VISTOS, JSON.stringify(ids.slice(-24))); } catch {} }

const csv = (v) => String(v || "").split(",").map((x) => x.trim()).filter(Boolean);
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Convierte filas de la API (o de la lista base) en ideas listas para mostrar.
function aIdea(pl, i) {
  return {
    id: pl.id != null ? "p" + pl.id : "b" + i,
    icon: pl.emoji || "✨", tipo: pl.tipo || "paseo", texto: pl.titulo, detalle: pl.detalle || "",
    costo: pl.costo || "", momento: csv(pl.momento), clima: pl.clima || "", dias: pl.dias || "",
    lugar: pl.lugar || "", lat: pl.lat != null && pl.lat !== "" ? Number(pl.lat) : null, lng: pl.lng != null && pl.lng !== "" ? Number(pl.lng) : null,
    abre: pl.abre || "", peso: 1,
  };
}

// Ideas que dependen de lo que pasa hoy: eventos de hoy y promos de paradores/campings.
function ideasDelDia(fecha, { eventos = [], lugares = [] }) {
  const hoy = iso(fecha), h = fecha.getHours() + fecha.getMinutes() / 60, out = [];
  for (const e of eventos) {
    if (!e.fecha) continue;
    const fin = e.fecha_fin || e.fecha;
    if (e.fecha <= hoy && hoy <= fin) {
      out.push({ id: "ev" + e.id, icon: e.emoji || "🎟️", tipo: "evento", texto: `Hoy: ${e.titulo}`, detalle: [e.lugar, e.horario].filter(Boolean).join(" · ") || "Evento de hoy en Colón", costo: "", momento: [], clima: "", dias: "", lugar: e.lugar || "", lat: null, lng: null, abre: "atractivos", peso: 6 });
    }
  }
  for (const l of lugares) {
    if (!l.promo || (l.tipo !== "parador" && l.tipo !== "camping")) continue;
    if (h < 10 || h > 19.5) continue;
    out.push({ id: "pr" + l.id, icon: "🔥", tipo: "promo", texto: `Promo en ${l.nombre}`, detalle: l.promo, costo: "", momento: [], clima: "", dias: "", lugar: l.nombre, lat: l.lat != null ? Number(l.lat) : null, lng: l.lng != null ? Number(l.lng) : null, abre: "playas", peso: 3 });
  }
  return out;
}

// Elige `n` ideas distintas: respeta hora, clima y día, evita repetir lo último que se mostró y mezcla los tipos de plan.
export function elegirIdeas({ planes, fecha = new Date(), clima = {}, eventos = [], lugares = [], userPos = null, n = 5, seed = null, excluir = [], usarVistos = true }) {
  const lista = (Array.isArray(planes) && planes.length >= 6 ? planes : PLANES_BASE).map(aIdea);
  const todas = [...ideasDelDia(fecha, { eventos, lugares }), ...lista];
  const mom = momentoDe(fecha);
  const cl = leerClima(clima);
  const dow = fecha.getDay();
  const finde = dow === 0 || dow === 6 || (dow === 5 && fecha.getHours() >= 17);
  const vistos = usarVistos ? leerVistos() : [];
  const enColon = estaEnColon(userPos);
  const rnd = seed == null ? Math.random : mulberry32(seed);

  const pesar = (it) => {
    let w = it.peso;
    if (excluir.includes(it.id)) return 0;
    if (it.momento.length) { if (!it.momento.includes(mom)) return 0; w *= 2.5; }
    if (it.dias === "finde" && !finde) return 0;
    if (it.dias === "semana" && finde) return 0;
    if (it.clima && cl.conocido) {
      const ok = it.clima === "lindo" ? cl.lindo : it.clima === "lluvia" ? cl.llueve : it.clima === "calor" ? cl.calor : it.clima === "frio" ? cl.frio : true;
      if (!ok) return 0;
      w *= 2.5;
    } else if (it.clima === "lluvia" || it.clima === "calor" || it.clima === "frio") {
      w *= 0.15; // sin clima cargado, no apostamos por planes de clima extremo
    }
    if (cl.conocido && cl.llueve && !it.clima && it.tipo === "paseo") w *= 0.1;
    const pos = vistos.lastIndexOf(it.id);
    if (pos >= 0) w *= 0.12 + 0.5 * (pos / Math.max(1, vistos.length)); // lo más reciente pesa menos
    if (enColon && userPos && it.lat != null) {
      const d = km(userPos.lat, userPos.lng, it.lat, it.lng);
      w *= d < 1.5 ? 1.5 : d < 5 ? 1 : 0.6;
    }
    return w;
  };

  let pool = todas.map((it) => ({ it, w: pesar(it) })).filter((x) => x.w > 0);
  const elegidas = [];
  const usadosTipo = {};
  while (elegidas.length < n && pool.length) {
    const ajust = pool.map((x) => ({ ...x, w: x.w / (1 + 1.6 * (usadosTipo[x.it.tipo] || 0)) }));
    const total = ajust.reduce((s, x) => s + x.w, 0);
    let r = rnd() * total, k = 0;
    for (; k < ajust.length; k++) { r -= ajust[k].w; if (r <= 0) break; }
    const pick = ajust[Math.min(k, ajust.length - 1)];
    elegidas.push(pick.it);
    usadosTipo[pick.it.tipo] = (usadosTipo[pick.it.tipo] || 0) + 1;
    pool = pool.filter((x) => x.it.id !== pick.it.id);
  }
  if (usarVistos && elegidas.length) guardarVistos([...vistos.filter((id) => !elegidas.some((e) => e.id === id)), ...elegidas.map((e) => e.id)]);
  return elegidas.map((it) => {
    let dist = null;
    if (enColon && userPos && it.lat != null) dist = km(userPos.lat, userPos.lng, it.lat, it.lng);
    return { ...it, dist };
  });
}

// Texto corto del botón del Inicio: una idea que cambia cada 30 minutos (no repite con la última mostrada en la pantalla de ideas).
export function getRecomendacionAhora(fecha = new Date(), clima = {}, extra = {}) {
  const seed = Math.floor(fecha.getTime() / (30 * 60 * 1000));
  const [it] = elegirIdeas({ ...extra, fecha, clima, n: 1, seed, usarVistos: false });
  if (!it) return { icon: "✨", texto: "Descubrí qué hacer en Colón, a cualquier hora del día." };
  return { icon: it.icon, texto: it.texto };
}
