import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api.js";

// La altura del río Uruguay en Colón la lee el servidor (Cloudflare Worker) desde
// Prefectura Naval y la entrega ya procesada en /api/rio. Acá sólo se muestra.
// El valor que devuelve el hook mantiene la misma forma que usa App.jsx:
// { altura: "6.68 m", estado, tendencia: "sube" | "baja" | "estable" | null, loading, error }
export function useRioAltura() {
  const [data, setData] = useState({ altura: null, estado: null, tendencia: null, fecha: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    apiFetch("/rio")
      .then((r) => {
        if (cancelled) return;
        // Una lectura de hace más de 48 hs se trata como "sin datos" para no mostrar un valor viejo como si fuera actual.
        if (typeof r.altura !== "number" || r.desactualizado) {
          setData((d) => ({ ...d, loading: false, error: true }));
          return;
        }
        setData({
          altura: r.altura.toFixed(2) + " m",
          estado: r.estado || "Normal",
          tendencia: r.tendencia || null,
          fecha: r.fecha || null,
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        if (!cancelled) setData((d) => ({ ...d, loading: false, error: true }));
      });
    return () => { cancelled = true; };
  }, []);

  return data;
}
