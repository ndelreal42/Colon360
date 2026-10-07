import { useState } from "react";
import { abrirContacto } from "../lib/helpers.js";


// ─── DETAIL PAGE ─────────────────────────────────────────────────────────────
export default function DetailPage({ item, onBack }) {
  const color = item.color || "#1E88E5";
  const [consultaOpen, setConsultaOpen] = useState(false);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [personas, setPersonas] = useState(2);

  const enviarWA = () => {
    const fmtFecha = f => {
      if (!f) return "—";
      const [y,m,d] = f.split("-");
      return `${d}/${m}/${y}`;
    };
    const msg = encodeURIComponent(
      `Hola! Me interesa reservar Casa 1.\n📅 Fecha: ${fmtFecha(desde)} al ${fmtFecha(hasta)}\n👥 Personas: ${personas}\n\n¿Está disponible?`
    );
    window.open(`https://wa.me/5491164589871?text=${msg}`, "_blank");
  };
  return (
    <div style={{background:"#faf9f6", minHeight:"100vh", paddingBottom:90}}>
      <div style={{background:`linear-gradient(150deg, ${color} 0%, ${color}dd 100%)`, padding:"0 16px", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{padding:"48px 0 16px", position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:14}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
          <div style={{flex:1, minWidth:0}}>
            {item.tipo && <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",letterSpacing:2,textTransform:"uppercase",marginBottom:3,fontFamily:"'DM Sans',sans-serif"}}>{item.tipo}</div>}
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.15,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.nombre || item.titulo}</h1>
          </div>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{item.emoji}</div>
        </div>
      </div>

      <div style={{height:16,background:"#faf9f6"}}/>

      <div style={{margin:"0 16px",background:"#fff",borderRadius:22,boxShadow:"0 8px 32px rgba(0,0,0,0.09)",padding:"26px 22px",marginBottom:14}}>
        {item.rating && (
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:14}}>
            {[1,2,3,4,5].map(i=><span key={i} style={{color:i<=Math.round(item.rating)?"#F9A825":"#ddd",fontSize:16}}>★</span>)}
            <span style={{fontSize:13,color:"#999",marginLeft:4}}>{item.rating}</span>
          </div>
        )}
        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#333",lineHeight:1.85,fontWeight:400,margin:0}}>{item.desc}</p>
        {item.tags && (
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:18}}>
            {item.tags.map(t=><span key={t} style={{fontSize:11,fontWeight:600,padding:"5px 13px",borderRadius:20,background:`${color}12`,color,border:`1px solid ${color}25`,fontFamily:"'DM Sans',sans-serif"}}>{t}</span>)}
          </div>
        )}
      </div>

      <div style={{padding:"0 16px"}}>
        <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>INFORMACIÓN</div>
        {item.horario && item.horario !== '—' && <InfoRow icon="🕐" label="Horario" value={item.horario} color={color}/>}
        {item.dir && <InfoRow icon="📍" label="Dirección" value={item.dir} color={color}/>}
        {item.lugar && <InfoRow icon="📍" label="Lugar" value={item.lugar} color={color}/>}
        {item.tel && item.tel !== '—' && <InfoRow icon="📞" label="Contacto" value={item.tel} color={color} onClick={()=>abrirContacto(item.tel)}/>}
        {item.wa && <InfoRow icon="💬" label="WhatsApp" value="Consultar por WhatsApp" color="#25D366" onClick={()=>window.open(item.wa,'_blank')}/>}

        {item.id === "a8" && (
          <div style={{marginTop:8}}>
            <button onClick={()=>setConsultaOpen(o=>!o)} style={{width:"100%",background:"linear-gradient(135deg,#25D366,#128C7E)",border:"none",borderRadius:16,padding:"15px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(37,211,102,0.35)"}}>
              <span style={{fontSize:18}}>💬</span>
              <span style={{fontSize:15,fontWeight:800,color:"#fff"}}>Consultar disponibilidad</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginLeft:4}}>{consultaOpen?"▲":"▼"}</span>
            </button>

            {consultaOpen && (
              <div style={{background:"#fff",borderRadius:16,padding:"20px 16px",marginTop:8,border:"1px solid #e8f5e9",boxShadow:"0 4px 16px rgba(0,0,0,0.07)"}}>
                <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",marginBottom:16}}>Completá los datos para consultar</div>

                {/* Fechas */}
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>📅 Fechas</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div>
                      <div style={{fontSize:11,color:"#aaa",marginBottom:4}}>Llegada</div>
                      <input type="date" value={desde} onChange={e=>setDesde(e.target.value)}
                        style={{width:"100%",padding:"10px 10px",borderRadius:12,border:"1.5px solid #e0e0e0",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#333",background:"#fafafa",boxSizing:"border-box",outline:"none"}}
                      />
                    </div>
                    <div>
                      <div style={{fontSize:11,color:"#aaa",marginBottom:4}}>Salida</div>
                      <input type="date" value={hasta} onChange={e=>setHasta(e.target.value)} min={desde}
                        style={{width:"100%",padding:"10px 10px",borderRadius:12,border:"1.5px solid #e0e0e0",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:"#333",background:"#fafafa",boxSizing:"border-box",outline:"none"}}
                      />
                    </div>
                  </div>
                </div>

                {/* Personas */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>👥 Cantidad de personas</div>
                  <div style={{display:"flex",alignItems:"center",gap:16,background:"#fafafa",borderRadius:12,border:"1.5px solid #e0e0e0",padding:"8px 14px"}}>
                    <button onClick={()=>setPersonas(p=>Math.max(1,p-1))} style={{width:36,height:36,borderRadius:"50%",border:"none",background:"#e8f5e9",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#2E7D32",fontWeight:700}}>−</button>
                    <div style={{flex:1,textAlign:"center",fontSize:22,fontWeight:800,color:"#1a1a2e"}}>{personas}</div>
                    <button onClick={()=>setPersonas(p=>Math.min(5,p+1))} style={{width:36,height:36,borderRadius:"50%",border:"none",background:"#e8f5e9",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#2E7D32",fontWeight:700}}>+</button>
                  </div>
                  <div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:4}}>Máximo 5 personas</div>
                </div>

                {/* Preview del mensaje */}
                {(desde || hasta || personas) && (
                  <div style={{background:"#f0fdf4",borderRadius:12,padding:"12px 14px",marginBottom:14,border:"1px solid #bbf7d0"}}>
                    <div style={{fontSize:10,color:"#16a34a",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Mensaje a enviar</div>
                    <div style={{fontSize:12,color:"#333",lineHeight:1.7,fontFamily:"'DM Sans',sans-serif",whiteSpace:"pre-line"}}>
                      {`Hola! Me interesa reservar Casa 1.\n📅 Fecha: ${desde ? desde.split("-").reverse().join("/") : "—"} al ${hasta ? hasta.split("-").reverse().join("/") : "—"}\n👥 Personas: ${personas}\n\n¿Está disponible?`}
                    </div>
                  </div>
                )}

                <button onClick={enviarWA} disabled={!desde||!hasta}
                  style={{width:"100%",background:desde&&hasta?"linear-gradient(135deg,#25D366,#128C7E)":"#ccc",border:"none",borderRadius:14,padding:"15px",fontSize:14,fontWeight:800,color:"#fff",cursor:desde&&hasta?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <span style={{fontSize:18}}>💬</span>
                  Enviar por WhatsApp
                </button>
                {(!desde||!hasta) && <div style={{textAlign:"center",fontSize:11,color:"#aaa",marginTop:6}}>Elegí las fechas para continuar</div>}
              </div>
            )}
          </div>
        )}
        {item.info && item.info.length > 0 && (
          <>
            <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"18px 0 10px",fontFamily:"'DM Sans',sans-serif"}}>DETALLES</div>
            <div style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #f0ede6"}}>
              {item.info.map((inf,i)=>(
                <div key={i} style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:i<item.info.length-1?"1px solid #f8f6f2":"none"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:color,flexShrink:0}}/>
                  <span style={{fontSize:14,color:"#333",fontFamily:"'DM Sans',sans-serif",fontWeight:400}}>{inf}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function InfoRow({icon, label, value, color, onClick}) {
  return (
    <div onClick={onClick} style={{display:"flex",alignItems:"flex-start",gap:12,background:"#fff",borderRadius:14,padding:"11px 14px",marginBottom:8,border:"1px solid #f0ede6",cursor:onClick?"pointer":"default"}}>
      <div style={{width:36,height:36,borderRadius:10,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
      <div>
        <div style={{fontSize:10,color:"#bbb",letterSpacing:1,textTransform:"uppercase",marginBottom:2,fontFamily:"'DM Sans',sans-serif"}}>{label}</div>
        <div style={{fontSize:13,color:onClick?"#1565C0":"#222",fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{value}</div>
      </div>
    </div>
  );
}
