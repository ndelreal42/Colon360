// Wrapper para llamadas a la API del servidor
export async function apiFetch(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api${path}?${query}` : `/api${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}
