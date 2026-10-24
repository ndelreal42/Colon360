import { useEffect, useRef } from "react";
import { crearMapaParque } from "../lib/mapaParque.js";

// Envoltorio React del mapa ilustrado (la lógica y el dibujo viven en src/lib/mapaParque.js).
// Ocupa toda la pantalla menos la barra de abajo (BottomNav).
export default function MapaParque({ lugares, onVer, onVolver, onMapaReal }) {
  const ref = useRef(null);
  const inst = useRef(null);
  const ultimo = useRef("");
  const cb = useRef({});
  cb.current = { onVer, onVolver, onMapaReal };

  // Solo reubicamos los lugares cuando de verdad cambiaron (no en cada render de la app).
  const clave = (lugares || []).map((l) => `${l.id}:${l.lat}:${l.lng}`).join("|");

  useEffect(() => {
    inst.current = crearMapaParque(ref.current, {
      lugares,
      onVer: (item) => cb.current.onVer?.(item),
      onVolver: () => cb.current.onVolver?.(),
      onMapaReal: () => cb.current.onMapaReal?.(),
    });
    ultimo.current = clave;
    return () => { inst.current?.destroy(); inst.current = null; };
  }, []);

  useEffect(() => {
    if (!inst.current || ultimo.current === clave) return;
    ultimo.current = clave;
    inst.current.setLugares(lugares);
  }, [clave]);

  return <div ref={ref} style={{ position: "relative", height: "calc(100svh - 74px)", minHeight: 420, "--mp-top": "44px" }} />;
}
