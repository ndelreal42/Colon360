function InfoRow({icon, label, value, color}) {
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:12,background:"#fff",borderRadius:14,padding:"11px 14px",marginBottom:8,border:"1px solid #f0ede6"}}>
      <div style={{width:36,height:36,borderRadius:10,background:`${color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
      <div>
        <div style={{fontSize:10,color:"#bbb",letterSpacing:1,textTransform:"uppercase",marginBottom:2,fontFamily:"'DM Sans',sans-serif"}}>{label}</div>
        <div style={{fontSize:13,color:"#222",fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{value}</div>
      </div>
    </div>
  );
}

export default function DetailPage({ item, onBack }) {
  const color = item.color || "#1E88E5";
  return (
    <div style={{background:"#faf9f6", minHeight:"100vh", paddingBottom:90}}>
      <div style={{background:`linear-gradient(150deg, ${color} 0%, ${color}dd 100%)`, padding:"0 16px", position:"relative", overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
        <div style={{padding:"48px 0 16px", position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:14}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
          <div style={{flex:1, minWidth:0}}>
            {item.tipo && <div style={{fontSize:10,color:"rgba(255,255,255,0.65)",letterSpacing:2,textTransform:"uppercase",marginBottom:3,fontFamily:"'DM Sans',sans-serif"}}>{item.tipo}</div>}
            <h1 style={{fontFamily:"'Cormorant Garamond','Georgia',serif",fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.15,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.nombre || item.titulo}</h1>
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
        {item.horario && <InfoRow icon="🕐" label="Horario" value={item.horario} color={color}/>}
        {item.dir     && <InfoRow icon="📍" label="Dirección" value={item.dir} color={color}/>}
        {item.lugar   && <InfoRow icon="📍" label="Lugar" value={item.lugar} color={color}/>}
        {item.tel     && <InfoRow icon="📞" label="Contacto" value={item.tel} color={color}/>}
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
