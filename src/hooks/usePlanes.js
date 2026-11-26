import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api.js";

// Planes de "¿Qué hago ahora?" cargados desde el panel. Si falla o todavía no existe la tabla, devuelve [] y la app usa su lista base.
export function usePlanes() {
  const [data, setData] = useState([]);
  useEffect(() => {
    apiFetch("/planes").then((r) => Array.isArray(r) && setData(r)).catch(() => {});
  }, []);
  return { data };
}
