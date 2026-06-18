import { useState } from "react";

// ── Geo helpers (local copy) ───────────────────────────────────────────────
function calcKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function abrirMaps(lat, lng, nombre) {
  const query = nombre
    ? encodeURIComponent(`${nombre}, Colón, Entre Ríos, Argentina`)
    : `${lat},${lng}`;
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
}

// ── Candidatos con coords ──────────────────────────────────────────────────
function getCandidatos(hora) {
  const h = hora.getHours();
  const min = hora.getMinutes();
  const day = hora.getDay();
  const candidatos = [];

  // Atardecer (20:15 en Colón)
  const diffMin = (20 - h) * 60 + (15 - min);
  if (diffMin > 0 && diffMin < 120)
    candidatos.push({ icon:"🌅", texto:"Ver el atardecer en la Costanera", detalle:`Faltan ${diffMin} min · Mejor vista: frente al Puerto`, lat:-32.2255, lng:-58.1405 });
  else if (h >= 7 && h < 12)
    candidatos.push({ icon:"☀️", texto:"Mañana perfecta para las termas", detalle:"Termas Colón · Ruta 135 · Pocas filas a esta hora", lat:-32.2157, lng:-58.1238 });

  // Música en vivo
  if ((day === 5 || day === 6) && h >= 21)
    candidatos.push({ icon:"🎶", texto:"Música en vivo esta noche", detalle:"Campo Adentro · Show folklore", lat:-32.2320, lng:-58.1365 });
  else if (h >= 10 && h < 14)
    candidatos.push({ icon:"🎶", texto:"Feria Costanera abierta ahora", detalle:"Artesanías, gastronomía y música · Entrada libre", lat:-32.2255, lng:-58.1405 });

  // Comida / drinks
  if (h >= 17 && h < 20)
    candidatos.push({ icon:"🍻", texto:"Happy hour en Brown 38", detalle:"Alte G. Brown 38 · 2x1 hasta las 20hs", lat:-32.2265, lng:-58.1330 });
  else if (h >= 8 && h < 11)
    candidatos.push({ icon:"☕", texto:"Desayuno en Gaman Café", detalle:"Café de especialidad + laminados · Centro · Abierto ahora", lat:-32.2274, lng:-58.1335 });

  // Playa / bici
  if (h >= 10 && h < 19)
    candidatos.push({ icon:"🌊", texto:"Playa Honda: menos gente ahora", detalle:"Costanera Sur · Aguas más tranquilas a esta hora", lat:-32.2332, lng:-58.1315 });
  if (h >= 9 && h < 18)
    candidatos.push({ icon:"🚴", texto:"Ciclovía costera libre", detalle:"8 km desde el Puerto · Alquiler de bicicletas disponible", lat:-32.2298, lng:-58.1408 });

  // Cena
  if (h >= 20)
    candidatos.push({ icon:"🌙", texto:"Cena con vista al río", detalle:"Terrazas de Colón · San Martín 144 · Reservar mesa", lat:-32.2248, lng:-58.1408 });

  // Siempre disponibles
  candidatos.push({ icon:"🏛️", texto:"Visitá el Molino Forclaz", detalle:"Patrimonio histórico · Visitas guiadas", lat:-32.2350, lng:-58.1420 });
  candidatos.push({ icon:"🍦", texto:"Heladería El Rey", detalle:"Helados artesanales · Un clásico de Colón", lat:-32.2265, lng:-58.1378 });

  return candidatos;
}

function getAhoraRecomendaciones(hora, userPos) {
  const candidatos = getCandidatos(hora);

  if (userPos) {
    // Ordenar por distancia al usuario y tomar los 4 más cercanos
    return candidatos
      .sort((a, b) => calcKm(userPos.lat, userPos.lng, a.lat, a.lng) - calcKm(userPos.lat, userPos.lng, b.lat, b.lng))
      .slice(0, 4);
  }

  return candidatos.slice(0, 4);
}

export default function AhoraModePage({ go, userPos, clima }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [localPos, setLocalPos] = useState(userPos);
  const [hora] = useState(new Date());

  const activar = () => {
    setLoading(true);
    const run = (pos) => {
      setTimeout(() => {
        setResult(getAhoraRecomendaciones(hora, pos));
        setLoading(false);
      }, 1800);
    };

    const posActual = localPos || userPos;
    if (posActual) {
      run(posActual);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
          setLocalPos(pos);
          run(pos);
        },
        () => run(null),
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      run(null);
    }
  };

  const posUsada = localPos || userPos;
  const gradA = "linear-gradient(135deg,#F9A825,#FF6F00)";

  return (
    <div style={{minHeight:"100vh",background:"#faf9f6",paddingBottom:100}}>
      <div style={{background:gradA,padding:"0 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
        <div style={{padding:"48px 0 20px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>go("inicio")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>‹</button>
          <div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff",margin:0}}>¿Qué hago ahora?</h1>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>Recomendaciones en tiempo real</div>
          </div>
        </div>
      </div>

      <div style={{height:16}}/>
      <div style={{padding:"0 16px"}}>
        {!result && !loading && (
          <div>
            <button onClick={activar} style={{width:"100%",background:"linear-gradient(135deg,#F9A825,#FF6F00)",border:"none",borderRadius:22,padding:"32px 24px",cursor:"pointer",fontFamily:"inherit",boxShadow:"0 12px 40px rgba(249,168,37,0.45)",marginBottom:16,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <div style={{fontSize:52}}>⚡</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:"#fff",textAlign:"center",lineHeight:1.15}}>Estoy en Colón ahora</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",textAlign:"center",lineHeight:1.5}}>Usamos la hora, el clima y tu ubicación<br/>para decirte exactamente qué hacer</div>
            </button>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
              {[
                {icon:"🕐", label:"Hora actual", val:hora.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})},
                {icon:clima?.icon||"🌤️", label:"Clima", val:`${clima?.temp||"—"} · ${clima?.desc||"—"}`},
                {icon:"📍", label:"Ubicación", val:posUsada?"Detectada ✓":"No detectada"},
              ].map((c,i)=>(
                <div key={i} style={{background:"#fff",borderRadius:14,padding:"12px 10px",textAlign:"center",border:"1px solid #f0ede6",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div style={{fontSize:20,marginBottom:4}}>{c.icon}</div>
                  <div style={{fontSize:9,color:"#bbb",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{c.label}</div>
                  <div style={{fontSize:11,fontWeight:700,color:i===2&&posUsada?"#2E7D32":"#333"}}>{c.val}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:16,padding:"16px",border:"1px solid #f0ede6",fontSize:12,color:"#888",lineHeight:1.7,fontFamily:"'DM Sans',sans-serif"}}>
              <strong style={{color:"#333",display:"block",marginBottom:6}}>¿Cómo funciona?</strong>
              La app combina la hora del día, los eventos actuales, las condiciones climáticas y tu posición para sugerirte las actividades <strong style={{color:"#333"}}>más cercanas</strong> que podés hacer en los próximos minutos.
            </div>
          </div>
        )}

        {loading && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:60,gap:16}}>
            <div style={{fontSize:48,animation:"blink 1s infinite"}}>⚡</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#1a1a2e",textAlign:"center"}}>Analizando el momento...</div>
            <div style={{fontSize:13,color:"#aaa",textAlign:"center"}}>Consultando hora, clima{posUsada?" y ubicación GPS":""}</div>
          </div>
        )}

        {result && (
          <div>
            <div style={{background:"linear-gradient(135deg,#F9A825,#FF6F00)",borderRadius:18,padding:"18px 20px",marginBottom:16,boxShadow:"0 8px 28px rgba(249,168,37,0.35)"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.75)",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>
                {posUsada ? "Planes más cercanos a vos" : "Ahora mismo podés"}
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff"}}>{hora.toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})} · Colón</div>
            </div>
            {result.map((item,i)=>{
              const kmDist = posUsada ? calcKm(posUsada.lat, posUsada.lng, item.lat, item.lng) : null;
              const distLabel = kmDist !== null ? (kmDist < 1 ? `${Math.round(kmDist*1000)} m` : `${kmDist.toFixed(1)} km`) : null;
              return (
                <div key={i} style={{background:"#fff",borderRadius:18,padding:"18px",marginBottom:10,border:"1px solid #f0ede6",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
                  <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#FFF8E1,#FFF3E0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,border:"1.5px solid #FFE0B2"}}>{item.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:"#1a1a2e",lineHeight:1.2,marginBottom:4}}>{item.texto}</div>
                      <div style={{fontSize:12,color:"#888",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>{item.detalle}</div>
                    </div>
                  </div>
                  {distLabel && (
                    <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid #f5f5f5",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{fontSize:12,color:"#aaa"}}>Distancia desde vos</div>
                      <div onClick={()=>abrirMaps(item.lat, item.lng, item.texto)}
                        style={{fontSize:11,fontWeight:700,color:"#fff",background:"#E53935",borderRadius:20,padding:"4px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                        📍 {distLabel} · Ver recorrido
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={()=>setResult(null)} style={{width:"100%",marginTop:8,padding:"14px",borderRadius:14,border:"1.5px solid #ede9e0",background:"#fff",color:"#555",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Volver a consultar
            </button>
            <div onClick={()=>go("juegos")} style={{marginTop:10,background:"linear-gradient(135deg,#6A1B9A,#AB47BC)",borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",boxShadow:"0 4px 14px rgba(106,27,154,0.28)"}}>
              <span style={{fontSize:24}}>🎲</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>¿Te quedás un rato más?</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:1}}>Juegos para hacer en Colón →</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
