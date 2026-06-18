export default function BottomNav({tab, go}) {
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:300,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(240,237,230,0.9)",display:"flex",padding:"8px 8px 14px",boxShadow:"0 -4px 24px rgba(0,0,0,0.07)"}}>
      {[
        {id:"inicio",     emoji:"🏠",  label:"Inicio"},
        {id:"playas",     emoji:"🏖️",  label:"Playas"},
        {id:"gastronomia",emoji:"🍽️",  label:"Comer"},
        {id:"eventos",    emoji:"🎭",  label:"Agenda",  color:"#00897B"},
        {id:"mapa",       emoji:"📍",  label:"Mapa"},
      ].map(item=>(
        <button key={item.id} onClick={()=>go(item.id)}
          style={{flex:1,background:tab===item.id?`${(item.color||"#1E88E5")}12`:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 4px",borderRadius:14,fontFamily:"inherit",position:"relative"}}>
          <span style={{fontSize:20,lineHeight:1}}>{item.emoji}</span>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:0.4,textTransform:"uppercase",color:tab===item.id?(item.color||"#1E88E5"):"#bbb"}}>{item.label}</span>
          {tab===item.id && <div style={{position:"absolute",bottom:0,width:20,height:3,borderRadius:"3px 3px 0 0",background:item.color||"#1E88E5"}}/>}
        </button>
      ))}
    </div>
  );
}
