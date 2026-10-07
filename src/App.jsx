import { useState, useEffect, useRef } from "react";
import LOGO_APP from "./assets/logo-app.png";
import HeroCarousel from "./components/HeroCarousel.jsx";
import { getRecomendacionAhora } from "./lib/recomendacion.js";
import { MAPA_CATS, armarLugaresMapa } from "./lib/mapa.js";
import { DATA } from "./data/lugares.js";
import { isAbierto, calcKm, abrirMaps } from "./lib/helpers.js";
import { LUGAR_COORDS } from "./data/geo.js";
import DetailPage from "./components/DetailPage.jsx";
import PlannerPage from "./components/PlannerPage.jsx";
import ServiciosPage from "./components/ServiciosPage.jsx";
import { AGENDA_POOL } from "./lib/eventos.js";
import JuegosPage from "./components/JuegosPage.jsx";
import RelaxPage from "./components/RelaxPage.jsx";
import BottomNav from "./components/BottomNav.jsx";
import MapView from "./components/MapView";
import AhoraModePage from "./components/AhoraModePage";
import { useRioAltura } from "./hooks/useRioAltura.js";
import { useLugares } from "./hooks/useLugares.js";
import { useEventos } from "./hooks/useEventos.js";


// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Colon360() {
  const { data: playasAPI } = useLugares("playa");
  const { data: restaurantesAPI } = useLugares("restaurante");
  const { data: alojamientosAPI } = useLugares("hotel");
const { data: eventosAPI } = useEventos();
  const { data: lugaresAPI } = useLugares();
  const [tab, setTab] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('tab');
    return p || 'inicio';
  });
  const [detail, setDetail] = useState(null);
  const detailRef = useRef(null);
  const [mapFilter, setMapFilter] = useState("Todos");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [time, setTime] = useState(new Date());
  const [atrFilter, setAtrFilter] = useState("Todos");
  const [alojFilter, setAlojFilter] = useState([]);
  const [playaFilter, setPlayaFilter] = useState("Todas");
  const [gastroFilter, setGastroFilter] = useState("Todo");
  const [ruletaModal, setRuletaModal] = useState(false);
  const [ruletaItem, setRuletaItem] = useState(null);
  const [ruletaSpinning, setRuletaSpinning] = useState(false);
  const [ruletaDisplay, setRuletaDisplay] = useState(null);
  const [planDias, setPlanDias] = useState(1);
  const [planPerfil, setPlanPerfil] = useState([]);
  const [planTemas, setPlanTemas] = useState([]);
  const [planResult, setPlanResult] = useState(null);
  const [modalBloque, setModalBloque] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [posTimer, setPosTimer] = useState(null);
  const [permStep, setPermStep] = useState(null); // null | 'gps' | 'notif'
  const [agendaIdx] = useState(() => Math.floor(Math.random() * AGENDA_POOL.length));
  const [gpsBlocked, setGpsBlocked] = useState(false);
  const [juegoCategoria, setJuegoCategoria] = useState(null);
  const [juegoNotifShown, setJuegoNotifShown] = useState(false);
  const [juegoNotifVisible, setJuegoNotifVisible] = useState(false);
  const [notifPermission, setNotifPermission] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [mapaMode, setMapaMode] = useState("lugares");
  const [busqueda, setBusqueda] = useState("");
  const [hintsActivos, setHintsActivos] = useState([]);
  const [relaxAudio, setRelaxAudio] = useState(null);
  const [relaxPlaying, setRelaxPlaying] = useState(false);
  const [clima, setClima] = useState({temp:"--°C", desc:"Cargando", icon:"☀️"});
  const rioAltura = useRioAltura();

  // Clima real — Open-Meteo (gratuito, sin API key) — Colón, Entre Ríos
  useEffect(()=>{
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-32.22&longitude=-58.16&current=temperature_2m,weathercode&timezone=America%2FArgentina%2FBuenos_Aires")
      .then(r=>r.json())
      .then(d=>{
        const t=Math.round(d.current.temperature_2m);
        const c=d.current.weathercode;
        const [desc,icon]=
          c===0?["Despejado","☀️"]:
          c<=3?["Parcial. nublado","⛅"]:
          c<=48?["Neblina","🌫️"]:
          c<=67?["Lluvioso","🌧️"]:
          c<=77?["Nieve","❄️"]:
          c<=82?["Chubascos","🌦️"]:
          ["Tormenta","⛈️"];
        setClima({temp:`${t}°C`,desc,icon});
      })
      .catch(()=>{setClima({temp:"--°C",desc:"Sin datos",icon:"☀️"});});
  },[]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700;800;700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      html,body,#root{height:100%;overflow:hidden;}
      ::-webkit-scrollbar{display:none;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      .fu{animation:fadeUp 0.32s ease forwards;}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
    `;
    document.head.appendChild(style);
    const t = setInterval(()=>setTime(new Date()),1000);
    return ()=>{document.head.removeChild(style);clearInterval(t);};
  },[]);

  // Sequential permission flow: GPS first, then notifications — only once ever
  useEffect(()=>{
    const asked = localStorage.getItem('perm_asked_v2') === 'true';
    if(!asked){
      const t = setTimeout(()=>setPermStep('gps'), 600);
      return ()=>clearTimeout(t);
    }
  },[]);

  const handleGpsAccept = ()=>{
    navigator.geolocation?.getCurrentPosition(
      (p)=>{ setUserPos({lat:p.coords.latitude,lng:p.coords.longitude}); setGpsBlocked(false); },
      ()=>{ setGpsBlocked(true); },
      {enableHighAccuracy:true,timeout:8000}
    );
    localStorage.setItem('perm_asked_v2','true');
    if(typeof Notification !== 'undefined' && Notification.permission !== 'granted'){
      setPermStep('notif');
    } else {
      setPermStep(null);
    }
  };

  const handleGpsDecline = ()=>{
    localStorage.setItem('perm_asked_v2','true');
    if(typeof Notification !== 'undefined' && Notification.permission !== 'granted'){
      setPermStep('notif');
    } else {
      setPermStep(null);
    }
  };

  const handleNotifAccept = ()=>{
    Notification.requestPermission().then(p=>{
      setNotifPermission(p);
      setPermStep(null);
    });
  };

  const handleNotifDecline = ()=>{ setPermStep(null); };

  // Geolocation + stay-timer for game notification
  useEffect(()=>{
    if(!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos)=>{
        const newPos = {lat:pos.coords.latitude, lng:pos.coords.longitude};
        // If auto-granted before modal shows, mark as asked; still ask notif if needed
        if(localStorage.getItem('perm_asked_v2') !== 'true'){
          localStorage.setItem('perm_asked_v2','true');
          if(typeof Notification !== 'undefined' && Notification.permission !== 'granted'){
            setPermStep('notif');
          } else {
            setPermStep(null);
          }
        }
        setUserPos(prev=>{
          if(!prev){ setPosTimer(Date.now()); return newPos; }
          const d = Math.sqrt(Math.pow((newPos.lat-prev.lat)*111000,2)+Math.pow((newPos.lng-prev.lng)*111000*Math.cos(prev.lat*Math.PI/180),2));
          if(d > 50){ setPosTimer(Date.now()); return newPos; }
          return prev;
        });
      },
      null,
      {enableHighAccuracy:true, maximumAge:30000, timeout:10000}
    );
    return ()=>navigator.geolocation.clearWatch(watchId);
  },[]);

  // Check 20-min stay
  useEffect(()=>{
    if(!posTimer || juegoNotifShown) return;
    const interval = setInterval(()=>{
      if(Date.now()-posTimer >= 1*60*1000){
        setJuegoNotifShown(true);
        clearInterval(interval);
        // Show real OS notification via service worker
        if('serviceWorker' in navigator && Notification.permission === 'granted'){
          navigator.serviceWorker.ready.then(reg=>{
            reg.showNotification('¿Te quedás un rato más?',{
              body:'Llevás 20 min aquí. ¡Es el momento ideal para jugar algo!',
              icon:'/icon-512.png',
              badge:'/icon-512.png',
              tag:'juegos',
              data:{ tab:'juegos' },
            });
          });
        } else {
          // Fallback: in-app notification if permission not granted
          setJuegoNotifVisible(true);
        }
      }
    },10000);
    return ()=>clearInterval(interval);
  },[posTimer, juegoNotifShown]);

  // Navegación con historial: cada pantalla nueva suma una "página" (idx) al historial,
  // así el botón ‹ de la app y el botón atrás del celular hacen lo mismo y nunca quedan en bucle.
  const go = (t) => {
    const idx = history.state?.idx || 0;
    if (t === "inicio" && idx > 0) {
      // Volver al Inicio = deshacer todo el recorrido (el handler de popstate muestra Inicio)
      history.go(-idx);
      return;
    }
    history.pushState({tab:t, idx:idx+1}, '', '?tab='+t);
    setTab(t); setDetail(null); setBusqueda(""); window.scrollTo(0,0);
  };

  // Browser / phone back button support
  useEffect(()=>{
    const handler = (event)=>{
      const st = event.state;
      setTab(st?.tab || "inicio");
      setDetail(st?.detail ? detailRef.current : null);
      setBusqueda("");
      setJuegoCategoria(null);
    };
    window.addEventListener('popstate', handler);
    return ()=>window.removeEventListener('popstate', handler);
  },[]);

  // Listen for SW postMessage to navigate tabs (notification tap while app is open)
  useEffect(()=>{
    if(!('serviceWorker' in navigator)) return;
    const handler = (event)=>{
      if(event.data && event.data.type === 'NAVIGATE_TAB') go(event.data.tab);
    };
    navigator.serviceWorker.addEventListener('message', handler);
    return ()=>navigator.serviceWorker.removeEventListener('message', handler);
  },[]);

  // Abrir un lugar suma una página al historial: el botón atrás del celular vuelve a la lista
  const openDetail = (item) => {
    const idx = history.state?.idx || 0;
    detailRef.current = item;
    history.pushState({tab, idx:idx+1, detail:true}, '', '?tab='+tab);
    setDetail(item);
  };
  const closeDetail = () => {
    if (history.state?.detail) history.back(); else setDetail(null);
  };

  if (detail) return (
    <div style={{maxWidth:430,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",height:"100svh",overflowY:"auto"}}>
      <DetailPage item={detail} onBack={closeDetail}/>
      <BottomNav tab={tab} go={go}/>
    </div>
  );

  return (
    <div style={{maxWidth:430,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",background:"#faf9f6",height:"100svh",overflowY:"auto"}}>

      {/* ══ HOME ══ */}
      {tab==="inicio" && (
        <div style={{height:"100svh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* HERO */}
          <div style={{position:"relative",flex:"0 0 42%",overflow:"visible",zIndex:1,display:"flex",flexDirection:"column"}}>
            <div style={{position:"absolute",inset:0,overflow:"hidden",borderRadius:"0 0 22px 22px"}}>
              <HeroCarousel/>
            </div>

            {/* TOP NAV */}
            <div style={{position:"relative",zIndex:2,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",pointerEvents:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:9}}>
                <img src={LOGO_APP} alt="Colón 360" style={{width:36,height:36,objectFit:"cover",borderRadius:10,boxShadow:"0 2px 8px rgba(0,0,0,0.4)"}}/>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:19,fontWeight:800,color:"#fff",letterSpacing:-0.3,lineHeight:1,textShadow:"0 2px 12px rgba(0,0,0,0.35)"}}>
                    Colón<span style={{color:"#F9A825"}}>360</span>
                  </div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.6)",letterSpacing:2,textTransform:"uppercase",marginTop:1}}>Entre Ríos, Argentina</div>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM PANEL */}
          <div style={{flex:1,background:"#f2f4f8",overflow:"auto",display:"flex",flexDirection:"column",padding:"10px 14px",paddingBottom:"calc(env(safe-area-inset-bottom) + 72px)",gap:8}}>

            {/* TARJETA ESTADO DEL RÍO */}
            <div style={{background:"#fff",borderRadius:16,padding:"12px 14px",boxShadow:"0 2px 10px rgba(0,0,0,0.07)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:24}}>🌊</span>
                  <div>
                    <div style={{fontSize:10,color:"#888",fontWeight:600}}>Estado del río</div>
                    <div style={{fontSize:20,fontWeight:800,color:"#1a1a2e",letterSpacing:-0.5,display:"flex",alignItems:"center",gap:6}}>
                      {rioAltura.loading ? "..." : rioAltura.error ? "—" : rioAltura.altura}
                      {!rioAltura.loading && !rioAltura.error && rioAltura.tendencia==="sube" && <span title="El río está subiendo" style={{color:"#e53935",fontSize:16,lineHeight:1}}>▲</span>}
                      {!rioAltura.loading && !rioAltura.error && rioAltura.tendencia==="baja" && <span title="El río está bajando" style={{color:"#2E7D32",fontSize:16,lineHeight:1}}>▼</span>}
                    </div>
                    <div style={{fontSize:10,color:"#aaa"}}>{rioAltura.loading ? "Consultando PNA..." : rioAltura.error ? "Sin datos" : `Altura actual · ${rioAltura.estado}`}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:14}}>
                  {[
                    {dia:"HOY", icon:clima.icon, temp:clima.temp},
                    {dia:"VIE", icon:"🌥️", temp:"24°"},
                    {dia:"SÁB", icon:"⛅", temp:"23°"},
                    {dia:"DOM", icon:"🌤️", temp:"21°"},
                  ].map(d=>(
                    <div key={d.dia} style={{textAlign:"center"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#999",letterSpacing:0.5}}>{d.dia}</div>
                      <div style={{fontSize:16,lineHeight:1.3}}>{d.icon}</div>
                      <div style={{fontSize:11,fontWeight:700,color:"#333"}}>{d.temp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* EXPLORAR COLÓN — grilla 2×2 */}
            <div style={{fontSize:13,fontWeight:800,color:"#1a1a2e",letterSpacing:-0.2}}>Explorar Colón</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {tab:"alojamientos", icon:"🛏️", label:"Alojamiento",  sub:"Hoteles y cabañas",  color:"#2E7D32"},
                {tab:"atractivos",   icon:"🌴", label:"Atractivos",   sub:"Lugares para visitar",color:"#795548"},
                {tab:"servicios",    icon:"🗂️", label:"Servicios",    sub:"Salud, info y más",   color:"#0097A7"},
                {tab:"planner",      icon:"🗓️", label:"Planner",      sub:"Armá tu itinerario",  color:"#1565C0"},
              ].map(item=>(
                <button key={item.tab} onClick={()=>go(item.tab)} style={{background:"#fff",border:"1px solid #e8e8e8",borderRadius:14,padding:"12px 10px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10,boxShadow:"0 1px 6px rgba(0,0,0,0.05)",minWidth:0,width:"100%"}}>
                  <div style={{width:40,height:40,borderRadius:11,background:item.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                    {item.icon}
                  </div>
                  <div style={{textAlign:"left",minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",lineHeight:1.2}}>{item.label}</div>
                    <div style={{fontSize:10,color:"#999",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* ¿QUÉ HAGO AHORA? — botón grande con una recomendación */}
            {(()=>{const rec=getRecomendacionAhora(new Date(),clima); return (
            <button onClick={()=>go("ahoramode")} style={{width:"100%",flex:1,minHeight:108,background:"linear-gradient(135deg,#F9A825,#FF6F00)",border:"none",borderRadius:18,padding:"12px 14px",cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:9,boxShadow:"0 6px 18px rgba(249,168,37,0.42)",boxSizing:"border-box",textAlign:"left"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:13,background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:25,flexShrink:0}}>⚡</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:17,fontWeight:800,color:"#fff",letterSpacing:-0.3,lineHeight:1.1}}>¿Qué hago ahora?</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.85)",marginTop:2}}>Planes según hora, clima y ubicación</div>
                </div>
                <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,flexShrink:0}}>›</div>
              </div>
              <div style={{background:"rgba(255,255,255,0.2)",borderRadius:12,padding:"8px 11px",display:"flex",alignItems:"center",gap:9}}>
                <span style={{fontSize:22,lineHeight:1,flexShrink:0}}>{rec.icon}</span>
                <span style={{fontSize:12.5,fontWeight:600,color:"#fff",lineHeight:1.35}}>{rec.texto}</span>
              </div>
            </button>
            );})()}
          </div>
        </div>
      )}

      {/* ══ LIST PAGES ══ */}
      {["playas","gastronomia","alojamientos","eventos","atractivos"].includes(tab) && (()=>{
        const configs = {
          playas:       {title:"Playas",       sub:"Arena, río y atardeceres únicos",        data:playasAPI,       grad:"linear-gradient(135deg,#1E88E5,#42A5F5)"},
          gastronomia:  {title:"Gastronomía",  sub:"Los mejores sabores de Colón",           data:restaurantesAPI, grad:"linear-gradient(135deg,#F9A825,#f4b90a)"},
          alojamientos: {title:"Alojamientos", sub:"Descansá como te merecés",               data:alojamientosAPI, grad:"linear-gradient(135deg,#2E7D32,#43A047)"},
          eventos:      {title:"Agenda 2026",  sub:"Eventos, ferias y actividades",          data:eventosAPI,      grad:"linear-gradient(135deg,#00695C,#00897B)"},
          atractivos:   {title: atrFilter==="Eventos" ? "Agenda 2026" : "Explorar Colón", sub: atrFilter==="Eventos" ? "Eventos, ferias y actividades" : "Todo lo que Colón tiene para ofrecerte", data:lugaresAPI, grad:"linear-gradient(135deg,#795548,#F9A825)"},
        };
        const {title,sub,data,grad} = configs[tab];

        const baseData =
          tab==="atractivos" && atrFilter==="Eventos"  ? eventosAPI :
          tab==="atractivos" && atrFilter!=="Todos"    ? data.filter(i=>i.cat===atrFilter) :
          tab==="alojamientos" && alojFilter.length>0 ? data.filter(i=>alojFilter.every(f=>i.filtros?.includes(f))) :
          tab==="playas" && playaFilter!=="Todas"      ? data.filter(i=>(i.tags||[]).includes(playaFilter)) :
          tab==="gastronomia" && gastroFilter!=="Todo" ? data.filter(i=>(i.tags||[]).some(t=>t.normalize("NFC")===gastroFilter.normalize("NFC"))) :
          data;

        const displayData = busqueda.length > 1
          ? baseData.filter(i=>{
              const q = busqueda.toLowerCase();
              return (i.nombre||i.titulo||"").toLowerCase().includes(q)||(i.desc||"").toLowerCase().includes(q)||(i.tipo||"").toLowerCase().includes(q);
            })
          : baseData;

        return (
          <div style={{minHeight:"100vh",background:"#faf9f6",paddingBottom:90}}>
            {/* Header */}
            <div style={{background:grad,padding:"0 16px 0",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
              <div style={{padding:"28px 0 12px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
                <button onClick={()=>go("inicio")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
                <div style={{flex:1,minWidth:0}}>
                  <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.1,margin:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{title}</h1>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2}}>{displayData.length} disponibles</div>
                </div>
                {tab==="gastronomia" && (
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={()=>{
                      const pool = gastroFilter!=="Todo"
                        ? DATA.restaurantes.filter(i=>(i.tags||[]).some(t=>t.normalize("NFC")===gastroFilter.normalize("NFC")))
                        : DATA.restaurantes;
                      if(!pool.length) return;
                      setRuletaModal(true);
                      setRuletaItem(null);
                      setRuletaSpinning(true);
                      let count=0;
                      const interval=setInterval(()=>{
                        setRuletaDisplay(pool[Math.floor(Math.random()*pool.length)]);
                        count++;
                        if(count>22){
                          clearInterval(interval);
                          const elegido=pool[Math.floor(Math.random()*pool.length)];
                          setRuletaDisplay(elegido);
                          setRuletaItem(elegido);
                          setRuletaSpinning(false);
                        }
                      },280);
                    }} style={{flexShrink:0,background:"rgba(255,255,255,0.95)",border:"none",borderRadius:20,padding:"5px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>
                      <span style={{fontSize:14}}>🎰</span>
                      <span style={{fontSize:10,fontWeight:800,color:"#E65100"}}>Ruleta</span>
                    </button>
                    <button onClick={()=>go("juegos")} style={{flexShrink:0,background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"5px 11px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontFamily:"inherit"}}>
                      <span style={{fontSize:14}}>🎲</span>
                      <span style={{fontSize:10,fontWeight:700,color:"#fff"}}>Juegos</span>
                    </button>
                  </div>
                )}
              </div>
              {/* Filtros por categoría */}
              {tab==="atractivos" && (
                <div style={{display:"flex",gap:7,paddingBottom:10,overflowX:"auto",scrollbarWidth:"none"}}>
                  {["Todos","Natural","Cultural","Deporte","Eventos"].map(c=>(
                    <button key={c} onClick={()=>setAtrFilter(c)} style={{flexShrink:0,padding:"6px 14px",fontSize:11,fontWeight:700,borderRadius:20,cursor:"pointer",fontFamily:"inherit",background:atrFilter===c?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.15)",color:atrFilter===c?"#795548":"rgba(255,255,255,0.9)",border:"none",transition:"all .2s"}}>{c}</button>
                  ))}
                </div>
              )}
              {tab==="alojamientos" && (
                <div style={{display:"flex",gap:7,paddingBottom:10,overflowX:"auto",scrollbarWidth:"none"}}>
                  <button onClick={()=>setAlojFilter([])} style={{flexShrink:0,padding:"6px 14px",fontSize:11,fontWeight:700,borderRadius:20,cursor:"pointer",fontFamily:"inherit",background:alojFilter.length===0?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.15)",color:alojFilter.length===0?"#2E7D32":"rgba(255,255,255,0.9)",border:"none",transition:"all .2s"}}>Todos</button>
                  {[
                    {id:"mascotas",label:"🐾 Mascotas"},
                    {id:"casaSola",label:"🏠 Casa sola"},
                    {id:"hotel",label:"🏨 Hotel"},
                    {id:"depto",label:"🏢 Dpto/Duplex"},
                    {id:"sinEscaleras",label:"♿ Sin escaleras"},
                    {id:"conEscaleras",label:"🪜 Con escaleras"},
                  ].map(f=>{
                    const active = alojFilter.includes(f.id);
                    return (
                      <button key={f.id} onClick={()=>setAlojFilter(prev=>active?prev.filter(x=>x!==f.id):[...prev,f.id])} style={{flexShrink:0,padding:"6px 14px",fontSize:11,fontWeight:700,borderRadius:20,cursor:"pointer",fontFamily:"inherit",background:active?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.15)",color:active?"#2E7D32":"rgba(255,255,255,0.9)",border:active?"2px solid rgba(46,125,50,0.4)":"none",transition:"all .2s"}}>{f.label}</button>
                    );
                  })}
                </div>
              )}
              {tab==="playas" && (
                <div style={{display:"flex",gap:7,paddingBottom:10,overflowX:"auto",scrollbarWidth:"none"}}>
                  {["Todas","Familia","Jóvenes","Tranquila","Parrillas"].map(c=>(
                    <button key={c} onClick={()=>setPlayaFilter(c)} style={{flexShrink:0,padding:"6px 14px",fontSize:11,fontWeight:700,borderRadius:20,cursor:"pointer",fontFamily:"inherit",background:playaFilter===c?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.15)",color:playaFilter===c?"#1E88E5":"rgba(255,255,255,0.9)",border:"none",transition:"all .2s"}}>{c}</button>
                  ))}
                </div>
              )}
              {tab==="gastronomia" && (
                <div style={{display:"flex",gap:7,paddingBottom:10,overflowX:"auto",scrollbarWidth:"none"}}>
                  {["Todo","Parrilla","Pescado","Pizza","Pastas","Café","Bar","Rotisería","Comidas rápidas","Cervecería","Panadería","Helados"].map(c=>(
                    <button key={c} onClick={()=>setGastroFilter(c)} style={{flexShrink:0,padding:"6px 14px",fontSize:11,fontWeight:700,borderRadius:20,cursor:"pointer",fontFamily:"inherit",background:gastroFilter===c?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.15)",color:gastroFilter===c?"#E65100":"rgba(255,255,255,0.9)",border:"none",transition:"all .2s"}}>{c}</button>
                  ))}
                </div>
              )}
              {/* Buscador */}
              <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",borderRadius:14,padding:"9px 14px",marginBottom:14,border:"1px solid rgba(255,255,255,0.25)"}}>
                <span style={{fontSize:14,opacity:0.8}}>🔍</span>
                <input
                  value={busqueda}
                  onChange={e=>setBusqueda(e.target.value)}
                  placeholder={`Buscar en ${title.toLowerCase()}...`}
                  style={{flex:1,border:"none",background:"transparent",fontSize:12,color:"#fff",outline:"none",fontFamily:"'DM Sans',sans-serif"}}
                />
                {busqueda && <button onClick={()=>setBusqueda("")} style={{border:"none",background:"none",cursor:"pointer",fontSize:16,color:"rgba(255,255,255,0.7)",padding:0,lineHeight:1}}>×</button>}
              </div>
            </div>

            {/* Cards */}
            <div style={{margin:"14px 16px 0"}}>
              {displayData.length===0 && (
                <div style={{textAlign:"center",padding:"40px 20px",color:"#aaa",fontSize:13}}>
                  Sin resultados para "{busqueda}"
                </div>
              )}
              {displayData.map((item,idx)=>{
                const color = item.color||"#1E88E5";
                const coords = LUGAR_COORDS[item.nombre||item.titulo] || (item.lugar ? LUGAR_COORDS[item.lugar] : null);
                const distKm = coords && userPos ? calcKm(userPos.lat, userPos.lng, coords.lat, coords.lng) : null;
                const distLabel = distKm !== null ? (distKm < 1 ? `${Math.round(distKm*1000)} m` : `${distKm.toFixed(1)} km`) : null;
                const estadoHorario = isAbierto(item.horario);
                return (
                  <div key={item.id} className="fu" onClick={()=>openDetail(item)}
                    style={{background:"#fff",borderRadius:22,marginBottom:12,boxShadow:"0 4px 20px rgba(0,0,0,0.09)",overflow:"hidden",cursor:"pointer",animationDelay:`${idx*50}ms`,display:"flex",alignItems:"stretch"}}>
                    {/* Visual block */}
                    <div style={{width:82,background:`linear-gradient(145deg,${color}ee,${color}88)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:32,position:"relative"}}>
                      {item.emoji}
                      {estadoHorario && (
                        <div style={{position:"absolute",bottom:6,left:"50%",transform:"translateX(-50%)",background:estadoHorario.abierto?"#2E7D32":"#c62828",borderRadius:10,padding:"2px 6px",fontSize:8,fontWeight:800,color:"#fff",whiteSpace:"nowrap",letterSpacing:0.3}}>
                          {estadoHorario.abierto ? "● Abierto" : "● Cerrado"}
                        </div>
                      )}
                    </div>
                    {/* Contenido */}
                    <div style={{flex:1,minWidth:0,padding:"13px 12px 12px 14px"}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6,marginBottom:3}}>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:800,color:"#1a1a2e",lineHeight:1.2,flex:1,minWidth:0}}>{item.nombre||item.titulo}</div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                          {item.rating && <div style={{fontSize:12,fontWeight:700,color:"#F9A825",display:"flex",alignItems:"center",gap:1}}>★ {item.rating}</div>}
                          {distLabel && coords && (
                            <div onClick={e=>{e.stopPropagation();abrirMaps(coords.lat,coords.lng,item.nombre||item.titulo||item.lugar);}}
                              style={{fontSize:9,fontWeight:700,color:"#fff",background:"#E53935",borderRadius:20,padding:"2px 8px",cursor:"pointer",whiteSpace:"nowrap"}}>
                              📍 {distLabel}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.tipo && <div style={{fontSize:9,color,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>{item.tipo}</div>}
                      {item.mes && !item.tipo && <div style={{fontSize:9,color,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{item.dia} {item.mes}</div>}
                      {item.horario && item.horario!=="—" && (
                        <div style={{fontSize:10,color:"#aaa",marginBottom:5,display:"flex",alignItems:"center",gap:4}}>
                          🕐 {item.horario}
                        </div>
                      )}
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:5}}>
                        {(item.tags||[]).slice(0,3).map(t=>(
                          <span key={t} style={{fontSize:9,fontWeight:600,padding:"2px 8px",borderRadius:20,background:`${color}18`,color}}>{t}</span>
                        ))}
                        {item.lugar && <span style={{fontSize:9,color:"#bbb"}}>📍 {item.lugar}</span>}
                      </div>
                      <p style={{fontSize:11,color:"#888",lineHeight:1.55,margin:0,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}

              {/* Acceso a Relax — solo en Playas */}
              {tab==="playas" && (
                <div onClick={()=>go("relax")} style={{margin:"4px 0 8px",background:"linear-gradient(135deg,#006064,#00ACC1)",borderRadius:20,padding:"16px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",boxShadow:"0 6px 20px rgba(0,150,136,0.28)"}}>
                  <span style={{fontSize:26}}>🌊</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:800,color:"#fff",letterSpacing:-0.3}}>Modo Relax Colón</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2}}>Sonidos del río · Respiración guiada →</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ══ MAPA ══ */}
      {tab==="mapa" && <MapView mapFilter={mapFilter} setMapFilter={setMapFilter} mapCats={MAPA_CATS} lugares={armarLugaresMapa(lugaresAPI)} onVer={openDetail} go={go} />}

      {/* ══ SERVICIOS ══ */}
      {tab==="servicios" && <ServiciosPage go={go}/>}

      {/* ══ PLANNER ══ */}
      {tab==="planner" && (
        <PlannerPage
          go={go} dias={planDias} setDias={setPlanDias}
          perfil={planPerfil} setPerfil={setPlanPerfil}
          temas={planTemas} setTemas={setPlanTemas}
          result={planResult} setResult={setPlanResult}
          modalBloque={modalBloque} setModalBloque={setModalBloque}
        />
      )}

      {/* ══ AHORA MODE ══ */}
      {tab==="ahoramode" && <AhoraModePage go={go} userPos={userPos} clima={clima}/>}

      {/* ══ JUEGOS ══ */}
      {tab==="juegos" && <JuegosPage go={go} juegoCategoria={juegoCategoria} setJuegoCategoria={setJuegoCategoria}/>}

      {/* ══ SEMANA SANTA ══ */}
      {tab==="semanasanta" && (
        <div style={{minHeight:"100vh",background:"#faf9f6",paddingBottom:90}}>
          {/* Header */}
          <div style={{background:"linear-gradient(135deg,#E65100,#F9A825)",padding:"0 16px 0",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
            <div style={{padding:"28px 0 16px",position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:14}}>
              <button onClick={()=>go("inicio")} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",width:38,height:38,borderRadius:"50%",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"inherit"}}>‹</button>
              <div>
                <div style={{fontSize:9,color:"rgba(255,255,255,0.75)",letterSpacing:2.5,textTransform:"uppercase",fontWeight:700,marginBottom:2}}>ABRIL 2 AL 5</div>
                <h1 style={{fontFamily:"'DM Sans',sans-serif",fontSize:22,fontWeight:800,color:"#fff",lineHeight:1.1,margin:0}}>Semana Santa en Colón</h1>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:3}}>Puerto Colón · Desde las 10:00 h</div>
              </div>
            </div>
          </div>

          <div style={{padding:"16px 16px 0"}}>

            {/* Actividades diarias en el Puerto */}
            <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#E65100",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>🎪 Puerto Colón · Desde las 10:00 h</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {["🛍️ Feria de Artesanías","🍽️ Gastronomía","🍺 Cerveza Artesanal","👶 Sector Infantil","🌿 Productores Locales"].map(a=>(
                  <span key={a} style={{background:"#FFF3E0",color:"#E65100",borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:600}}>{a}</span>
                ))}
              </div>
            </div>

            {/* Feria Costanera */}
            <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#E65100",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>🌅 Feria Costanera · Desde las 18:30 h</div>
              <div style={{fontSize:13,color:"#555"}}>Av. Costanera Quirós (entre San Martín y Bolívar) · Artesanías, gastronomía y ambiente festivo sobre el río Uruguay.</div>
            </div>

            {/* Música en vivo */}
            <div style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:10,marginTop:4}}>🎶 Música en vivo — por la tarde</div>

            {[
              {dia:"Jueves 2",color:"#9C27B0",artists:[
                {nombre:"Leo Ríos",genero:"Latinos y cumbia"},
                {nombre:"No tiene goyete",genero:"Folklore"},
                {nombre:"Lorena Rod",genero:"Latinos y cumbia"},
              ]},
              {dia:"Viernes 3",color:"#9C27B0",artists:[
                {nombre:"Gaby Colombo",genero:"Rock Nacional"},
                {nombre:"Aleatoria",genero:"Música popular latina"},
                {nombre:"Nico Zabala",genero:"Cumbia"},
                {nombre:"La Quarentona",genero:"Plena"},
              ]},
              {dia:"Sábado 4",color:"#9C27B0",artists:[
                {nombre:"Tres de Febrero",genero:"Acústico de clásicos latinoamericanos"},
                {nombre:"Hernán Paz",genero:"Folklore"},
                {nombre:"Costa Azul",genero:"Cumbia"},
              ]},
              {dia:"Domingo 5",color:"#9C27B0",artists:[
                {nombre:"Andrea Morel",genero:"Folklore"},
                {nombre:"Pablo y Mariela",genero:"Folklore, cumbia y latinos"},
                {nombre:"Los Famosos",genero:"Cumbia"},
              ]},
            ].map(({dia,color,artists})=>(
              <div key={dia} style={{background:"#fff",borderRadius:16,padding:"14px 16px",marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                <div style={{display:"inline-block",background:color,color:"#fff",borderRadius:8,padding:"3px 12px",fontSize:12,fontWeight:700,marginBottom:10}}>{dia}</div>
                {artists.map(({nombre,genero})=>(
                  <div key={nombre} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"5px 0",borderBottom:"1px solid #f0f0f0"}}>
                    <span style={{fontSize:14,fontWeight:700,color:"#222"}}>{nombre}</span>
                    <span style={{fontSize:11,color:"#888",marginLeft:8,flexShrink:0}}>({genero})</span>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>
      )}

      {/* ══ RELAX ══ */}
      {tab==="relax" && <RelaxPage go={go} relaxPlaying={relaxPlaying} setRelaxPlaying={setRelaxPlaying} relaxAudio={relaxAudio} setRelaxAudio={setRelaxAudio}/>}

      {/* ══ NOTIFICACIÓN JUEGOS (stay 20min) ══ */}

      {/* MODAL RULETA GASTRONÓMICA */}
      {ruletaModal && (
        <div style={{position:"fixed",inset:0,zIndex:9998,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px"}} onClick={()=>{if(!ruletaSpinning){setRuletaModal(false);setRuletaItem(null);}}}>
          <div style={{background:"#fff",borderRadius:28,width:"100%",maxWidth:380,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}} onClick={e=>e.stopPropagation()}>
            {/* Header naranja */}
            <div style={{background:"linear-gradient(135deg,#F9A825,#E65100)",padding:"24px 20px 20px",textAlign:"center",position:"relative"}}>
              <div style={{fontSize:48,marginBottom:8}}>{ruletaSpinning?"🎰":ruletaDisplay?.emoji||"🍽️"}</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.8)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>
                {ruletaSpinning ? "Eligiendo..." : "¡Tu lugar para comer!"}
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:"#fff",lineHeight:1.2,minHeight:36,transition:"all 0.1s"}}>
                {ruletaDisplay?.nombre || "..."}
              </div>
              {!ruletaSpinning && gastroFilter!=="Todo" && (
                <div style={{marginTop:6,display:"inline-block",background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 12px",fontSize:11,color:"#fff",fontWeight:600}}>Filtro: {gastroFilter}</div>
              )}
            </div>

            {/* Info del lugar (solo cuando terminó de girar) */}
            {!ruletaSpinning && ruletaItem && (
              <div style={{padding:"18px 20px 20px"}}>
                <div style={{fontSize:13,color:"#555",lineHeight:1.7,marginBottom:14}}>{ruletaItem.desc}</div>
                {ruletaItem.info?.length > 0 && (
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                    {ruletaItem.info.slice(0,4).map((inf,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#555"}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:"#F9A825",flexShrink:0}}/>
                        {inf}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{setRuletaModal(false);openDetail(ruletaItem);}} style={{flex:1,background:"linear-gradient(135deg,#F9A825,#E65100)",border:"none",borderRadius:14,padding:"13px",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"inherit"}}>
                    Ver más info
                  </button>
                  <button onClick={()=>{
                    const pool = gastroFilter!=="Todo"
                      ? DATA.restaurantes.filter(i=>(i.tags||[]).some(t=>t.normalize("NFC")===gastroFilter.normalize("NFC")))
                      : DATA.restaurantes;
                    if(!pool.length) return;
                    setRuletaItem(null);
                    setRuletaSpinning(true);
                    let count=0;
                    const interval=setInterval(()=>{
                      setRuletaDisplay(pool[Math.floor(Math.random()*pool.length)]);
                      count++;
                      if(count>18){
                        clearInterval(interval);
                        const elegido=pool[Math.floor(Math.random()*pool.length)];
                        setRuletaDisplay(elegido);
                        setRuletaItem(elegido);
                        setRuletaSpinning(false);
                      }
                    },120);
                  }} style={{background:"#f5f5f5",border:"none",borderRadius:14,padding:"13px 16px",fontSize:20,cursor:"pointer"}}>
                    🔄
                  </button>
                </div>
              </div>
            )}

            {ruletaSpinning && (
              <div style={{padding:"20px",textAlign:"center",color:"#aaa",fontSize:12}}>Girando la ruleta...</div>
            )}

            {!ruletaSpinning && (
              <button onClick={()=>{setRuletaModal(false);setRuletaItem(null);}} style={{width:"100%",background:"none",border:"none",borderTop:"1px solid #f0f0f0",padding:"14px",fontSize:13,color:"#aaa",cursor:"pointer",fontFamily:"inherit"}}>
                Cerrar
              </button>
            )}
          </div>
        </div>
      )}

      {juegoNotifVisible && (
        <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:390,zIndex:9999,background:"linear-gradient(135deg,#6A1B9A,#AB47BC)",borderRadius:18,padding:"16px 18px",boxShadow:"0 8px 32px rgba(106,27,154,0.45)",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:32,flexShrink:0}}>🎲</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:17,fontWeight:700,color:"#fff",marginBottom:3}}>¿Te quedás un rato más?</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>Llevás 20 min aquí. ¡Es el momento ideal para jugar algo!</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
            <button onClick={()=>{setJuegoNotifVisible(false);go("juegos");}} style={{background:"#fff",border:"none",borderRadius:10,padding:"7px 12px",fontSize:11,fontWeight:700,color:"#6A1B9A",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
              Jugar!
            </button>
            <button onClick={()=>setJuegoNotifVisible(false)} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,padding:"6px 12px",fontSize:11,color:"rgba(255,255,255,0.8)",cursor:"pointer",fontFamily:"inherit"}}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ══ PERMISSION MODALS (sequential: GPS → Notif) ══ */}
      {permStep === 'gps' && (
        <div style={{position:"fixed",inset:0,zIndex:10000,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{width:"100%",maxWidth:430,background:"#1a1a2e",borderRadius:"24px 24px 0 0",padding:"28px 24px 40px",boxShadow:"0 -8px 40px rgba(0,0,0,0.5)"}}>
            <div style={{fontSize:40,marginBottom:16,textAlign:"center"}}>📍</div>
            <div style={{fontSize:17,fontWeight:700,color:"#fff",textAlign:"center",marginBottom:8}}>¿Compartís tu ubicación?</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",textAlign:"center",lineHeight:1.5,marginBottom:28}}>
              Para mostrarte distancias y planes cercanos a vos
            </div>
            <button onClick={handleGpsAccept} style={{width:"100%",background:"#F9A825",border:"none",borderRadius:14,padding:"14px",fontSize:15,fontWeight:700,color:"#1a1a2e",cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>
              Sí, activar
            </button>
            <button onClick={handleGpsDecline} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"none",borderRadius:14,padding:"12px",fontSize:13,color:"rgba(255,255,255,0.5)",cursor:"pointer",fontFamily:"inherit"}}>
              Ahora no
            </button>
          </div>
        </div>
      )}

      {permStep === 'notif' && (
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:390,zIndex:10000,background:"#1565C0",borderRadius:18,padding:"14px 16px",boxShadow:"0 8px 28px rgba(21,101,192,0.45)",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:28,flexShrink:0}}>🔔</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:2}}>Activar notificaciones</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>Te avisamos cuando haya algo interesante cerca</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
            <button onClick={handleNotifAccept} style={{background:"#fff",border:"none",borderRadius:10,padding:"7px 12px",fontSize:11,fontWeight:700,color:"#1565C0",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
              Activar
            </button>
            <button onClick={handleNotifDecline} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,padding:"5px 12px",fontSize:11,color:"rgba(255,255,255,0.75)",cursor:"pointer",fontFamily:"inherit"}}>
              No, gracias
            </button>
          </div>
        </div>
      )}

      {gpsBlocked && (
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:390,zIndex:9999,background:"linear-gradient(135deg,#b71c1c,#e53935)",borderRadius:18,padding:"14px 16px",boxShadow:"0 8px 28px rgba(183,28,28,0.45)",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:26,flexShrink:0}}>📍</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:2}}>Ubicación bloqueada</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.85)",lineHeight:1.4}}>Activala en Configuración del celular → Privacidad → Ubicación</div>
          </div>
          <button onClick={()=>setGpsBlocked(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"7px 10px",fontSize:11,color:"#fff",cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>
            OK
          </button>
        </div>
      )}

      <BottomNav tab={tab} go={go}/>
    </div>
  );
}
