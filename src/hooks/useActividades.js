import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api.js";

export function useActividades(tema) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/actividades", tema ? { tema } : {})
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tema]);

  return { data, loading };
}
