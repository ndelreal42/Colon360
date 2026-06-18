import { useState, useEffect } from "react";
import { BREATH_CYCLE as BREATH } from "../data/constants.js";

const FRASES = [
  "El río Uruguay te espera.",
  "Respirá el aire del litoral.",
  "Colón, donde el tiempo se detiene.",
  "Dejá que el sonido del agua te lleve.",
];

export default function RelaxPage({ go, relaxPlaying, setRelaxPlaying, relaxAudio, setRelaxAudio }) {
  const [breathIdx, setBreathIdx] = useState(0);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    let timeout;
    const next = (idx) => {
      setBreathIdx(idx);
      setScale(BREATH[idx].scale);
      timeout = setTimeout(() => next((idx + 1) % BREATH.length), BREATH[idx].duration);
    };
    next(0);
    return () => clearTimeout(timeout);
  }, []);

  const startAudio = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        }
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 350;
      const gain = ctx.createGain();
      gain.gain.value = 0.65;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      return { ctx, source };
    } catch (e) { return null; }
  };

  const toggleAudio = () => {
    if (relaxPlaying) {
      relaxAudio?.source?.stop();
      relaxAudio?.ctx?.close();
      setRelaxAudio(null);
      setRelaxPlaying(false);
    } else {
      setRelaxAudio(startAudio());
      setRelaxPlaying(true);
    }
  };

  const stopAndGo = () => {
    if (relaxPlaying) { relaxAudio?.source?.stop(); relaxAudio?.ctx?.close(); setRelaxAudio(null); setRelaxPlaying(false); }
    go("inicio");
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#004D56,#006064,#00838F,#0097A7)",paddingBottom:90,display:"flex",flexDirection:"column"}}>
      <div style={{padding:"0 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{padding:"48px 0 20px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
          <button onClick={stopAndGo} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
          <div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#fff",margin:0}}>Modo Relax</h1>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",marginTop:2}}>Sonidos del Río Uruguay</div>
          </div>
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px",gap:32}}>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",transition:`transform ${BREATH[breathIdx]?.duration||4000}ms ease-in-out`,transform:`scale(${scale})`}}>
            <div style={{width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.1)",border:"1.5px solid rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:70,height:70,borderRadius:"50%",background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:28}}>🌊</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:"#fff",marginBottom:6}}>{BREATH[breathIdx]?.label}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",fontFamily:"'DM Sans',sans-serif"}}>{FRASES[breathIdx % FRASES.length]}</div>
        </div>

        <button onClick={toggleAudio} style={{width:72,height:72,borderRadius:"50%",border:"2.5px solid rgba(255,255,255,0.4)",background:relaxPlaying?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.12)",cursor:"pointer",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:relaxPlaying?"0 0 32px rgba(255,255,255,0.3)":"none",transition:"all 0.3s"}}>
          {relaxPlaying ? "⏸" : "▶️"}
        </button>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",fontFamily:"'DM Sans',sans-serif"}}>
          {relaxPlaying ? "Sonido del río activado" : "Tocá para activar el sonido"}
        </div>

        <div style={{background:"rgba(255,255,255,0.08)",borderRadius:16,padding:"16px 18px",width:"100%",maxWidth:340}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>PARA TU ESTADÍA</div>
          {["Paseá por la Costanera al amanecer","Meditá frente al río en Playa Norte","El Molino Forclaz al atardecer es mágico","Café en Gaman antes de la caminata"].map((t,i)=>(
            <div key={i} style={{fontSize:12,color:"rgba(255,255,255,0.75)",fontFamily:"'DM Sans',sans-serif",marginBottom:6,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{opacity:0.5}}>·</span>{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
