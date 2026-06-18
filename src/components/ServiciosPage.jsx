import { useState } from "react";
import { useServicios } from "../hooks/useServicios.js";

export default function ServiciosPage({ go }) {
  const [filtro, setFiltro] = useState("Todo");
  const { data: todos } = useServicios();

  const urgentes = todos.filter(s => s.urgente);
  const lista = filtro === "Todo"
    ? todos.filter(s => !s.urgente)
    : todos.filter(s => s.cat === filtro && !s.urgente);

  return (
    <div style={{minHeight:"100vh",background:"#faf9f6",paddingBottom:90}}>
      <div style={{background:"linear-gradient(135deg,#e53935,#C62828)",padding:"0 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{padding:"48px 0 14px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>go("inicio")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
          <div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.1,margin:0}}>Servicios Útiles</h1>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2}}>Todo lo que podés necesitar en Colón</div>
          </div>
          <div style={{marginLeft:"auto",fontSize:26}}>🚨</div>
        </div>
        <div style={{display:"flex",gap:7,paddingBottom:14,overflowX:"auto"}}>
          {["Todo","Salud","Información","Combustible","Transporte","Mecánica","Lavadero","Comercio"].map(c=>(
            <button key={c} onClick={()=>setFiltro(c)} style={{flexShrink:0,padding:"5px 13px",fontSize:11,fontWeight:600,borderRadius:20,cursor:"pointer",fontFamily:"inherit",background:filtro===c?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.15)",color:filtro===c?"#e53935":"rgba(255,255,255,0.9)",border:"1.5px solid rgba(255,255,255,0.3)"}}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{height:14,background:"#faf9f6"}}/>
      <div style={{margin:"0 16px"}}>
        {filtro === "Todo" && urgentes.length > 0 && (
          <>
            <div style={{fontSize:9,color:"#e53935",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Sans',sans-serif"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#e53935",animation:"blink 1.5s infinite"}}/>
              LÍNEAS DE EMERGENCIA
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
              {[
                {emoji:"🚔",label:"Policía",      tel:"911", color:"#1565C0"},
                {emoji:"🚒",label:"Bomberos",     tel:"100", color:"#e53935"},
                {emoji:"🚑",label:"Hospital",     tel:"107", color:"#C62828"},
                {emoji:"⚡",label:"Defensa Civil",tel:"103", color:"#F9A825"},
              ].map((e,i)=>(
                <div key={i} style={{background:`linear-gradient(135deg,${e.color},${e.color}cc)`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:`0 4px 16px ${e.color}35`,cursor:"pointer"}}>
                  <span style={{fontSize:26}}>{e.emoji}</span>
                  <div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:1}}>{e.label}</div>
                    <div style={{fontSize:28,fontWeight:800,color:"#fff",fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{e.tel}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{fontSize:9,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>OTROS SERVICIOS</div>
          </>
        )}
        {lista.map((s,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:16,marginBottom:10,border:"1px solid #f0ede6",padding:"13px 15px",display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 10px rgba(0,0,0,0.04)"}}>
            <div style={{width:46,height:46,borderRadius:13,background:`${s.color||"#1E88E5"}15`,border:`1.5px solid ${s.color||"#1E88E5"}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.emoji}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:9,color:s.color||"#1E88E5",fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2,fontFamily:"'DM Sans',sans-serif"}}>{s.cat}</div>
              <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.2}}>{s.nombre}</div>
              <div style={{fontSize:11,color:"#888",marginTop:3,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.info}</div>
              <div style={{fontSize:10,color:"#aaa",marginTop:1,fontFamily:"'DM Sans',sans-serif"}}>{s.horario}</div>
            </div>
            <div style={{background:`${s.color||"#1E88E5"}15`,color:s.color||"#1E88E5",borderRadius:10,padding:"6px 10px",fontSize:11,fontWeight:700,flexShrink:0,textAlign:"center",minWidth:64,fontFamily:"'DM Sans',sans-serif",lineHeight:1.2}}>{s.tel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
