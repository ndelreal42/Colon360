import { useState, useEffect } from "react";

const PNA_URL = "https://contenidosweb.prefecturanaval.gob.ar/alturas/?page=historico&tiempo=7&id=710";
const PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(PNA_URL)}`;

// Calcula si el río sube, baja o está estable comparando las dos últimas lecturas
function calcularTendencia(actual, anterior) {
  const a = parseFloat(actual), b = parseFloat(anterior);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  const dif = a - b;
  if (dif > 0.01) return "sube";
  if (dif < -0.01) return "baja";
  return "estable";
}

function parsearAltura(html) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = doc.querySelectorAll("table tr");
    // Se juntan todas las lecturas numéricas; la última es la más reciente
    const lecturas = [];
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      if (cells.length >= 3) {
        const texto = cells[0].textContent.trim();
        if (/^-?\d+\.\d+$/.test(texto)) {
          lecturas.push({ altura: texto, estado: cells[1]?.textContent.trim() || "Normal" });
          continue;
        }
        for (let j = 0; j < cells.length; j++) {
          const val = cells[j].textContent.trim();
          if (/^-?\d+\.\d+$/.test(val)) {
            lecturas.push({ altura: val, estado: cells[j + 1]?.textContent.trim() || "Normal" });
            break;
          }
        }
      }
    }
    if (lecturas.length) {
      const ultima = lecturas[lecturas.length - 1];
      const previa = lecturas.length > 1 ? lecturas[lecturas.length - 2] : null;
      return { ...ultima, tendencia: previa ? calcularTendencia(ultima.altura, previa.altura) : null };
    }
    // Fallback: buscar cualquier número decimal en el HTML (sin tendencia)
    const numeros = html.match(/-?\d+\.\d{2}/g);
    if (numeros?.length) return { altura: numeros[0], estado: "Normal", tendencia: null };
  } catch (e) {
    console.error("Error parseando PNA:", e);
  }
  return null;
}

export function useRioAltura() {
  const [data, setData] = useState({ altura: null, estado: null, tendencia: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    fetch(PROXY)
      .then(r => r.json())
      .then(json => {
        if (cancelled) return;
        const resultado = parsearAltura(json.contents || "");
        if (resultado) {
          setData({ altura: resultado.altura + " m", estado: resultado.estado, tendencia: resultado.tendencia, loading: false, error: false });
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
