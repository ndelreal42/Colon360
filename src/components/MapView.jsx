import { useEffect, useRef, useState } from "react";
import { CAT_COLOR } from "../data/constants.js";

const COLON_CENTER = { lat: -32.2261, lng: -58.1415 };
const RADIO_COLON = 3000; // 3 km — solo muestra dentro de Colón

const PLACES_CONFIG = {
  "Playa":     { keyword: "playa balneario", radius: RADIO_COLON },
  "Hotel":     { type: "lodging",            radius: RADIO_COLON },
  "Rest.":     { type: "restaurant",         radius: RADIO_COLON },
  "Café":      { type: "cafe",               radius: RADIO_COLON },
  "Atracción": { type: "tourist_attraction", radius: RADIO_COLON },
  "Deporte":   { keyword: "deporte kayak",   radius: RADIO_COLON },
};

function waitForGoogleMaps() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (window.google?.maps) { resolve(window.google.maps); return; }
      if (Date.now() - start > 10000) { reject(new Error("Google Maps no cargó")); return; }
      setTimeout(check, 100);
    };
    check();
  });
}

export default function MapView({
  mapFilter,
  setMapFilter,
  filteredMarkers,
  mapCats,
  go,
}) {
  const mapDivRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [activePlaces, setActivePlaces] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const placesServiceRef = useRef(null);

  // Keep a ref so overlays effect can read latest value without it being a dep
  const filteredMarkersRef = useRef(filteredMarkers);
  filteredMarkersRef.current = filteredMarkers;

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
  };

  // Initialize map once
  useEffect(() => {
    let cancelled = false;
    waitForGoogleMaps().then((maps) => {
      if (cancelled || !mapDivRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = new maps.Map(mapDivRef.current, {
        center: COLON_CENTER,
        zoom: 14,
        mapTypeId: "roadmap",
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
      });
      infoWindowRef.current = new maps.InfoWindow();
      if (maps.places) placesServiceRef.current = new maps.places.PlacesService(mapInstanceRef.current);
      setMapReady(true);
    }).catch(() => { if (!cancelled) setMapError(true); });
    return () => { cancelled = true; };
  }, []);

  // Buscar lugares reales en Google Places al cambiar filtro
  useEffect(() => {
    if (!mapReady) { setActivePlaces(null); return; }
    if (mapFilter === "Todos") { setActivePlaces(null); return; }
    const service = placesServiceRef.current;
    const config = PLACES_CONFIG[mapFilter];
    if (!service || !config) { setActivePlaces(null); return; }
    setLoadingPlaces(true);
    service.nearbySearch(
      { location: COLON_CENTER, ...config },
      (results, status) => {
        setLoadingPlaces(false);
        const OK = window.google?.maps?.places?.PlacesServiceStatus?.OK;
        if (status === OK && results?.length > 0) {
          setActivePlaces(results.map(p => ({
            id: p.place_id, label: p.name, cat: mapFilter,
            lat: p.geometry.location.lat(), lng: p.geometry.location.lng(),
            rating: p.rating, address: p.vicinity,
          })));
        } else {
          setActivePlaces(null);
        }
      }
    );
  }, [mapReady, mapFilter]);

  // Close InfoWindow when filter changes
  useEffect(() => {
    if (!mapReady) return;
    infoWindowRef.current?.close();
    setSelectedMarker(null);
  }, [mapReady, mapFilter]);

  // Redibujar markers: Places API si hay resultados, sino datos internos
  useEffect(() => {
    if (!mapReady) return;
    const maps = window.google.maps;
    clearMarkers();

    const markers = activePlaces ?? filteredMarkersRef.current;
    markers.forEach(m => {
      if (!m.lat || !m.lng) return;
      const color = CAT_COLOR[m.cat] || "#888";
      const marker = new maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: mapInstanceRef.current,
        title: m.label,
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2.5,
        },
      });
      marker.addListener("click", () => {
        setSelectedMarker(prev => prev?.id === m.id ? null : m);
        infoWindowRef.current.setContent(`
          <div style="font-family:'DM Sans',sans-serif;padding:4px 2px">
            <div style="font-size:10px;color:${color};font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">${m.cat}</div>
            <div style="font-size:14px;font-weight:700;color:#1a1a2e">${m.label}</div>
            ${m.rating ? `<div style="font-size:11px;color:#888;margin-top:3px">⭐ ${m.rating}</div>` : ""}
            ${m.address ? `<div style="font-size:11px;color:#aaa;margin-top:2px">${m.address}</div>` : ""}
          </div>
        `);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });
      markersRef.current.push(marker);
    });

    mapInstanceRef.current.addListener("click", () => {
      setSelectedMarker(null);
      infoWindowRef.current.close();
    });
  // filteredMarkers excluded from deps intentionally — read via ref to avoid
  // closing InfoWindow on every App.jsx re-render (e.g. time tick)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, activePlaces]);

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

        {/* Filtro categorías — dentro del header */}
        <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "0 0 14px", scrollbarWidth: "none" }}>
          {mapCats.map(c => (
            <button key={c} onClick={() => setMapFilter(c)} style={{ flexShrink: 0, padding: "7px 15px", fontSize: 11, fontWeight: 700, borderRadius: 20, cursor: "pointer", fontFamily: "inherit", background: mapFilter === c ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.15)", color: mapFilter === c ? "#2E7D32" : "rgba(255,255,255,0.9)", border: "none", transition: "all 0.2s" }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Google Map — más grande */}
      <div style={{ position: "relative", height: "calc(55svh)", minHeight: 320, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
        {!mapReady && !mapError && (
          <div style={{ position: "absolute", inset: 0, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
            <div style={{ color: "#2E7D32", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>Cargando mapa...</div>
          </div>
        )}
        {loadingPlaces && (
          <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", background:"rgba(30,136,229,0.92)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, padding:"5px 14px", borderRadius:20, zIndex:2, pointerEvents:"none" }}>
            Buscando lugares...
          </div>
        )}
        {mapError && (
          <div style={{ position: "absolute", inset: 0, background: "#fff3e0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1, gap: 8 }}>
            <div style={{ fontSize: 28 }}>⚠️</div>
            <div style={{ color: "#e65100", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, textAlign: "center", padding: "0 20px" }}>No se pudo cargar el mapa.<br/>Verificá la API key de Google Maps.</div>
          </div>
        )}
        <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Tarjetas filtradas — solo cuando hay filtro activo */}
      {mapFilter !== "Todos" && (
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
            {loadingPlaces ? "Buscando en Google Maps..." : `${(activePlaces ?? filteredMarkers).length} resultado${(activePlaces ?? filteredMarkers).length !== 1 ? "s" : ""} · ${mapFilter}`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(activePlaces ?? filteredMarkers).map(place => {
              const color = CAT_COLOR[place.cat] || "#888";
              return (
                <div key={place.id} style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{place.label || place.nombre}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                      <span style={{ background: color + "22", color, borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>{place.cat}</span>
                      {place.rating && <span style={{ fontSize: 11, color: "#888" }}>⭐ {place.rating}</span>}
                    </div>
                    {place.address && <div style={{ fontSize: 11, color: "#aaa", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📍 {place.address}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leyenda — solo en modo Todos */}
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
