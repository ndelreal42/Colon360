import { useEffect, useMemo, useRef, useState } from "react";
import { HERO_IMG } from "../assets/images.js";

// Las fotos se leen solas de src/assets/carousel/ (ver LEEME.txt en esa carpeta).
const FOTOS = import.meta.glob("../assets/carousel/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true, query: "?url", import: "default",
});

const INTERVALO_MS = 5000;

// Textos del carrusel, en el mismo orden que las fotos (01-..., 02-..., 03-...). SON DE EJEMPLO.
// Si hay más fotos que textos, las que sobran se muestran sin texto.
const TEXTOS = [
  { etiqueta: "HOY", titulo: "Aprovechá la promo 2x1 en el bar" },
  { etiqueta: "ANDÁ A", titulo: "El Molino Aventura" },
  { etiqueta: "ESTA NOCHE", titulo: "Show en vivo en Campo Adentro" },
];

export default function HeroCarousel() {
  const slides = useMemo(() => {
    const lista = Object.keys(FOTOS).sort().map(k => FOTOS[k]);
    return lista.length ? lista : [HERO_IMG];
  }, []);
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);
  const tocando = useRef(false);

  const irA = (i) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el || !el.clientWidth) return;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  // Avanza solo cada 5 s (se detiene mientras el usuario toca el carrusel)
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => {
      if (tocando.current) return;
      const el = ref.current;
      if (!el) return;
      const actual = Math.round(el.scrollLeft / el.clientWidth);
      irA((actual + 1) % slides.length);
    }, INTERVALO_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <>
      <div
        ref={ref}
        onScroll={onScroll}
        onTouchStart={() => { tocando.current = true; }}
        onTouchEnd={() => { setTimeout(() => { tocando.current = false; }, 4000); }}
        style={{
          position:"absolute", inset:0, display:"flex", overflowX:"auto", overflowY:"hidden",
          scrollSnapType:"x mandatory", scrollbarWidth:"none", msOverflowStyle:"none",
          WebkitOverflowScrolling:"touch", touchAction:"pan-x",
        }}
        className="hero-carousel"
      >
        {slides.map((src, i) => (
          <div key={i} style={{flex:"0 0 100%", height:"100%", scrollSnapAlign:"start", position:"relative"}}>
            <img
              src={src} alt={TEXTOS[i] ? TEXTOS[i].titulo : "Colón"} draggable={false}
              style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 35%",filter:"brightness(0.48) saturate(0.8)"}}
            />
            {slides.length > 1 && TEXTOS[i] && (
              <div style={{position:"absolute",left:18,right:18,bottom:34,zIndex:2,pointerEvents:"none"}}>
                <div style={{display:"inline-block",background:"#F9A825",color:"#1a1a2e",fontSize:10,fontWeight:800,letterSpacing:1.5,padding:"4px 10px",borderRadius:20,marginBottom:8}}>{TEXTOS[i].etiqueta}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.15,textShadow:"0 2px 14px rgba(0,0,0,0.6)",maxWidth:"92%"}}>{TEXTOS[i].titulo}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(to bottom, rgba(10,20,40,0.55) 0%, rgba(10,20,40,0.1) 40%, rgba(10,20,40,0.75) 100%)"}}/>
      {slides.length > 1 && (
        <div style={{position:"absolute",left:0,right:0,bottom:12,display:"flex",justifyContent:"center",gap:6,zIndex:3}}>
          {slides.map((_, i) => (
            <button
              key={i} onClick={() => irA(i)} aria-label={`Foto ${i + 1}`}
              style={{width:i===idx?18:7,height:7,borderRadius:4,border:"none",padding:0,cursor:"pointer",
                background:i===idx?"#fff":"rgba(255,255,255,0.5)",transition:"all .25s"}}
            />
          ))}
        </div>
      )}
      <style>{`.hero-carousel::-webkit-scrollbar{display:none}`}</style>
    </>
  );
}
