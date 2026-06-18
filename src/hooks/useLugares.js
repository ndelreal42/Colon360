import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api.js";

export function useLugares(tipo) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch("/lugares", tipo ? { tipo } : {})
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tipo]);

  return { data, loading };
}

export function useLugar(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiFetch(`/lugares/${id}`)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading };
}
