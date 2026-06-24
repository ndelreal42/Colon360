import { useState, useEffect } from "react";

const PNA_URL = "https://contenidosweb.prefecturanaval.gob.ar/alturas/?page=historico&tiempo=7&id=710";
const PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(PNA_URL)}`;

function parsearAltura(html) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("table tr");
    // La última fila con datos numéricos tiene la lectura más reciente
    for (let i = rows.length - 1; i >= 0; i--) {
      const cells = rows[i].querySelectorAll("td");
      if (cells.length >= 3) {
        const texto = cells[0].textContent.trim();
        // Buscar celda con valor numérico tipo "2.15" o "-0.32"
        const match = texto.match(/^-?\d+\.\d+$/);
        if (match) {
          return { altura: texto, estado: cells[1]?.textContent.trim() || "Normal" };
        }
        // Buscar en cualquier celda de la fila
        for (let j = 0; j < cells.length; j++) {
          const val = cells[j].textContent.trim();
          if (/^-?\d+\.\d+$/.test(val)) {
            const estadoCell = cells[j + 1]?.textContent.trim();
            return { altura: val, estado: estadoCell || "Normal" };
          }
        }
      }
    }
    // Fallback: buscar cualquier número decimal en el HTML
    const numeros = html.match(/-?\d+\.\d{2}/g);
    if (numeros?.length) return { altura: numeros[0], estado: "Normal" };
  } catch (e) {
    console.error("Error parseando PNA:", e);
  }
  return null;
}

export function useRioAltura() {
  const [data, setData] = useState({ altura: null, estado: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    fetch(PROXY)
      .then(r => r.json())
      .then(json => {
        if (cancelled) return;
        const resultado = parsearAltura(json.contents || "");
        if (resultado) {
          setData({ altura: resultado.altura + " m", estado: resultado.estado, loading: false, error: false });
        } else {
          setData(d => ({ ...d, loading: false, error: true }));
        }
      })
      .catch(() => {
        if (!cancelled) setData(d => ({ ...d, loading: false, error: true }));
      });
    return () => { cancelled = true; };
  }, []);

  return data;
}
