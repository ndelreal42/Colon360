import { MAP_MARKERS } from "./lugares.js";

// Lookup nombre→coords construido desde MAP_MARKERS
export const LUGAR_COORDS = {};
MAP_MARKERS.forEach(m => { LUGAR_COORDS[m.label] = { lat: m.lat, lng: m.lng }; });
// Coordenadas extra para atractivos y eventos con nombres distintos
Object.assign(LUGAR_COORDS, {
  "Parque Nacional El Palmar":    { lat:-32.1868, lng:-58.0896 },
  "Refugio La Aurora del Palmar": { lat:-32.2050, lng:-58.1100 },
  "Termas Colón":                 { lat:-32.2157, lng:-58.1238 },
  "Playas e Islas del Río Uruguay":{ lat:-32.2252, lng:-58.1330 },
  "Espacios Verdes y Parque Quirós":{ lat:-32.2190, lng:-58.1452 },
  "Palacio San José":             { lat:-32.4967, lng:-58.3498 },
  "Museo Histórico Regional":     { lat:-32.2267, lng:-58.1393 },
  "Complejo Termal Municipal":    { lat:-32.2157, lng:-58.1238 },
  "Brown 38":                     { lat:-32.2265, lng:-58.1330 },
  "Restaurant Viejo Almacén":     { lat:-32.2270, lng:-58.1432 },
  "Origen":                       { lat:-32.2255, lng:-58.1405 },
  // Gastronomía real
  "Juanes":                       { lat:-32.2250, lng:-58.1452 },
  "Alan Pizza Bar":               { lat:-32.2290, lng:-58.1390 },
  "Maldita Pizzería":             { lat:-32.2245, lng:-58.1445 },
  "El Calamar":                   { lat:-32.2255, lng:-58.1453 },
  "Los Tamalitos":                { lat:-32.2260, lng:-58.1410 },
  "Platos Rotos":                 { lat:-32.2270, lng:-58.1438 },
  "Los Gurises":                  { lat:-32.2280, lng:-58.1440 },
  "Anthony Burger":               { lat:-32.2250, lng:-58.1453 },
  "Diburger":                     { lat:-32.2258, lng:-58.1432 },
  "El Rey del Chivito":           { lat:-32.2275, lng:-58.1438 },
  "Cielito Lindo":                { lat:-32.2265, lng:-58.1445 },
  "Tractor Cervecería":           { lat:-32.2252, lng:-58.1453 },
  "Primitivo Kraft":              { lat:-32.2255, lng:-58.1445 },
  "Buenas y Santas":              { lat:-32.2262, lng:-58.1448 },
  "Jacintacc":                    { lat:-32.2255, lng:-58.1442 },
  "La Pastelería de Mel":         { lat:-32.2280, lng:-58.1442 },
  "Red Velvet":                   { lat:-32.2258, lng:-58.1442 },
  "Cremolatti":                   { lat:-32.2248, lng:-58.1435 },
  "Heladería Libereco":           { lat:-32.2255, lng:-58.1435 },
  "Heladería Italia":             { lat:-32.2250, lng:-58.1437 },
  // Lugares de eventos
  "Puerto de Colón":              { lat:-32.2298, lng:-58.1408 },
  "Puerto Fluvial":               { lat:-32.2298, lng:-58.1408 },
  "La Casona · Centro de Colón":  { lat:-32.2255, lng:-58.1358 },
  "Costanera de Colón":           { lat:-32.2255, lng:-58.1405 },
  "Molino Forclaz · Colón":       { lat:-32.2350, lng:-58.1420 },
  "Ruta 14, Entre Ríos":          { lat:-32.1868, lng:-58.0896 },
});

export const HEAT_ZONES = [
  { id:"playa_norte",  label:"Playa Norte",   lat:-32.2120, lng:-58.1410, type:"playa",       peak:[9,16],  emoji:"🏖️" },
  { id:"playa_honda",  label:"Playa Honda",   lat:-32.2335, lng:-58.1383, type:"playa",       peak:[9,15],  emoji:"🏖️" },
  { id:"costanera",    label:"Costanera",     lat:-32.2255, lng:-58.1405, type:"paseo",       peak:[17,21], emoji:"🌅" },
  { id:"centro_gast",  label:"Zona Gastro",   lat:-32.2280, lng:-58.1340, type:"gastronomia", peak:[12,14], emoji:"🍽️" },
  { id:"noche_vida",   label:"Vida Nocturna", lat:-32.2265, lng:-58.1330, type:"noche",       peak:[21,23], emoji:"🎶" },
  { id:"palmar",       label:"El Palmar",     lat:-32.1868, lng:-58.0896, type:"naturaleza",  peak:[8,16],  emoji:"🌴" },
];
export const HEAT_COLOR = { playa:"#1E88E5", paseo:"#FF6F00", gastronomia:"#2E7D32", noche:"#7B1FA2", naturaleza:"#43A047" };
