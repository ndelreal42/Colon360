import { lazy, Suspense, useState } from "react";
import MapaParque from "./MapaParque.jsx";

// El mapa real (Leaflet + MapLibre) pesa mucho: se descarga solo si alguien lo pide.
const MapaReal = lazy(() => import("./MapaReal.jsx"));

// Pantalla Mapa: por defecto muestra el mapa ilustrado (estilo parque); con un botón se pasa al mapa real.
// La elección queda guardada en el celular.
export default function MapView(props) {
  const [modo, setModo] = useState(() => { try { return localStorage.getItem("c360_mapa") || "parque"; } catch (_) { return "parque"; } });
  const cambiar = (m) => { setModo(m); try { localStorage.setItem("c360_mapa", m); } catch (_) {} window.scrollTo(0, 0); };
  if (modo === "parque") {
    return <MapaParque lugares={props.lugares} onVer={props.onVer} onVolver={() => props.go("inicio")} onMapaReal={() => cambiar("real")} />;
  }
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 13 }}>Cargando mapa real…</div>}>
      <MapaReal {...props} onIlustrado={() => cambiar("parque")} />
    </Suspense>
  );
}

