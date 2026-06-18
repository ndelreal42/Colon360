import { useState } from "react";

const JUEGOS_DB = {
  solo: [
    {
      nombre:"20 Verdades de Colón",
      desc:"Tenés que adivinar un lugar o personaje de Colón. Solo podés hacer 20 preguntas con respuesta SÍ o NO. El juego te va dando pistas.",
      instrucciones:["Pensá en un lugar secreto de Colón","Hacete estas preguntas mentalmente","¿Está en la costanera? ¿Tiene agua? ¿Es histórico?","Descubrí de qué lugar se trata en 20 preguntas o menos"],
      emoji:"🧠", duracion:"5-10 min",
      lugares:["Molino Forclaz","Termas Colón","Playa Honda","Puerto Fluvial","Parque El Palmar","Museo Histórico"],
    },
    {
      nombre:"Fotógrafo Secreto",
      desc:"Misiones fotográficas para completar. Cada foto tiene un puntaje según la dificultad. Jugá sin mostrársela a nadie.",
      instrucciones:["Tomate 10 minutos","Completá la mayor cantidad de fotos posibles","Cada foto vale puntos","Sumalas al final"],
      misiones:[
        {puntos:1,tarea:"Una foto de algo azul natural"},
        {puntos:2,tarea:"El reflejo del río en algo"},
        {puntos:3,tarea:"Una foto artística del cielo"},
        {puntos:2,tarea:"Algo que solo existe en Colón"},
        {puntos:3,tarea:"Una sombra interesante"},
      ],
      emoji:"📸", duracion:"10 min",
    },
    {
      nombre:"Trivia Colonense",
      desc:"¿Cuánto sabés de Colón? 10 preguntas de historia, naturaleza y cultura local. Respondé mentalmente.",
      instrucciones:["Leé cada pregunta","Pensá tu respuesta","Verificá el resultado","Sumá 1 punto por cada acierto"],
      preguntas:[
        {p:"¿A cuántos km está el Parque Nacional El Palmar?",r:"55 km (por Ruta 14)"},
        {p:"¿Cómo se llama el molino histórico del S.XIX?",r:"Molino Forclaz"},
        {p:"¿En qué año fue fundada la ciudad de Colón?",r:"1863"},
        {p:"¿Qué río bordea la costa de Colón?",r:"El río Uruguay"},
        {p:"¿Cuál es el pez más buscado en la pesca deportiva local?",r:"El dorado"},
      ],
      emoji:"🏆", duracion:"5 min",
    },
    {
      nombre:"Bingo del Viajero",
      desc:"Cartón de bingo con cosas para ver y vivir en Colón. ¡Marcá lo que encontrés a tu alrededor!",
      instrucciones:["Mirá el cartón","Marcá todo lo que veas o hayas hecho hoy","¿Completás una línea?"],
      casillas:["Palmera","Barco en el río","Heladería","Persona con mate","Bandera argentina","Cartel de playa","Bicicleta","Pájaro colorido","Puesto de artesanías","Persona haciendo running"],
      emoji:"🎰", duracion:"indefinido",
    },
  ],
  pareja: [
    {
      nombre:"¿Me conocés?",
      desc:"Uno escribe la respuesta a una pregunta sobre sí mismo. El otro adivina. Después se comparan. Perfecto para parejas.",
      instrucciones:["Cada uno anota su respuesta en silencio","El otro adivina en voz alta","Comparen resultados","Gana quien más acierta"],
      preguntas:[
        "¿Cuál sería tu plan ideal para este fin de semana?",
        "¿Qué plato pedirías si fueras a Campo Adentro?",
        "¿Preferís la playa de mañana o al atardecer?",
        "¿Qué lugar de Colón te gustaría volver a visitar?",
        "¿Termas o río? ¿Por qué?",
        "¿Qué recordarías más de este viaje?",
      ],
      emoji:"💑", duracion:"15 min",
    },
    {
      nombre:"Adivina Mi Foto",
      desc:"Uno saca una foto sin mostrarla. El otro tiene que adivinar qué fotografió solo con 5 pistas.",
      instrucciones:["Uno saca una foto de algo a su alrededor sin mostrarla","Da 5 pistas de a una, de más difícil a más fácil","El otro adivina cuándo puede","Más rápido = más puntos"],
      emoji:"📷", duracion:"10 min",
    },
    {
      nombre:"Mapa Mental Compartido",
      desc:"Sin mirarse, ambos dibujan el mapa de la costanera de Colón como lo recuerdan. Después comparan.",
      instrucciones:["Cada uno dibuja en su teléfono (notas) o en papel","Incluyen: playas, puerto, puntos de referencia","Comparan los mapas","¿En qué se parecen? ¿Qué diferencias hay?"],
      emoji:"🗺️", duracion:"10 min",
    },
    {
      nombre:"Este o Aquél — Colón Edition",
      desc:"Dilemas relacionados con el viaje. Turnos alternados, sin pensarlo más de 5 segundos.",
      instrucciones:["Turnos alternados","Sin pensarlo más de 5 segundos","Si tarda más de 5 seg, el otro elige"],
      dilemas:[
        "¿Termas o río natural?","¿Amanecer o atardecer en la costa?",
        "¿Parrilla o pescado del río?","¿Playa sola o llena de gente?",
        "¿Quedarse más días o explorar otro destino?","¿Kayak o excursión náutica?",
      ],
      emoji:"🔀", duracion:"10 min",
    },
  ],
  amigos: [
    {
      nombre:"Yo nunca... en Colón",
      desc:"Versión viajera del clásico. Quien SÍ lo hizo, toma o hace una penitencia (elegida por el grupo).",
      instrucciones:["En ronda, cada uno dice: 'Yo nunca...' + algo del viaje","Quien sí lo hizo, cumple la penitencia","Penitencias: contar un secreto, hacer un reto, etc."],
      ejemplos:[
        "Yo nunca me tiré al río Uruguay","Yo nunca fui a las termas",
        "Yo nunca probé el dorado a la parrilla","Yo nunca madrugué para ver el amanecer en la playa",
        "Yo nunca me perdí en Colón","Yo nunca hablé con un local del pueblo",
      ],
      emoji:"🙅", duracion:"20 min",
    },
    {
      nombre:"Mafia Colonense",
      desc:"El clásico Mafia adaptado a Colón. Roles: Mafia (quieren dominar el turismo), Policía Turística, Médico del pueblo, Ciudadanos.",
      instrucciones:["1 narrador (el que tiene la app)","Asignar roles en secreto","Noche: Mafia elige víctima","Día: todos debaten quién es la Mafia","Gana Mafia si supera a ciudadanos"],
      roles:["Mafia (1-2): elimina turistas cada noche","Policía Turística: salva a alguien cada noche","Médico del pueblo: protege a uno cada noche","Ciudadano x4+: votan de día"],
      emoji:"🕵️", duracion:"30 min",
    },
    {
      nombre:"Carrera de Conocimiento",
      desc:"Trivia en equipos sobre Colón y Entre Ríos. Primer equipo en llegar a 10 puntos gana.",
      instrucciones:["Dividirse en 2 equipos","Turnos alternados de preguntas","1 punto por respuesta correcta","Primero en llegar a 10 gana"],
      preguntas:[
        {p:"¿Qué palma es emblema del Parque El Palmar?",r:"Palma yatay"},
        {p:"¿En qué provincia argentina está Colón?",r:"Entre Ríos"},
        {p:"¿Cómo se llama el palacio del Gral. Urquiza cerca de Colón?",r:"Palacio San José"},
        {p:"¿Qué animal autóctono abunda en el Parque El Palmar?",r:"Carpincho / yacaré"},
        {p:"¿Qué puente une Colón (AR) con Paysandú (UY)?",r:"Puente Gral. Artigas"},
      ],
      emoji:"🏁", duracion:"20 min",
    },
    {
      nombre:"Reto Físico Costanero",
      desc:"Minijuegos para hacer en la costanera. Cada reto vale puntos. El que más suma gana.",
      instrucciones:["Solo se necesita el cuerpo y el entorno","Un árbitro con el teléfono","Completar el reto para sumar puntos"],
      retos:[
        {pts:1,reto:"¿Quién llega primero a ese árbol? (sprint 20m)"},
        {pts:2,reto:"¿Quién aguanta más tiempo en equilibrio sobre un pie?"},
        {pts:3,reto:"Contar los barcos/kayaks visibles desde la orilla — más cercano al número real gana"},
        {pts:2,reto:"Tirar una piedra al río — ¿quién hace más rebotes?"},
        {pts:1,reto:"¿Quién adivina la temperatura del agua?"},
      ],
      emoji:"🏃", duracion:"15 min",
    },
  ],
  familia: [
    {
      nombre:"Buscador de Colón",
      desc:"Lista de objetos y cosas para encontrar caminando por la costanera. ¡El primero que encuentra todo gana!",
      instrucciones:["Cada uno tiene la misma lista","Salen juntos a buscar","Primero en encontrar todo o más cosas en 15 min gana"],
      buscar:["Una piedra redonda","Algo del color naranja","Un pájaro","El nombre de una calle","Algo de madera vieja","Un barco o lancha","Una flor silvestre","La sombra de una persona"],
      emoji:"🔍", duracion:"15 min",
    },
    {
      nombre:"¿Quién soy? — Versión Colón",
      desc:"Post-it en la frente (o usar la mano tapando). Adivinás quién sos haciendo preguntas SÍ/NO.",
      instrucciones:["Un jugador piensa en un 'personaje' o lugar de Colón","Los demás hacen preguntas de SÍ/NO","Máximo 20 preguntas","Si adivinás, te toca elegir el siguiente"],
      personajes:["El Dorado","El Molino Forclaz","Las Termas","El río Uruguay","El Carpincho","La Palmera Yatay","Un kayak","La Playa Norte"],
      emoji:"🎭", duracion:"20 min",
    },
    {
      nombre:"Cuentacuentos del Río",
      desc:"Todos juntos inventan una historia de aventuras ambientada en Colón. Cada uno agrega una frase.",
      instrucciones:["Alguien empieza: 'Había una vez en Colón...'","Cada uno agrega UNA frase en su turno","La historia debe incluir al menos: el río, un animal, una aventura","Graben la historia en audio al final"],
      inicio:[
        "Había una vez un carpincho que vivía en la orilla del Uruguay...",
        "Una tarde en la Playa Norte, una familia encontró una botella con un mapa...",
        "El guardaparques del Palmar descubrió algo increíble entre las palmeras...",
      ],
      emoji:"📖", duracion:"15 min",
    },
    {
      nombre:"Mini Olimpiadas Familiares",
      desc:"5 pruebas rápidas para hacer en cualquier lugar. Cada prueba tiene un campeón. ¿Quién gana el oro familiar?",
      instrucciones:["5 pruebas, 5 campeones posibles","Árbitro: el que tiene el teléfono","Al final, el que ganó más pruebas es el Campeón Familiar"],
      pruebas:[
        "Equilibrio: ¿quién para más tiempo en un pie con los ojos cerrados?",
        "Memoria: mirar 10 segundos la pantalla, dar vuelta y decir de qué color era cada emoji",
        "Velocidad mental: primero en decir 5 cosas que se ven desde acá",
        "Artístico: mejor dibujo de un carpincho en el teléfono (notas)",
        "Conocimiento: ¿quién sabe más capitales de provincias argentinas?",
      ],
      emoji:"🥇", duracion:"20 min",
    },
  ],
};

export default function JuegosPage({go, juegoCategoria, setJuegoCategoria}) {
  const [juegoActivo, setJuegoActivo] = useState(null);
  const [juegoIdx, setJuegoIdx] = useState(null);
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

  const grad = "linear-gradient(135deg,#6A1B9A,#AB47BC)";

  return (
    <div style={{minHeight:"100vh",background:"#faf9f6",paddingBottom:100}}>
      <div style={{background:grad,padding:"0 16px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
        <div style={{padding:"48px 0 20px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>{
            if(juegoActivo){setJuegoActivo(null);setReveladas({});}
            else if(catActiva){setJuegoCategoria(null);}
            else{go("inicio");}
          }} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>‹</button>
          <div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff",margin:0}}>
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
                  <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#fff"}}>{cat.label}</span>
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
              <div key={i} className="fu" onClick={()=>{setJuegoActivo(j);setReveladas({});}} style={{background:"#fff",borderRadius:18,padding:"18px",marginBottom:10,border:"1px solid #f0ede6",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",cursor:"pointer",display:"flex",gap:14,alignItems:"center",animationDelay:`${i*70}ms`}}>
                <div style={{width:52,height:52,borderRadius:14,background:grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,opacity:0.9}}>{j.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,color:"#1a1a2e",marginBottom:4}}>{j.nombre}</div>
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
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:700,color:"#4A148C"}}>{juegoActivo.nombre}</div>
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
            {juegoActivo.preguntas && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>PREGUNTAS</div>
                {juegoActivo.preguntas.map((q,i)=>(
                  <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<juegoActivo.preguntas.length-1?"1px solid #f5f2ec":"none"}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#333",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>❓ {typeof q==="string"?q:q.p}</div>
                    {q.r && (
                      <div
                        onClick={()=>setReveladas(prev=>({...prev,[i]:true}))}
                        style={{
                          fontSize:12,color:"#888",fontFamily:"'DM Sans',sans-serif",
                          background:"#f9f7f4",borderRadius:8,padding:"6px 10px",marginTop:4,
                          cursor:reveladas[i]?"default":"pointer",
                          filter:reveladas[i]?"none":"blur(6px)",
                          userSelect:reveladas[i]?"auto":"none",
                          transition:"filter 0.25s ease",
                          position:"relative",
                        }}>
                        {reveladas[i]?"✓":"👁"} {q.r}
                        {!reveladas[i] && i===0 && (
                          <div style={{position:"absolute",top:-18,left:0,fontSize:9,color:"#ab47bc",fontWeight:700,filter:"none"}}>Tocá para revelar</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {juegoActivo.dilemas && (
              <div style={{background:"#fff",borderRadius:16,padding:"18px",marginBottom:12,border:"1px solid #f0ede6"}}>
                <div style={{fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>DILEMAS</div>
                {juegoActivo.dilemas.map((d,i)=>(
                  <div key={i} style={{fontSize:13,color:"#444",fontFamily:"'DM Sans',sans-serif",padding:"9px 12px",background:"#faf9f6",borderRadius:10,marginBottom:6}}>{d}</div>
                ))}
              </div>
            )}
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
                  <div key={i} style={{fontSize:13,color:"#555",fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif",padding:"10px 12px",background:"#faf9f6",borderRadius:10,marginBottom:6,lineHeight:1.5}}>"{ini}"</div>
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
