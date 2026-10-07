import { useState, useEffect } from "react";
import { JUEGOS_DB } from "../data/juegos.js";


export default function JuegosPage({go, juegoCategoria, setJuegoCategoria}) {
  const [juegoActivo, setJuegoActivo] = useState(null);
  const [juegoIdx, setJuegoIdx] = useState(null);
  const [pregIdx, setPregIdx] = useState(0);
  const [dilemaIdx, setDilemaIdx] = useState(0);
  const [reveladas, setReveladas] = useState({});

  const CATS = [
    {id:"solo",   label:"Solo",     emoji:"🧠", grad:"linear-gradient(135deg,#1E88E5,#42A5F5)"},
    {id:"pareja", label:"Pareja",   emoji:"💑", grad:"linear-gradient(135deg,#e91e63,#f06292)"},
    {id:"amigos", label:"Amigos",   emoji:"🥂", grad:"linear-gradient(135deg,#F9A825,#FF6F00)"},
    {id:"familia",label:"Familia",  emoji:"🏠", grad:"linear-gradient(135deg,#2E7D32,#43A047)"},
  ];

  const catActiva = juegoCategoria || null;
  const juegosCat = catActiva ? JUEGOS_DB[catActiva] : [];

  // random 3 on category change
  const [tresJuegos, setTresJuegos] = useState([]);
  const elegirTres = (catId) => {
    const pool = [...JUEGOS_DB[catId]];
    const sel = [];
    while(sel.length < 3 && pool.length > 0){
      const i = Math.floor(Math.random()*pool.length);
      sel.push({...pool[i], _idx:i});
      pool.splice(i,1);
    }
    setTresJuegos(sel);
    setJuegoCategoria(catId);
    setJuegoActivo(null);
  };

  // Auto-elegirTres if category is set but no games loaded (e.g. returning from home)
  useEffect(()=>{
    if(catActiva && tresJuegos.length===0) elegirTres(catActiva);
  },[catActiva]);

  // Reset pregIdx, dilemaIdx and reveladas when juegoActivo changes
  useEffect(()=>{ setPregIdx(0); setDilemaIdx(0); setReveladas({}); },[juegoActivo]);

  const grad = "linear-gradient(135deg,#6A1B9A,#AB47BC)";

  return (
    <div style={{minHeight:"100vh",background:"#faf9f6",paddingBottom:100}}>
      <div style={{background:grad,padding:"0 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
        <div style={{padding:"48px 0 20px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>{
            if(juegoActivo){setJuegoActivo(null);}
            else if(catActiva){setJuegoCategoria(null);}
            else{go("inicio");}
          }} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>‹</button>
          <div>
            <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:700,color:"#fff",margin:0}}>
              {juegoActivo ? juegoActivo.nombre : catActiva ? `Juegos · ${CATS.find(c=>c.id===catActiva)?.label}` : "Juegos"}
            </h1>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:2}}>Sin materiales · Solo el celular</div>
          </div>
        </div>
      </div>

      <div style={{height:16}}/>
      <div style={{padding:"0 16px"}}>

        {/* Categorías */}
        {!catActiva && (
          <div>
            <div style={{fontSize:9,color:"#bbb",fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:12}}>ELEGÍ CON QUIÉN ESTÁS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {CATS.map(cat=>(
                <button key={cat.id} onClick={()=>elegirTres(cat.id)} style={{background:cat.grad,border:"none",borderRadius:20,padding:"28px 16px",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:10,boxShadow:"0 8px 24px rgba(0,0,0,0.15)"}}>
                  <span style={{fontSize:36}}>{cat.emoji}</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:700,color:"#fff"}}>{cat.label}</span>
                </button>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:16,padding:"16px",border:"1px solid #f0ede6",fontSize:12,color:"#888",lineHeight:1.7}}>
              <strong style={{color:"#333",display:"block",marginBottom:4}}>Sin nada extra</strong>
              Todos los juegos se juegan solo con el teléfono y las personas que tenés al lado. Sin fichas, sin dados, sin materiales.
            </div>
          </div>
        )}

        {/* Lista de 3 juegos */}
        {catActiva && !juegoActivo && (
          <div>
            <div style={{fontSize:9,color:"#bbb",fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:12}}>3 JUEGOS PARA VOS</div>
            {tresJuegos.map((j,i)=>(
              <div key={i} className="fu" onClick={()=>setJuegoActivo(j)} style={{background:"#fff",borderRadius:18,padding:"18px",marginBottom:10,border:"1px solid #f0ede6",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",cursor:"pointer",display:"flex",gap:14,alignItems:"center",animationDelay:`${i*70}ms`}}>
                <div style={{width:52,height:52,borderRadius:14,background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,opacity:0.9}}>{j.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,fontWeight:700,color:"#1a1a2e",marginBottom:4}}>{j.nombre}</div>
                  <div style={{fontSize:12,color:"#888",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif"}}>{j.desc.substring(0,80)}...</div>
                  <div style={{fontSize:10,color:"#ab47bc",fontWeight:700,marginTop:5}}>⏱ {j.duracion}</div>
                </div>
                <div style={{fontSize:20,color:"#ddd"}}>›</div>
              </div>
            ))}
            <button onClick={()=>elegirTres(catActiva)} style={{width:"100%",padding:"13px",borderRadius:14,border:"1.5px solid #ab47bc",background:"#fff",color:"#6A1B9A",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
              Mostrar otros juegos
            </button>
          </div>
        )}

        {/* Juego activo */}
        {juegoActivo && (
          <div>
            <div style={{background:"linear-gradient(135deg,#F3E5F5,#EDE7F6)",borderRadius:18,padding:"20px",marginBottom:14,border:"1.5px solid #CE93D8"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <span style={{fontSize:32}}>{juegoActivo.emoji}</span>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:21,fontWeight:700,color:"#4A148C"}}>{juegoActivo.nombre}</div>
                  <div style={{fontSize:10,color:"#ab47bc",fontWeight:700}}>⏱ {juegoActivo.duracion}</div>
                </div>
              </div>
              <p style={{fontSize:14,color:"#555",lineHeight:1.75,fontFamily:"'DM Sans',sans-serif",margin:0}}>{juegoActivo.desc}</p>
            </div>

            {/* Instrucciones */}
            {juegoActivo.instrucciones && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>CÓMO JUGAR</div>
                {juegoActivo.instrucciones.map((inst,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#6A1B9A,#AB47BC)",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                    <div style={{fontSize:13,color:"#444",lineHeight:1.5,fontFamily:"'DM Sans',sans-serif",paddingTop:2}}>{inst}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Contenido extra según tipo */}
            {juegoActivo.preguntas && (()=>{
              const preguntas = juegoActivo.preguntas;
              const allStrings = preguntas.every(q=>typeof q==="string");
              if(allStrings) {
                // Show one at a time with manual advance
                const idx = pregIdx % preguntas.length;
                return (
                  <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>PREGUNTAS</div>
                      <div style={{fontSize:10,color:"#bbb"}}>{idx+1} / {preguntas.length}</div>
                    </div>
                    <div style={{fontSize:14,fontWeight:600,color:"#333",fontFamily:"'DM Sans',sans-serif",lineHeight:1.55,marginBottom:14}}>❓ {preguntas[idx]}</div>
                    <button onClick={()=>setPregIdx(p=>(p+1)%preguntas.length)} style={{width:"100%",padding:"10px",borderRadius:12,border:"1.5px solid #ab47bc",background:"#fff",color:"#6A1B9A",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                      Siguiente pregunta →
                    </button>
                  </div>
                );
              }
              // q.p / q.r format — show all with overlay on answers
              return (
                <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                  <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>PREGUNTAS</div>
                  {preguntas.map((q,i)=>(
                    <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<preguntas.length-1?"1px solid #f5f2ec":"none"}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#333",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>❓ {q.p}</div>
                      {q.r && (
                        <div style={{position:"relative",marginTop:4}}>
                          <div style={{fontSize:12,color:"#666",background:"#f9f7f4",borderRadius:8,padding:"8px 10px",userSelect:reveladas[i]?"auto":"none"}}>
                            ✓ {q.r}
                          </div>
                          {!reveladas[i] && (
                            <button onClick={()=>setReveladas(prev=>({...prev,[i]:true}))}
                              style={{position:"absolute",inset:0,width:"100%",height:"100%",background:"rgba(106,27,154,0.92)",borderRadius:8,border:"none",cursor:"pointer",color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"inherit"}}>
                              👁 Ver respuesta
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
            {juegoActivo.dilemas && (()=>{
              const dilemas = juegoActivo.dilemas;
              const idx = dilemaIdx % dilemas.length;
              return (
                <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>DILEMAS</div>
                    <div style={{fontSize:10,color:"#bbb"}}>{idx+1} / {dilemas.length}</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:600,color:"#333",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5,marginBottom:14,textAlign:"center",padding:"8px 0"}}>🔀 {dilemas[idx]}</div>
                  <button onClick={()=>setDilemaIdx(d=>(d+1)%dilemas.length)} style={{width:"100%",padding:"10px",borderRadius:12,border:"1.5px solid #ab47bc",background:"#fff",color:"#6A1B9A",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    Siguiente dilema →
                  </button>
                </div>
              );
            })()}
            {juegoActivo.buscar && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>LISTA PARA BUSCAR</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {juegoActivo.buscar.map((b,i)=>(
                    <div key={i} style={{fontSize:12,color:"#444",fontFamily:"'DM Sans',sans-serif",padding:"8px 12px",background:"#faf9f6",borderRadius:10,display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{color:"#ab47bc",fontWeight:700,flexShrink:0}}>□</span>{b}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {juegoActivo.roles && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>ROLES</div>
                {juegoActivo.roles.map((r,i)=>(
                  <div key={i} style={{fontSize:12,color:"#444",fontFamily:"'DM Sans',sans-serif",padding:"8px 12px",background:"#faf9f6",borderRadius:10,marginBottom:6}}>{r}</div>
                ))}
              </div>
            )}
            {juegoActivo.retos && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>RETOS</div>
                {juegoActivo.retos.map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
                    <div style={{background:"#ab47bc",color:"#fff",borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700,flexShrink:0}}>{r.pts}pt</div>
                    <div style={{fontSize:13,color:"#444",fontFamily:"'DM Sans',sans-serif"}}>{r.reto}</div>
                  </div>
                ))}
              </div>
            )}
            {juegoActivo.inicio && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>COMIENZO SUGERIDO</div>
                {juegoActivo.inicio.map((ini,i)=>(
                  <div key={i} style={{fontSize:13,color:"#555",fontStyle:"italic",fontFamily:"'DM Sans',sans-serif",padding:"10px 12px",background:"#faf9f6",borderRadius:10,marginBottom:6,lineHeight:1.5}}>"{ini}"</div>
                ))}
              </div>
            )}
            {juegoActivo.misiones && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>MISIONES FOTOGRÁFICAS</div>
                {juegoActivo.misiones.map((m,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
                    <div style={{background:"#1E88E5",color:"#fff",borderRadius:8,padding:"3px 8px",fontSize:11,fontWeight:700,flexShrink:0}}>{m.puntos}pt</div>
                    <div style={{fontSize:13,color:"#444",fontFamily:"'DM Sans',sans-serif"}}>{m.tarea}</div>
                  </div>
                ))}
              </div>
            )}
            {juegoActivo.casillas && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>CARTÓN DE BINGO</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {juegoActivo.casillas.map((cas,i)=>(
                    <div key={i} style={{fontSize:11,color:"#444",fontFamily:"'DM Sans',sans-serif",padding:"8px 10px",background:"#faf9f6",borderRadius:8,textAlign:"center",border:"1px dashed #e0ddd6"}}>{cas}</div>
                  ))}
                </div>
              </div>
            )}
            {juegoActivo.pruebas && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>PRUEBAS</div>
                {juegoActivo.pruebas.map((pr,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,#2E7D32,#43A047)",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                    <div style={{fontSize:13,color:"#444",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5,paddingTop:2}}>{pr}</div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={()=>setJuegoActivo(null)} style={{width:"100%",padding:"13px",borderRadius:14,border:"1.5px solid #ede9e0",background:"#fff",color:"#555",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>
              Elegir otro juego
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
