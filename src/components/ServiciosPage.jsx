import { useState } from "react";
import { SERVICIOS } from "../data/lugares.js";
import { isAbierto, WA_MSG } from "../lib/helpers.js";
import { InfoRow } from "./DetailPage.jsx";



// ─── SERVICIOS PAGE ──────────────────────────────────────────────────────────
export default function ServiciosPage({ go }) {
  const [selServicio, setSelServicio] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);
  const [filtro, setFiltro] = useState("Todo"); // "Todo" o el nombre de un grupo
  const toggleGroup = (key) => setOpenGroup(prev => prev===key ? null : key);

  const GRUPOS = [
    { key:"Auto y ruta",    emoji:"🚗", color:"#1565C0", cats:["Mecánica","Combustible","Lavadero"] },
    { key:"Salud",          emoji:"💊", color:"#2E7D32", cats:["Salud","Farmacias"] },
    { key:"Transporte",     emoji:"🚌", color:"#0097A7", cats:["Transporte"] },
    { key:"Info turística", emoji:"ℹ️",  color:"#7B1FA2", cats:["Información"] },
    { key:"Compras",        emoji:"🛒", color:"#E65100", cats:["Comercio"] },
    { key:"Bienestar",      emoji:"💆", color:"#00695C", cats:["Bienestar"] },
    { key:"Banco / Cajero", emoji:"💳", color:"#1E88E5", cats:["Banco"] },
  ];

  const noUrgente = SERVICIOS.filter(s=>!s.urgente);

  const btnBase = {borderRadius:9,padding:"5px 9px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap",border:"1.5px solid"};

  const ServiceCard = ({s}) => {
    const hasPhone = s.tel && /\(0/.test(s.tel);
    const hasCell  = !!s.celular;
    const hasLink  = !!s.link;
    const noContacto = !hasPhone && !hasCell && !hasLink;
    return (
      <div style={{background:"#fff",borderRadius:16,marginBottom:8,border:"1px solid #f0ede6",padding:"12px 14px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
        <div onClick={()=>setSelServicio(s)} style={{width:44,height:44,borderRadius:12,background:s.foto?`url(${s.foto}) center/cover`:`${s.color||"#1E88E5"}18`,border:`1.5px solid ${s.color||"#1E88E5"}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,cursor:"pointer",overflow:"hidden"}}>
          {s.foto ? null : s.emoji}
        </div>
        <div style={{flex:1,minWidth:0}} onClick={()=>setSelServicio(s)}>
          <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",lineHeight:1.2,cursor:"pointer"}}>{s.nombre}</div>
          <div style={{fontSize:11,color:"#888",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.info}</div>
          {s.horario && <div style={{fontSize:10,color:"#aaa",marginTop:1}}>🕐 {s.horario}</div>}
        </div>
        {!noContacto && (
          <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
            {hasPhone && (
              <button onClick={()=>{const n=s.tel.replace(/[^\d]/g,'');window.open(`tel:+54${n.startsWith('0')?n.slice(1):n}`,'_self');}}
                style={{...btnBase,background:"#e8f5e9",color:"#2E7D32",borderColor:"#a5d6a7"}}>
                📞 Llamar
              </button>
            )}
            {hasCell && (
              <button onClick={()=>window.open(`https://wa.me/549${s.celular}?text=${WA_MSG}`,'_blank')}
                style={{...btnBase,background:"#e8f5e9",color:"#1B5E20",borderColor:"#81c784"}}>
                💬 WA
              </button>
            )}
            {hasLink && (
              <button onClick={()=>window.open(s.link,'_blank')}
                style={{...btnBase,background:"#e3f2fd",color:"#1565C0",borderColor:"#90caf9"}}>
                🔗 {s.linkLabel||"Ver"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:"#f4f6fb",paddingBottom:90}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1565C0,#0097A7)",padding:"0 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-30,left:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
        <div style={{padding:"48px 0 14px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>go("inicio")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
          <div>
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.1,margin:0}}>Servicios Útiles</h1>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2}}>Todo lo que podés necesitar en Colón</div>
          </div>
          <div style={{marginLeft:"auto",fontSize:26}}>🗂️</div>
        </div>
      </div>

      <div style={{padding:"16px 16px 0"}}>
        {/* Emergencias */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:"#e53935",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🚨</div>
            <span style={{fontSize:13,fontWeight:800,color:"#1a1a2e",letterSpacing:-0.2}}>Líneas de Emergencia</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {emoji:"🚔",label:"Policía",      tel:"911", color:"#1565C0"},
              {emoji:"🚒",label:"Bomberos",     tel:"100", color:"#e53935"},
              {emoji:"🚑",label:"Hospital",     tel:"107", color:"#C62828"},
              {emoji:"⚡",label:"Defensa Civil",tel:"103", color:"#F9A825"},
            ].map((e,i)=>(
              <div key={i} onClick={()=>window.open(`tel:${e.tel}`,'_self')} style={{background:`linear-gradient(135deg,${e.color},${e.color}cc)`,borderRadius:14,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,boxShadow:`0 4px 14px ${e.color}35`,cursor:"pointer"}}>
                <span style={{fontSize:24}}>{e.emoji}</span>
                <div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",letterSpacing:1,marginBottom:1}}>{e.label}</div>
                  <div style={{fontSize:26,fontWeight:800,color:"#fff",lineHeight:1}}>{e.tel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtro por etiqueta */}
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:12,marginBottom:4,scrollbarWidth:"none"}}>
          {[{key:"Todo",emoji:"🗂️",color:"#1565C0"}, ...GRUPOS.filter(g=>noUrgente.some(s=>g.cats.includes(s.cat)))].map(f=>{
            const act = filtro===f.key;
            return (
              <button key={f.key} onClick={()=>{setFiltro(f.key);setOpenGroup(null);}}
                style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:20,border:act?`1.5px solid ${f.color}`:"1.5px solid #e8e8e8",background:act?f.color:"#fff",color:act?"#fff":"#555",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",boxShadow:act?`0 4px 12px ${f.color}40`:"none"}}>
                <span>{f.emoji}</span>{f.key}
              </button>
            );
          })}
        </div>

        {/* Grupos de servicios — colapsables */}
        {GRUPOS.map(grupo=>{
          const items = noUrgente.filter(s=>grupo.cats.includes(s.cat));
          if(!items.length) return null;
          if(filtro!=="Todo" && filtro!==grupo.key) return null;
          const isOpen = filtro===grupo.key || openGroup === grupo.key;
          return (
            <div key={grupo.key} style={{marginBottom:10}}>
              {/* Header del grupo — tap para abrir/cerrar */}
              <button onClick={()=>toggleGroup(grupo.key)} style={{width:"100%",background:"#fff",border:"1px solid #e8e8e8",borderRadius:isOpen?"16px 16px 0 0":16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",boxSizing:"border-box"}}>
                <div style={{width:38,height:38,borderRadius:10,background:`linear-gradient(135deg,${grupo.color},${grupo.color}cc)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                  {grupo.emoji}
                </div>
                <div style={{flex:1,textAlign:"left"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e"}}>{grupo.key}</div>
                  <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{items.length} {items.length===1?"servicio":"servicios"}</div>
                </div>
                <div style={{fontSize:18,color:grupo.color,fontWeight:700,transition:"transform .2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>›</div>
              </button>

              {/* Contenido desplegable */}
              {isOpen && (
                <div style={{background:"#fff",borderRadius:"0 0 16px 16px",border:"1px solid #e8e8e8",borderTop:"none",overflow:"hidden",boxShadow:"0 4px 12px rgba(0,0,0,0.06)"}}>
                  {items.map((s,i)=>{
                    const hasPhone = s.tel && /\(0/.test(s.tel);
                    const hasCell  = !!s.celular;
                    const hasLink  = !!s.link;
                    return (
                      <div key={i} style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12,borderTop:"1px solid #f5f5f5"}}>
                        <div onClick={()=>setSelServicio(s)} style={{width:40,height:40,borderRadius:11,background:s.foto?`url(${s.foto}) center/cover`:`${grupo.color}18`,border:`1.5px solid ${grupo.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,cursor:"pointer",overflow:"hidden"}}>
                          {s.foto ? null : s.emoji}
                        </div>
                        <div style={{flex:1,minWidth:0}} onClick={()=>setSelServicio(s)}>
                          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                            <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",lineHeight:1.2,cursor:"pointer"}}>{s.nombre}</div>
                            {(()=>{const es=isAbierto(s.horario);return es?(<span style={{fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:10,background:es.abierto?"#e8f5e9":"#ffebee",color:es.abierto?"#2E7D32":"#c62828",whiteSpace:"nowrap"}}>{es.abierto?"● Abierto":"● Cerrado"}</span>):null;})()}
                          </div>
                          <div style={{fontSize:11,color:"#888",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.info}</div>
                          {s.horario && <div style={{fontSize:10,color:"#bbb",marginTop:1}}>🕐 {s.horario}</div>}
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                          {hasPhone && (
                            <button onClick={()=>{const n=s.tel.replace(/[^\d]/g,'');window.open(`tel:+54${n.startsWith('0')?n.slice(1):n}`,'_self');}}
                              style={{...btnBase,background:"#e8f5e9",color:"#2E7D32",borderColor:"#a5d6a7"}}>📞 Llamar</button>
                          )}
                          {hasCell && (
                            <button onClick={()=>window.open(`https://wa.me/549${s.celular}?text=${WA_MSG}`,'_blank')}
                              style={{...btnBase,background:"#e8f5e9",color:"#1B5E20",borderColor:"#81c784"}}>💬 WA</button>
                          )}
                          {hasLink && (
                            <button onClick={()=>window.open(s.link,'_blank')}
                              style={{...btnBase,background:"#e3f2fd",color:"#1565C0",borderColor:"#90caf9"}}>🔗 {s.linkLabel||"Ver"}</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom sheet detalle servicio */}
      {selServicio && (
        <div onClick={()=>setSelServicio(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#faf9f6",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(0,0,0,0.2)"}}>
            <div style={{background:`linear-gradient(135deg,${selServicio.color||"#1565C0"},${selServicio.color||"#1565C0"}cc)`,borderRadius:"24px 24px 0 0",padding:"20px 20px 22px",position:"relative"}}>
              <button onClick={()=>setSelServicio(null)} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.25)",border:"none",color:"#fff",width:32,height:32,borderRadius:"50%",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>✕</button>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:60,height:60,borderRadius:16,background:selServicio.foto?"none":"rgba(255,255,255,0.25)",border:"2px solid rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0,overflow:"hidden"}}>
                  {selServicio.foto ? <img src={selServicio.foto} alt={selServicio.nombre} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : selServicio.emoji}
                </div>
                <div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.7)",letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>{selServicio.cat}</div>
                  <div style={{fontSize:17,fontWeight:800,color:"#fff",lineHeight:1.2,marginTop:3}}>{selServicio.nombre}</div>
                </div>
              </div>
            </div>
            <div style={{padding:"18px 18px 32px"}}>
              {selServicio.fotos && selServicio.fotos.length > 0 && (
                <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:16,paddingBottom:4}}>
                  {selServicio.fotos.map((f,i)=>(
                    <img key={i} src={f} alt="" style={{height:110,borderRadius:12,objectFit:"cover",flexShrink:0,width:150}}/>
                  ))}
                </div>
              )}
              {selServicio.desc && selServicio.desc.split('\n\n').map((par,i)=>(
                <p key={i} style={{fontSize:14,color:"#444",lineHeight:1.75,margin:"0 0 12px"}}>{par}</p>
              ))}
              {selServicio.horario && <InfoRow icon="🕐" label="Horario" value={selServicio.horario} color={selServicio.color||"#1565C0"}/>}
              {selServicio.info && <InfoRow icon="📍" label="Dirección" value={selServicio.info} color={selServicio.color||"#1565C0"}/>}
              {selServicio.tel && <InfoRow icon="📞" label="Teléfono" value={selServicio.tel} color={selServicio.color||"#1565C0"} onClick={()=>{const n=selServicio.tel.replace(/[^\d]/g,'');window.open(`tel:+54${n.startsWith('0')?n.slice(1):n}`,'_self');}}/>}
              {selServicio.celular && <InfoRow icon="💬" label="WhatsApp" value={selServicio.celular} color={selServicio.color||"#1565C0"} onClick={()=>window.open(`https://wa.me/549${selServicio.celular}?text=${WA_MSG}`,'_blank')}/>}
              {selServicio.link && (
                <button onClick={()=>window.open(selServicio.link,'_blank')} style={{width:"100%",marginTop:8,padding:"13px",borderRadius:14,background:selServicio.color||"#1565C0",color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  🔗 {selServicio.linkLabel||"Ver más"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
