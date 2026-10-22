import CalendarioRango from "./CalendarioRango.jsx";
import { useState, Fragment } from "react";
import { abrirContacto } from "../lib/helpers.js";


// ─── DETAIL PAGE ─────────────────────────────────────────────────────────────
export default function DetailPage({ item, onBack, paradores = [] }) {
  const color = item.color || "#1E88E5";
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [personas, setPersonas] = useState(2);

  // Sólo los alojamientos que tienen WhatsApp cargado muestran el formulario de consulta.
  // Dentro de una playa: sus carritos/paradores y sus campings (se vinculan con la playa por el ID en "Categoría").
  const secciones = item.tipo === "playa"
    ? [{tipo:"parador", titulo:"CARRITOS Y PARADORES"}, {tipo:"camping", titulo:"CAMPINGS"}]
        .map(sec=>({...sec, lista: paradores.filter(p=>p.tipo===sec.tipo && p.categoria===item.id)}))
        .filter(sec=>sec.lista.length>0)
    : [];
  const waNumero = normalizarWhatsApp(item.whatsapp);
  const cartaUrl = urlSegura(item.carta);
  const esParaComer = item.tipo === "restaurante" || item.tipo === "cafe";
  const esAlojamiento = item.tipo === "hotel";
  const hoy = new Date();
  const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,"0")}-${String(hoy.getDate()).padStart(2,"0")}`;
  const fechasOk = desde && hasta && hasta > desde;
  const mensaje = armarMensaje({nombre:item.nombre||item.titulo, desde, hasta, personas});
  const enviarWA = () => {
    if (!waNumero || !fechasOk) return;
    window.open(`https://wa.me/${waNumero}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };
  return (
    <div style={{background:"#faf9f6", minHeight:"100vh", paddingBottom:90}}>
      <div style={{background:`linear-gradient(150deg, ${color} 0%, ${color}dd 100%)`, padding:"0 16px", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{padding:"48px 0 16px", position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:14}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
          <div style={{flex:1, minWidth:0}}>
            {(item.tipo==="hotel" ? (item.categoria||item.tipo) : item.tipo) && <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",letterSpacing:2,textTransform:"uppercase",marginBottom:3,fontFamily:"'DM Sans',sans-serif"}}>{item.tipo==="hotel" ? (item.categoria||item.tipo) : item.tipo}</div>}
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.15,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.nombre || item.titulo}</h1>
          </div>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{item.emoji}</div>
        </div>
      </div>

      <div style={{height:16,background:"#faf9f6"}}/>

      <div style={{margin:"0 16px",background:"#fff",borderRadius:22,boxShadow:"0 8px 32px rgba(0,0,0,0.09)",padding:"26px 22px",marginBottom:14}}>
        {item.rating && item.tipo!=="hotel" && (
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
        {item.promo && (
          <div style={{background:"linear-gradient(135deg,#FFF3E0,#FFE0B2)",border:"1px solid #FFB74D",borderRadius:14,padding:"11px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>🔥</span>
            <div>
              <div style={{fontSize:9,fontWeight:800,color:"#E65100",letterSpacing:1.2}}>PROMO</div>
              <div style={{fontSize:15,fontWeight:800,color:"#BF360C",fontFamily:"'DM Sans',sans-serif"}}>{item.promo}</div>
            </div>
          </div>
        )}
        {item.horario && item.horario !== '—' && <InfoRow icon="🕐" label="Horario" value={item.horario} color={color}/>}
        {item.dir && <InfoRow icon="📍" label="Dirección" value={item.dir} color={color}/>}
        {item.lugar && <InfoRow icon="📍" label="Lugar" value={item.lugar} color={color}/>}
        {item.tel && item.tel !== '—' && <InfoRow icon="📞" label="Contacto" value={item.tel} color={color} onClick={()=>abrirContacto(item.tel)}/>}
        {(item.tipo==="parador"||item.tipo==="camping") && !waNumero && (
          <button disabled style={{width:"100%",background:"#e0e0e0",border:"none",borderRadius:14,padding:"13px",fontSize:13,fontWeight:800,color:"#fff",cursor:"not-allowed",fontFamily:"inherit",marginBottom:8}}>💬 WhatsApp próximamente</button>
        )}
        {(item.tipo==="parador"||item.tipo==="camping") && waNumero && (
          <button onClick={()=>window.open(`https://wa.me/${waNumero}?text=${encodeURIComponent(`Hola, ${saludoSegunHora()}! Vi tu ${item.tipo} "${item.nombre}" en la app Colón 360 y quería consultarte. ¡Gracias!`)}`,"_blank")} style={{width:"100%",background:"linear-gradient(135deg,#25D366,#128C7E)",border:"none",borderRadius:14,padding:"13px",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>💬 Consultar por WhatsApp</button>
        )}
        {item.wa && <InfoRow icon="💬" label="WhatsApp" value="Consultar por WhatsApp" color="#25D366" onClick={()=>window.open(item.wa,'_blank')}/>}

        {(cartaUrl || esParaComer) && (
          <>
            <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"18px 0 10px",fontFamily:"'DM Sans',sans-serif"}}>CARTA</div>
            {cartaUrl ? (
              <button onClick={()=>window.open(cartaUrl,"_blank","noopener,noreferrer")}
                style={{width:"100%",display:"flex",alignItems:"center",gap:12,background:"#fff",border:`1.5px solid ${color}40`,borderRadius:16,padding:"14px 16px",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
                <div style={{width:42,height:42,borderRadius:12,background:`${color}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📖</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#1a1a2e",fontFamily:"'DM Sans',sans-serif"}}>Ver la carta</div>
                  <div style={{fontSize:11,color:"#aaa",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Mirá el menú de {item.nombre||"este lugar"}</div>
                </div>
                <span style={{fontSize:18,color,fontWeight:700}}>↗</span>
              </button>
            ) : (
              <div style={{display:"flex",alignItems:"center",gap:12,background:"#fafafa",border:"1.5px dashed #ddd",borderRadius:16,padding:"14px 16px"}}>
                <div style={{width:42,height:42,borderRadius:12,background:"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,filter:"grayscale(1)",opacity:0.6}}>📖</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#999",fontFamily:"'DM Sans',sans-serif"}}>Carta próximamente</div>
                  <div style={{fontSize:11,color:"#bbb",marginTop:2}}>Este lugar todavía no cargó su menú</div>
                </div>
              </div>
            )}
          </>
        )}

        {secciones.map(sec=>(
          <Fragment key={sec.tipo}>
            <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"18px 0 10px",fontFamily:"'DM Sans',sans-serif"}}>{sec.titulo}</div>
            {sec.lista.map(par=>{
              const wa = normalizarWhatsApp(par.whatsapp);
              const msgPar = `Hola, ${saludoSegunHora()}! Vi tu ${sec.tipo==="camping"?"camping":"parador"} "${par.nombre}" en la app Colón 360 y quería consultarte. ¡Gracias!`;
              return (
                <div key={par.id} style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:10,border:"1px solid #f0ede6",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <div style={{width:40,height:40,borderRadius:12,background:`${color}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{par.emoji||(sec.tipo==="camping"?"⛺":"🍹")}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:800,color:"#1a1a2e"}}>{par.nombre}</div>
                      {par.horario && par.horario!=="—" && <div style={{fontSize:11,color:"#aaa",marginTop:1}}>🕐 {par.horario}</div>}
                    </div>
                  </div>
                  {par.promo && (
                    <div style={{background:"linear-gradient(135deg,#FFF3E0,#FFE0B2)",border:"1px solid #FFB74D",borderRadius:12,padding:"9px 12px",margin:"8px 0",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:18}}>🔥</span>
                      <div>
                        <div style={{fontSize:9,fontWeight:800,color:"#E65100",letterSpacing:1.2}}>PROMO</div>
                        <div style={{fontSize:14,fontWeight:800,color:"#BF360C",fontFamily:"'DM Sans',sans-serif"}}>{par.promo}</div>
                      </div>
                    </div>
                  )}
                  {par.desc && <div style={{fontSize:13,color:"#555",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif",margin:"6px 0 8px"}}>{par.desc}</div>}
                  {par.tags && par.tags.length>0 && (
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                      {par.tags.map(t=><span key={t} style={{fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:20,background:`${color}12`,color,border:`1px solid ${color}25`}}>{t}</span>)}
                    </div>
                  )}
                  <div style={{display:"flex",gap:8}}>
                    {wa
                      ? <button onClick={()=>window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msgPar)}`,"_blank")} style={{flex:1,background:"linear-gradient(135deg,#25D366,#128C7E)",border:"none",borderRadius:12,padding:"11px",fontSize:12,fontWeight:800,color:"#fff",cursor:"pointer",fontFamily:"inherit"}}>💬 WhatsApp</button>
                      : <button disabled style={{flex:1,background:"#e0e0e0",border:"none",borderRadius:12,padding:"11px",fontSize:12,fontWeight:800,color:"#fff",cursor:"not-allowed",fontFamily:"inherit"}}>💬 WhatsApp próximamente</button>}
                    {par.tel && par.tel!=="—" && <button onClick={()=>abrirContacto(par.tel)} style={{flex:1,background:"#f5f5f5",border:"none",borderRadius:12,padding:"11px",fontSize:12,fontWeight:700,color:"#333",cursor:"pointer",fontFamily:"inherit"}}>📞 Llamar</button>}
                  </div>
                </div>
              );
            })}
          </Fragment>
        ))}

        {esAlojamiento && (
          <>
            <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",margin:"18px 0 10px",fontFamily:"'DM Sans',sans-serif"}}>CONSULTAR DISPONIBILIDAD</div>
            <div style={{background:"#fff",borderRadius:16,padding:"18px 16px",border:"1px solid #e8f5e9",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",marginBottom:14}}>Completá los datos y te armamos el mensaje</div>

              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>📅 Fechas</div>
                <CalendarioRango desde={desde} hasta={hasta} minISO={hoyISO} onChange={(d,h)=>{setDesde(d);setHasta(h);}} />
              </div>

              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:"#888",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>👥 Cantidad de personas</div>
                <div style={{display:"flex",alignItems:"center",gap:16,background:"#fafafa",borderRadius:12,border:"1.5px solid #e0e0e0",padding:"8px 14px"}}>
                  <button onClick={()=>setPersonas(p=>Math.max(1,p-1))} style={{width:36,height:36,borderRadius:"50%",border:"none",background:"#e8f5e9",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#2E7D32",fontWeight:700}}>−</button>
                  <div style={{flex:1,textAlign:"center",fontSize:22,fontWeight:800,color:"#1a1a2e"}}>{personas}</div>
                  <button onClick={()=>setPersonas(p=>Math.min(20,p+1))} style={{width:36,height:36,borderRadius:"50%",border:"none",background:"#e8f5e9",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#2E7D32",fontWeight:700}}>+</button>
                </div>
              </div>

              <div style={{background:"#f0fdf4",borderRadius:12,padding:"12px 14px",marginBottom:14,border:"1px solid #bbf7d0"}}>
                <div style={{fontSize:10,color:"#16a34a",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Mensaje que se va a enviar</div>
                <div style={{fontSize:12,color:"#333",lineHeight:1.7,fontFamily:"'DM Sans',sans-serif",whiteSpace:"pre-line"}}>{mensaje}</div>
              </div>

              <button onClick={enviarWA} disabled={!fechasOk || !waNumero}
                style={{width:"100%",background:(fechasOk&&waNumero)?"linear-gradient(135deg,#25D366,#128C7E)":"#ccc",border:"none",borderRadius:14,padding:"15px",fontSize:14,fontWeight:800,color:"#fff",cursor:(fechasOk&&waNumero)?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{fontSize:18}}>💬</span>
                {waNumero ? "Enviar por WhatsApp" : "WhatsApp próximamente"}
              </button>
              {!waNumero && <div style={{textAlign:"center",fontSize:11,color:"#aaa",marginTop:6}}>Este alojamiento todavía no cargó su WhatsApp{item.tel && item.tel!=="—" ? ". Mientras tanto podés llamarlo." : "."}</div>}
              {waNumero && !fechasOk && <div style={{textAlign:"center",fontSize:11,color:"#aaa",marginTop:6}}>Elegí la llegada y una salida posterior para continuar</div>}
            </div>
          </>
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


// Saludo según la hora del celular de quien consulta.
function saludoSegunHora(fecha = new Date()) {
  const h = fecha.getHours();
  if (h >= 6 && h < 13) return "buen día";
  if (h >= 13 && h < 20) return "buenas tardes";
  return "buenas noches";
}

const fmtFecha = (iso) => (iso ? iso.split("-").reverse().join("/") : "__/__/____");

function armarMensaje({ nombre, desde, hasta, personas }) {
  const noches = desde && hasta && hasta > desde
    ? Math.round((new Date(hasta) - new Date(desde)) / 86400000)
    : null;
  const nochesTxt = noches ? ` (${noches} ${noches === 1 ? "noche" : "noches"})` : "";
  return [
    `Hola, ${saludoSegunHora()}! 👋`,
    `Vi tu alojamiento "${nombre}" en la app Colón 360 y quería consultar si tenés disponibilidad:`,
    ``,
    `📅 Llegada: ${fmtFecha(desde)}`,
    `📅 Salida: ${fmtFecha(hasta)}${nochesTxt}`,
    `👥 Personas: ${personas}`,
    ``,
    `¡Gracias! 🙌`,
  ].join("\n");
}

// Deja el número listo para wa.me (formato internacional de Argentina para celulares: 549 + característica + número).
// Acepta cosas como "5493447123456", "+54 9 3447 12-3456", "03447 15 123456" o "3447123456".
export function normalizarWhatsApp(valor) {
  let d = String(valor || "").replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("549")) { /* ya está completo */ }
  else if (d.startsWith("54")) d = "549" + d.slice(2);
  else {
    d = d.replace(/^0/, "");
    d = d.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2"); // saca el "15" de los celulares
    d = "549" + d;
  }
  return d.length >= 12 && d.length <= 14 ? d : null;
}


// Acepta "https://...", "www.sitio.com/carta" o "sitio.com/carta". Sólo deja pasar http/https (nada de javascript: u otros).
export function urlSegura(valor) {
  const t = String(valor || "").trim();
  if (!t) return null;
  const conEsquema = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : "https://" + t;
  try {
    const u = new URL(conEsquema);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch { return null; }
}
