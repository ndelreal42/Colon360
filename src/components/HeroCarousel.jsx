import { useEffect, useMemo, useRef, useState } from "react";
import { HERO_IMG } from "../assets/images.js";

// Las fotos se leen solas de src/assets/carousel/ (ver LEEME.txt en esa carpeta).
const FOTOS = import.meta.glob("../assets/carousel/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true, query: "?url", import: "default",
});

const INTERVALO_MS = 5000;

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
              src={src} alt="Colón" draggable={false}
              style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 35%",filter:"brightness(0.48) saturate(0.8)"}}
            />
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
