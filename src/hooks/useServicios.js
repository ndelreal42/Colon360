import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api.js";

export function useServicios(cat) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/servicios", cat ? { cat } : {})
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cat]);

  return { data, loading };
}
