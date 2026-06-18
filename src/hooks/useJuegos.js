import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api.js";

export function useJuegos(categoria) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/juegos", categoria ? { categoria } : {})
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoria]);

  return { data, loading };
}
