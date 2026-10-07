// Mensaje corto del botón "¿Qué hago ahora?" del Inicio.
// Elige UNA sugerencia según la hora, la época del año y el clima.

// Hora aproximada del atardecer en Colón según el mes (0 = enero)
const ATARDECER = [20.2, 19.9, 19.3, 18.5, 18.0, 17.8, 17.9, 18.2, 18.7, 19.2, 19.8, 20.2];

export function getRecomendacionAhora(fecha = new Date(), clima = {}) {
  const h = fecha.getHours() + fecha.getMinutes() / 60;
  const atardecer = ATARDECER[fecha.getMonth()];
  const desc = (clima.desc || "").toLowerCase();
  const temp = parseInt(String(clima.temp || "").replace(/[^\d-]/g, ""), 10);
  const climaCargado = !Number.isNaN(temp) && !desc.includes("cargando");

  const llueve = /lluvi|chubasc|tormenta/.test(desc);
  if (climaCargado && llueve) {
    return { icon: "🌧️", texto: "Día de lluvia: buen momento para un café, las termas o un recorrido bajo techo." };
  }
  if (climaCargado && temp >= 31 && h >= 10 && h < 19) {
    return { icon: "🥵", texto: `Hace ${temp}°: ideal para refrescarse en la playa o tomar un helado.` };
  }
  if (climaCargado && temp <= 12 && h >= 8 && h < 20) {
    return { icon: "🧣", texto: `Hace fresco (${temp}°): un buen café o una visita a las termas.` };
  }

  if (h >= atardecer - 1.5 && h < atardecer + 0.25) {
    return { icon: "🌅", texto: "Se viene el atardecer: el mejor lugar es la costanera, frente al río." };
  }
  if (h >= 6 && h < 11) return { icon: "☕", texto: "Buen día: arrancá con un desayuno y un paseo tranquilo por la costanera." };
  if (h >= 11 && h < 15) return { icon: "🍽️", texto: "Es hora de almorzar: mirá qué restaurantes están abiertos ahora." };
  if (h >= 15 && h < atardecer - 1.5) return { icon: "🏖️", texto: "Tarde ideal para la playa, un paseo en bici o unos mates frente al río." };
  if (h >= atardecer + 0.25 && h < 23) return { icon: "🌙", texto: "Noche en Colón: cena con vista al río y buena música." };
  return { icon: "✨", texto: "Descubrí qué hacer en Colón, a cualquier hora del día." };
}
