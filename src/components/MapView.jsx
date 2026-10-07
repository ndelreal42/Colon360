import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CAT_COLOR } from "../data/constants.js";

const COLON_CENTER = [-32.2261, -58.1415];

export default function MapView({ mapFilter, setMapFilter, mapCats, lugares, onVer, go }) {
  const mapDivRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [, setSelectedMarker] = useState(null);
  const onVerRef = useRef(onVer);
  onVerRef.current = onVer;
  const visibles = mapFilter === "Todos" ? lugares : lugares.filter(l => l.cat === mapFilter);

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

    const places = visibles.filter(p => p.lat != null && p.lng != null);

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
            ${place.item ? `<button data-ver="${place.id}" style="margin-top:8px;background:${color};color:#fff;border:none;border-radius:14px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Ver →</button>` : ""}
          </div>
        `)
        .on("click", () => setSelectedMarker(place))
        .on("popupopen", (e) => {
          const btn = e.popup.getElement()?.querySelector("[data-ver]");
          if (btn) btn.onclick = () => onVerRef.current?.(place.item);
        });
      markersRef.current.push(marker);
    });

    // Fit bounds if filtered
    if (places.length > 0 && mapFilter !== "Todos") {
      const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else {
      map.setView(COLON_CENTER, 14);
    }
  }, [mapFilter, lugares]);

  const displayPlaces = visibles;

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

      {/* Leyenda de colores (solo sin filtro) */}
      {mapFilter === "Todos" && (
        <div style={{ margin: "14px 16px 0", background: "#fff", borderRadius: 16, padding: "10px 14px", border: "1px solid #f0ede6", display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
          {Object.entries(CAT_COLOR).map(([c, col]) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#666", fontWeight: 500 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />{c}
            </div>
          ))}
        </div>
      )}

      {/* Lista de lugares (todos, o los de la etiqueta elegida) */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
          {displayPlaces.length} {mapFilter === "Todos" ? `lugar${displayPlaces.length !== 1 ? "es" : ""}` : `resultado${displayPlaces.length !== 1 ? "s" : ""} · ${mapFilter}`}
        </div>
        {displayPlaces.length === 0 && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "18px 16px", fontSize: 13, color: "#999", textAlign: "center" }}>
            Cargando lugares…
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {displayPlaces.map(place => {
            const color = CAT_COLOR[place.cat] || "#888";
            const enMapa = place.lat != null && place.lng != null;
            return (
              <div key={place.id} onClick={() => {
                if (!enMapa) return;
                setSelectedMarker(place);
                const m = markersRef.current.find(mk => {
                  const ll = mk.getLatLng();
                  return ll.lat === place.lat && ll.lng === place.lng;
                });
                mapDivRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                m?.openPopup();
                mapInstanceRef.current?.setView([place.lat, place.lng], 16);
              }} style={{ background: "#fff", borderRadius: 16, padding: "12px 12px 12px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12, cursor: enMapa ? "pointer" : "default" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{place.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                    <span style={{ background: color + "22", color, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{place.cat}</span>
                    {!enMapa && <span style={{ fontSize: 10, color: "#bbb" }}>Sin ubicación en el mapa</span>}
                  </div>
                  {place.address && <div style={{ fontSize: 11, color: "#aaa", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {place.address}</div>}
                </div>
                {place.item && (
                  <button onClick={(e) => { e.stopPropagation(); onVer?.(place.item); }} style={{ flexShrink: 0, background: color, color: "#fff", border: "none", borderRadius: 18, padding: "9px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 3px 10px ${color}55` }}>
                    Ver ›
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
