import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CAT_COLOR } from "../data/constants.js";

const COLON_CENTER = [-32.2261, -58.1415];

// Puntos de interés propios de Colón por categoría
const LUGARES_PROPIOS = {
  "Playa": [
    { id: "p1", label: "Playa Norte", lat: -32.2118, lng: -58.1335, cat: "Playa", address: "Costanera Norte" },
    { id: "p2", label: "Playa Honda", lat: -32.2332, lng: -58.1315, cat: "Playa", address: "Costanera Sur" },
    { id: "p3", label: "Playa Inkier", lat: -32.2200, lng: -58.1320, cat: "Playa", address: "Av. Costanera" },
  ],
  "Hotel": [
    { id: "h1", label: "Hotel Termal Colón", lat: -32.2270, lng: -58.1450, cat: "Hotel", address: "Av. Quirós 232" },
    { id: "h2", label: "Apart Hotel Río", lat: -32.2240, lng: -58.1400, cat: "Hotel", address: "Av. Costanera 180" },
    { id: "h3", label: "Hostería del Puerto", lat: -32.2260, lng: -58.1380, cat: "Hotel", address: "Urquiza 456" },
  ],
  "Rest.": [
    { id: "r1", label: "Terrazas de Colón", lat: -32.2255, lng: -58.1410, cat: "Rest.", address: "Costanera y Bv. Gálvez" },
    { id: "r2", label: "Parrilla Don Coco", lat: -32.2280, lng: -58.1445, cat: "Rest.", address: "Paysandú 145" },
    { id: "r3", label: "La Estancia", lat: -32.2265, lng: -58.1430, cat: "Rest.", address: "12 de Abril 320" },
    { id: "r4", label: "El Establo", lat: -32.2290, lng: -58.1420, cat: "Rest.", address: "Alberdi 210" },
  ],
  "Café": [
    { id: "c1", label: "Café del Puerto", lat: -32.2248, lng: -58.1390, cat: "Café", address: "Av. Costanera 90" },
    { id: "c2", label: "Heladería El Rey", lat: -32.2270, lng: -58.1455, cat: "Café", address: "San Martín 112" },
    { id: "c3", label: "Bar Central", lat: -32.2275, lng: -58.1440, cat: "Café", address: "Av. Quirós 88" },
  ],
  "Atracción": [
    { id: "a1", label: "Termas de Colón", lat: -32.2290, lng: -58.1460, cat: "Atracción", address: "Ruta Pcial. 135" },
    { id: "a2", label: "Parque Quirós", lat: -32.2235, lng: -58.1395, cat: "Atracción", address: "Av. Quirós s/n" },
    { id: "a3", label: "Costanera Colón", lat: -32.2252, lng: -58.1330, cat: "Atracción", address: "Av. Costanera" },
    { id: "a4", label: "Parque Nacional El Palmar", lat: -32.1868, lng: -58.0896, cat: "Atracción", address: "Ruta Nac. 14" },
  ],
  "Deporte": [
    { id: "d1", label: "Molino Aventura", lat: -32.2210, lng: -58.1350, cat: "Deporte", address: "Acceso Norte" },
    { id: "d2", label: "Club Náutico Colón", lat: -32.2230, lng: -58.1340, cat: "Deporte", address: "Puerto Viejo" },
    { id: "d3", label: "Ciclovía Costanera", lat: -32.2245, lng: -58.1335, cat: "Deporte", address: "Av. Costanera" },
  ],
};

const ALL_PLACES = Object.values(LUGARES_PROPIOS).flat();

export default function MapView({ mapFilter, setMapFilter, filteredMarkers, mapCats, go }) {
  const mapDivRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Init map once
  useEffect(() => {
    if (mapInstanceRef.current || !mapDivRef.current) return;
    const map = L.map(mapDivRef.current, {
      center: COLON_CENTER,
      zoom: 14,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    mapInstanceRef.current = map;
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Redraw markers on filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const places = mapFilter === "Todos" ? ALL_PLACES : (LUGARES_PROPIOS[mapFilter] ?? []);

    places.forEach(place => {
      const color = CAT_COLOR[place.cat] || "#888";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:'DM Sans',sans-serif;min-width:140px">
            <div style="font-size:10px;color:${color};font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">${place.cat}</div>
            <div style="font-size:14px;font-weight:700;color:#1a1a2e">${place.label}</div>
            ${place.address ? `<div style="font-size:11px;color:#888;margin-top:3px">📍 ${place.address}</div>` : ""}
          </div>
        `)
        .on("click", () => setSelectedMarker(place));
      markersRef.current.push(marker);
    });

    // Fit bounds if filtered
    if (places.length > 0 && mapFilter !== "Todos") {
      const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else {
      map.setView(COLON_CENTER, 14);
    }
  }, [mapFilter]);

  const displayPlaces = mapFilter === "Todos" ? ALL_PLACES : (LUGARES_PROPIOS[mapFilter] ?? []);

  return (
    <div style={{ minHeight: "100vh", background: "#faf9f6", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#2E7D32,#1E88E5)", padding: "0 16px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ padding: "48px 0 16px", position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => go("inicio")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", width: 38, height: 38, borderRadius: "50%", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "inherit" }}>‹</button>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: 0 }}>
              Mapa de Colón
            </h1>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
              {mapFilter === "Todos" ? "Todos los puntos de interés" : `Mostrando: ${mapFilter}`}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "0 0 14px", scrollbarWidth: "none" }}>
          {mapCats.map(c => (
            <button key={c} onClick={() => { setMapFilter(c); setSelectedMarker(null); }} style={{ flexShrink: 0, padding: "7px 15px", fontSize: 11, fontWeight: 700, borderRadius: 20, cursor: "pointer", fontFamily: "inherit", background: mapFilter === c ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.15)", color: mapFilter === c ? "#2E7D32" : "rgba(255,255,255,0.9)", border: "none", transition: "all 0.2s" }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <div style={{ height: "calc(55svh)", minHeight: 320, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
        <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Tarjetas */}
      {mapFilter !== "Todos" && (
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
            {displayPlaces.length} resultado{displayPlaces.length !== 1 ? "s" : ""} · {mapFilter}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {displayPlaces.map(place => {
              const color = CAT_COLOR[place.cat] || "#888";
              return (
                <div key={place.id} onClick={() => {
                  setSelectedMarker(place);
                  const m = markersRef.current.find(mk => {
                    const ll = mk.getLatLng();
                    return ll.lat === place.lat && ll.lng === place.lng;
                  });
                  m?.openPopup();
                  mapInstanceRef.current?.setView([place.lat, place.lng], 16);
                }} style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{place.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                      <span style={{ background: color + "22", color, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{place.cat}</span>
                    </div>
                    {place.address && <div style={{ fontSize: 11, color: "#aaa", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {place.address}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leyenda */}
      {mapFilter === "Todos" && (
        <div style={{ margin: "14px 16px 0", background: "#fff", borderRadius: 16, padding: "13px 16px", border: "1px solid #f0ede6", display: "flex", flexWrap: "wrap", gap: 12 }}>
          {Object.entries(CAT_COLOR).map(([c, col]) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#666", fontWeight: 500 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />{c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
