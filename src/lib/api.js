// Wrapper para llamadas a la API del servidor
const API_URL = "https://colon360-api.colon360.workers.dev";

export async function apiFetch(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_URL}/api${path}?${query}` : `${API_URL}/api${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}