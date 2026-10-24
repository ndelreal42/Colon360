// Mapa ilustrado de Colón (estilo parque de diversiones) con calles REALES de OpenStreetMap.
// - Dibuja con SVG: río, islas, calles, parques, playas + dibujos (atracciones, árboles, vacas, botes, sombrillas).
// - Zoom por niveles: de lejos solo lo importante; al acercar aparecen servicios, nombres de calles y alojamientos.
// - Mientras se arrastra o se hace zoom solo se mueve la imagen ya dibujada (transform CSS = rápido);
//   cuando el dedo se queda quieto se redibuja nítido (función commit).
// - Buscador de lugares, calles y esquinas ("12 de Abril y Alem"), GPS (punto azul) y "Cómo llegar".
// - Los lugares de la API se ubican por lat/lng con la misma proyección que las calles (ll2xy).
// Datos: src/data/osmColon.txt (© colaboradores de OpenStreetMap, licencia ODbL: el crédito tiene que quedar visible).
import OSM_RAW from "../data/osmColon.txt?raw";

const CSS = ".mp{\n  --land:#d3e6a8; --river:#84c6e4; --road:#fffaf0; --road1:#fff0c2; --road0:#ffd67e;\n  --ink:#33402e; --sand:#f5d98f; --park:#a9d47c; --grass:#c4e19c; --wood:#86c46d; --wet:#b7dccb; --pitch:#97cf86;\n  --accent:#e8603c; --paper:#fffaf0; --muted:#6d7a62; --chipoff:#e9e4d6;\n  --display:\"Lilita One\",\"Arial Rounded MT Bold\",system-ui,sans-serif;\n  --body:\"Nunito\",system-ui,-apple-system,\"Segoe UI\",sans-serif;\n  color-scheme:light;\n}\n.mp{background:var(--land);color:var(--ink);font-family:var(--body);overflow:hidden;font-size:14px;line-height:1.3;-webkit-tap-highlight-color:transparent}\n.mp{position:relative;height:100%;width:100%}\n.mp .mp-map{touch-action:none;position:absolute;inset:0;width:100%;height:100%;will-change:transform;display:block;cursor:grab;user-select:none;-webkit-user-select:none}\n.mp .mp-map.drag{cursor:grabbing}\n.mp .top{position:absolute;top:0;left:0;right:0;z-index:5;display:flex;flex-direction:column;gap:8px;\n  padding-top:calc(var(--mp-top,10px) + env(safe-area-inset-top,0px));padding-bottom:6px;\n  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));pointer-events:none}\n.mp .row1{display:flex;gap:8px;align-items:stretch;pointer-events:auto;max-width:560px}\n.mp .brand{flex:none;display:flex;align-items:center;gap:8px;background:var(--paper);border:2.5px solid var(--ink);border-radius:14px;padding:4px 10px 4px 6px;box-shadow:0 3px 0 var(--ink)}\n.mp .brand b{font-family:var(--display);font-size:17px;line-height:1;white-space:nowrap}\n.mp .seal{width:28px;height:28px;border-radius:50%;background:var(--accent);border:2.5px solid var(--ink);display:grid;place-items:center;color:var(--paper);font-family:var(--display);font-size:11px}\n.mp .search{position:relative;flex:1;min-width:0}\n.mp .search input{width:100%;height:100%;min-height:42px;box-sizing:border-box;font:700 15px var(--body);color:var(--ink);background:var(--paper);border:2.5px solid var(--ink);border-radius:14px;padding:0 12px;box-shadow:0 3px 0 var(--ink);outline:none}\n.mp .search input:focus-visible{border-color:var(--accent)}\n.mp .results{position:absolute;left:0;right:0;top:calc(100% + 8px);background:var(--paper);border:2.5px solid var(--ink);border-radius:14px;overflow:hidden;box-shadow:0 4px 0 var(--ink)}\n.mp .results button{display:flex;width:100%;gap:10px;align-items:center;text-align:left;font:700 14px var(--body);color:var(--ink);background:none;border:0;border-bottom:1.5px solid #e6dfcc;padding:10px 12px;cursor:pointer}\n.mp .results button:last-child{border-bottom:0}\n.mp .results button:hover,.mp .results button:focus-visible{background:#f4ecd6;outline:none}\n.mp .results small{margin-left:auto;color:var(--muted);font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.06em;flex:none}\n.mp .dot{flex:none;width:10px;height:10px;border-radius:50%;border:1.5px solid var(--ink)}\n.mp .chips{display:flex;gap:6px;overflow-x:auto;pointer-events:auto;padding-bottom:4px;scrollbar-width:none}\n.mp .chips::-webkit-scrollbar{display:none}\n.mp .chip{flex:none;font:800 13px var(--body);color:var(--ink);background:var(--paper);border:2px solid var(--ink);border-radius:999px;padding:6px 12px;cursor:pointer;box-shadow:0 2px 0 var(--ink);display:flex;align-items:center;gap:6px}\n.mp .chip[aria-pressed=\"false\"]{background:var(--chipoff);color:var(--muted);box-shadow:none;transform:translateY(2px)}\n.mp .chip:focus-visible,.mp .zbtn:focus-visible,.mp .close:focus-visible{outline:3px solid var(--accent);outline-offset:2px}\n.mp .zoom{position:absolute;z-index:5;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(30px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:8px;align-items:center}\n.mp .zbtn{width:46px;height:46px;border-radius:14px;background:var(--paper);border:2.5px solid var(--ink);box-shadow:0 3px 0 var(--ink);font:24px var(--display);color:var(--ink);cursor:pointer}\n.mp .scale{position:absolute;z-index:4;left:calc(16px + env(safe-area-inset-left,0px));bottom:calc(30px + env(safe-area-inset-bottom,0px));font:800 11px var(--body);color:var(--ink);font-variant-numeric:tabular-nums}\n.mp .scale i{display:block;height:7px;border:2px solid var(--ink);border-top:0;margin-top:3px;background:repeating-linear-gradient(90deg,var(--ink) 0 50%,var(--paper) 50% 100%) ;background-size:50% 100%}\n.mp .osm{position:absolute;z-index:4;right:calc(70px + env(safe-area-inset-right,0px));bottom:calc(6px + env(safe-area-inset-bottom,0px));font:700 10px var(--body);color:var(--muted);background:rgba(255,250,240,.85);padding:2px 6px;border-radius:6px}\n.mp .osm a{color:inherit}\n.mp .lvl{position:absolute;z-index:4;left:calc(16px + env(safe-area-inset-left,0px));bottom:calc(64px + env(safe-area-inset-bottom,0px));background:var(--paper);border:2px solid var(--ink);border-radius:12px;padding:7px 11px;font-size:12.5px;font-weight:700;max-width:220px;line-height:1.35}\n.mp .sheet{position:absolute;z-index:6;left:0;right:0;bottom:0;background:var(--paper);border-top:3px solid var(--ink);border-radius:22px 22px 0 0;\n  padding-top:14px;padding-bottom:calc(18px + env(safe-area-inset-bottom,0px));\n  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));\n  transform:translateY(110%);transition:transform .28s cubic-bezier(.2,.9,.3,1.15);box-shadow:0 -6px 20px rgba(51,64,46,.18)}\n.mp .sheet.open{transform:none}\n.mp .sheet .row{display:flex;gap:12px;align-items:flex-start;max-width:640px;margin:0 auto}\n.mp .sheet .ic{flex:none;width:50px;height:50px;border-radius:14px;border:2.5px solid var(--ink);display:grid;place-items:center;font:22px var(--display);color:var(--paper)}\n.mp .sheet h2{font:23px/1.08 var(--display);margin:0 0 4px;text-wrap:balance}\n.mp .sheet .cat{font:800 11px var(--body);text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}\n.mp .sheet p{margin:6px 0 0;font-size:14.5px;line-height:1.45;max-width:60ch}\n.mp .sheet .tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}\n.mp .sheet .tag{font:800 12px var(--body);border:2px solid var(--ink);border-radius:999px;padding:3px 10px;background:var(--grass)}\n.mp .sheet .tag.pro{background:var(--sand)}\n.mp .sheet .tag.warn{background:#ffd9c9}\n.mp .go{display:inline-block;margin-top:12px;font:800 14px var(--body);color:var(--paper);background:var(--accent);border:2.5px solid var(--ink);border-radius:12px;padding:7px 14px;text-decoration:none;box-shadow:0 3px 0 var(--ink)}\n.mp .go:focus-visible{outline:3px solid var(--ink);outline-offset:2px}\n.mp .close{margin-left:auto;flex:none;width:36px;height:36px;border-radius:50%;border:2px solid var(--ink);background:var(--paper);font:800 16px var(--body);cursor:pointer;color:var(--ink)}\n.mp .l2,.mp .l3,.mp .l4{display:none}\n.mp .mp-map.z2 .l2,.mp .mp-map.z3 .l2,.mp .mp-map.z4 .l2,.mp .mp-map.z3 .l3,.mp .mp-map.z4 .l3,.mp .mp-map.z4 .l4{display:inline}\n.mp .mp-map.z3 .h3,.mp .mp-map.z4 .h3{display:none}\n.mp .poi{cursor:pointer}\n.mp .poi.off{display:none!important}\n.mp .poi .bob{transition:transform .18s}\n.mp .poi:hover .bob{transform:translateY(-5px)}\n.mp .plbl{font-family:var(--display);fill:var(--ink);paint-order:stroke;stroke:var(--paper);stroke-linejoin:round;text-anchor:middle}\n.mp .slbl{font-family:var(--body);font-weight:800;fill:#7d6236;paint-order:stroke;stroke:var(--road);stroke-linejoin:round;letter-spacing:.02em}\n.mp .alab{font-family:var(--display);fill:rgba(51,64,46,.42);text-anchor:middle;letter-spacing:.18em}\n.mp .wlab{font-family:var(--display);fill:#3f8db5;text-anchor:middle;letter-spacing:.25em;opacity:.8}\n@media (prefers-reduced-motion:reduce){.mp .sheet,.mp .poi .bob{transition:none}}\n@media (max-width:520px){.mp .brand b{display:none}\n.mp .lvl{display:none}}\n.mp [hidden]{display:none!important}\n.mp *,.mp *::before,.mp *::after{box-sizing:border-box}\n.mp button{font-family:inherit}\n.mp .back{flex:none;width:42px;border-radius:14px;background:var(--paper);border:2.5px solid var(--ink);box-shadow:0 3px 0 var(--ink);font:26px/1 var(--display);color:var(--ink);cursor:pointer;padding:0 0 3px}\n.mp .chip.alt{background:var(--ink);color:var(--paper)}\n.mp .ver{display:inline-block;margin:12px 8px 0 0;font:800 14px var(--body);color:var(--ink);background:var(--sand);border:2.5px solid var(--ink);border-radius:12px;padding:7px 14px;cursor:pointer;box-shadow:0 3px 0 var(--ink)}\n";

const MARKUP = "<div id=\"mp-app\" class=\"mp\">\n  <svg id=\"mp-map\" class=\"mp-map\" role=\"img\" aria-label=\"Mapa ilustrado de Colón, Entre Ríos, con calles reales\">\n    <defs>\n      <pattern id=\"mp-waves\" width=\"90\" height=\"34\" patternUnits=\"userSpaceOnUse\">\n        <path d=\"M4 17 q11-9 22 0 t22 0\" fill=\"none\" stroke=\"#ffffff\" stroke-opacity=\".5\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n      </pattern>\n      <pattern id=\"mp-trees\" width=\"46\" height=\"40\" patternUnits=\"userSpaceOnUse\">\n        <circle cx=\"12\" cy=\"12\" r=\"9\" fill=\"#6fb35b\" stroke=\"#33402e\" stroke-width=\"2\"/>\n        <circle cx=\"34\" cy=\"30\" r=\"8\" fill=\"#79bd62\" stroke=\"#33402e\" stroke-width=\"2\"/>\n      </pattern>\n      <pattern id=\"mp-pitchlines\" width=\"16\" height=\"16\" patternUnits=\"userSpaceOnUse\">\n        <rect width=\"8\" height=\"16\" fill=\"#a4d692\"/>\n      </pattern>\n    </defs>\n    <g id=\"mp-world\"></g>\n  </svg>\n\n  <div class=\"top\">\n    <div class=\"row1\">\n      <button class=\"back\" id=\"mp-back\" aria-label=\"Volver\">‹</button>\n      <div class=\"search\">\n        <input id=\"mp-q\" type=\"search\" placeholder=\"Calle, esquina o lugar…\" autocomplete=\"off\" aria-label=\"Buscar calle o lugar\">\n        <div class=\"results\" id=\"mp-res\" hidden></div>\n      </div>\n    </div>\n    <div class=\"chips\" id=\"mp-chips\" role=\"toolbar\" aria-label=\"Filtrar el mapa\"></div>\n  </div>\n\n  <div class=\"lvl\" id=\"mp-lvl\">Acercá el mapa: aparecen más lugares y los nombres de las calles.</div>\n  <div class=\"scale\" id=\"mp-scale\"><span id=\"mp-scaleTxt\">200 m</span><i id=\"mp-scaleBar\" style=\"width:80px\"></i></div>\n  <div class=\"osm\">Calles © <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">OpenStreetMap</a></div>\n\n  <div class=\"zoom\">\n    <button class=\"zbtn\" id=\"mp-zme\" aria-label=\"Mi ubicación\" style=\"font-size:19px\">◎</button>\n    <button class=\"zbtn\" id=\"mp-zin\" aria-label=\"Acercar\">+</button>\n    <button class=\"zbtn\" id=\"mp-zout\" aria-label=\"Alejar\">−</button>\n    <button class=\"zbtn\" id=\"mp-zhome\" aria-label=\"Volver al centro de Colón\" style=\"font-size:17px\">⌂</button>\n  </div>\n\n  <div class=\"sheet\" id=\"mp-sheet\" aria-live=\"polite\">\n    <div class=\"row\">\n      <div class=\"ic\" id=\"mp-sIc\"></div>\n      <div style=\"min-width:0\">\n        <div class=\"cat\" id=\"mp-sCat\"></div>\n        <h2 id=\"mp-sName\"></h2>\n        <p id=\"mp-sDesc\"></p>\n        <div class=\"tags\" id=\"mp-sTags\"></div>\n        <button class=\"ver\" id=\"mp-sVer\" hidden>Ver ficha ›</button><a class=\"go\" id=\"mp-sGo\" target=\"_blank\" rel=\"noopener\">Cómo llegar ↗</a>\n      </div>\n      <button class=\"close\" id=\"mp-sClose\" aria-label=\"Cerrar ficha\">✕</button>\n    </div>\n  </div>\n</div>";

export function crearMapaParque(root, opts = {}) {
  if (!document.getElementById("mp-estilos")) {
    const st = document.createElement("style");
    st.id = "mp-estilos";
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  root.innerHTML = MARKUP;
  const $id = (i) => root.querySelector("#mp-" + i);
  const offs = [];
  const listen = (t, ty, fn, o) => { t.addEventListener(ty, fn, o); offs.push(() => t.removeEventListener(ty, fn, o)); };
  const NS="http://www.w3.org/2000/svg", INK="#33402e", U=2; // 1 unidad = 2 metros
  const svg=$id("map"), world=$id("world");
  const el=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};

  /* ---------- decodificar datos OSM ---------- */
  const A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",IX={};[...A].forEach((c,i)=>IX[c]=i);
  function dec(s){const pts=[];let i=0,x=0,y=0;const r=()=>{let v=0,sh=0,b;do{b=IX[s[i++]];v|=(b&31)<<sh;sh+=5}while(b&32);return v&1?~(v>>1):v>>1};while(i<s.length){x+=r();y+=r();pts.push([x,y])}return pts}
  const D={names:[],islands:[],areas:[],streams:[],roads:[],lodg:[]};
  OSM_RAW.trim().split("\n").forEach(l=>{const f=l.split("|");
    switch(f[0]){case"W":D.w=+f[1];D.h=+f[2];break;case"N":D.names.push(f[1].replace(/­/g,""));break;case"V":D.river=dec(f[1]);break;
    case"I":D.islands.push(dec(f[1]));break;case"A":D.areas.push([f[1],dec(f[2])]);break;case"S":D.streams.push([+f[1],dec(f[2])]);break;
    case"R":D.roads.push({c:+f[1],n:+f[2],b:+f[3],p:dec(f[4])});break;case"H":D.lodg.push({t:f[1],name:f[2].replace(/­/g,""),x:+f[3],y:+f[4]});}});
  const W=D.w,H=D.h;
  const poly=p=>"M"+p.map(q=>q.join(" ")).join("L")+"Z", line=p=>"M"+p.map(q=>q.join(" ")).join("L");

  /* ---------- GPS: conversión lat/lon <-> mapa (misma proyección de las calles) ---------- */
  const LAT0=-32.22,LON0=-58.145,KX=Math.cos(LAT0*Math.PI/180)*111320,KY=110574,X0=-0.065*KX,Y0=(LAT0+32.17)*KY;
  const ll2xy=(lat,lon)=>[((lon-LON0)*KX-X0)/U,((LAT0-lat)*KY-Y0)/U];
  const xy2ll=(x,y)=>[LAT0-(y*U+Y0)/KY,LON0+(x*U+X0)/KX];
  /* ---------- capas base ---------- */
  el("rect",{x:-3000,y:-3000,width:W+6000,height:H+6000,fill:"var(--land)"},world);
  const water=el("g",{},world);
  el("path",{d:poly(D.river),fill:"var(--river)"},water);
  el("path",{d:poly(D.river),fill:"url(#mp-waves)"},water);
  D.areas.filter(a=>a[0]==="water").forEach(a=>el("path",{d:poly(a[1]),fill:"var(--river)"},water));
  el("path",{d:poly(D.river),fill:"none",stroke:INK,"stroke-width":2.5,"vector-effect":"non-scaling-stroke"},water);
  D.islands.forEach(p=>el("path",{d:poly(p),fill:"var(--grass)",stroke:INK,"stroke-width":2,"vector-effect":"non-scaling-stroke"},water));
  const streamPaths=D.streams.map(([big,p])=>el("path",{d:line(p),fill:"none",stroke:"var(--river)","stroke-linecap":"round","stroke-linejoin":"round","data-w":big?7:3,"data-min":big?2:1.2},world));
  const AFILL={park:"var(--park)",grass:"var(--grass)",wood:"var(--wood)",wet:"var(--wet)",pitch:"var(--pitch)",beach:"var(--sand)"};
  const areaG=el("g",{},world);
  Object.keys(AFILL).forEach(k=>{const ps=D.areas.filter(a=>a[0]===k);if(!ps.length)return;
    const d=ps.map(a=>poly(a[1])).join("");
    el("path",{d,fill:AFILL[k],stroke:INK,"stroke-width":1.4,"stroke-opacity":.55,"vector-effect":"non-scaling-stroke"},areaG);
    if(k==="wood")el("path",{d,fill:"url(#mp-trees)",opacity:.75},areaG);
    if(k==="pitch")el("path",{d,fill:"url(#mp-pitchlines)",opacity:.7},areaG);});

  /* calles: una capa por tipo (borde + relleno) */
  const RCLS=[{m:16,min:4,fill:"var(--road0)"},{m:12,min:3,fill:"var(--road1)"},{m:9,min:1.8,fill:"var(--road)"},{m:4,min:1,fill:"#efe1bf",dash:1},{m:4,min:.9,fill:"var(--road)"}];
  const roadG=el("g",{"stroke-linecap":"round","stroke-linejoin":"round",fill:"none"},world);
  const casing=[],filling=[];
  [3,4,2,1,0].forEach(c=>{const d=D.roads.filter(r=>r.c===c&&!r.b).map(r=>line(r.p)).join("");if(!d)return;
    casing.push([c,el("path",{d,stroke:INK},roadG)]);});
  [3,4,2,1,0].forEach(c=>{const d=D.roads.filter(r=>r.c===c&&!r.b).map(r=>line(r.p)).join("");if(!d)return;
    filling.push([c,el("path",{d,stroke:RCLS[c].fill},roadG)]);});
  const bridges=D.roads.filter(r=>r.b);
  const brC=el("path",{d:bridges.map(r=>line(r.p)).join(""),stroke:INK},roadG);
  const brF=el("path",{d:bridges.map(r=>line(r.p)).join(""),stroke:"#e9e3d2"},roadG);
  const brDash=el("path",{d:bridges.map(r=>line(r.p)).join(""),stroke:INK,"stroke-dasharray":"2 6","stroke-linecap":"butt"},roadG);

  /* ---------- nombres de calles (unimos tramos con el mismo nombre) ---------- */
  const byName={};
  D.roads.forEach(r=>{if(r.n<0||r.c>2&&r.c!==0)return;(byName[r.n]=byName[r.n]||[]).push(r.p.slice())});
  const len=p=>{let s=0;for(let i=1;i<p.length;i++)s+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return s};
  const same=(a,b)=>Math.abs(a[0]-b[0])<=2&&Math.abs(a[1]-b[1])<=2;
  const streets=[]; // {name, p, len}
  Object.entries(byName).forEach(([n,segs])=>{
    let changed=true;
    while(changed){changed=false;
      outer:for(let i=0;i<segs.length;i++)for(let j=0;j<segs.length;j++){if(i===j)continue;const a=segs[i],b=segs[j];
        if(same(a[a.length-1],b[0])){segs[i]=a.concat(b.slice(1));}
        else if(same(a[a.length-1],b[b.length-1])){segs[i]=a.concat(b.slice().reverse().slice(1));}
        else if(same(a[0],b[b.length-1])){segs[i]=b.concat(a.slice(1));}
        else if(same(a[0],b[0])){segs[i]=b.slice().reverse().concat(a.slice(1));}
        else continue;
        segs.splice(j,1);changed=true;break outer;}}
    segs.forEach(p=>streets.push({name:D.names[n],p,len:len(p)}));
  });
  const labelG=el("g",{class:"l3"},world);
  let sid=0;
  const labeled=new Set();
  streets.sort((a,b)=>b.len-a.len).forEach(s=>{
    if(s.len<60)return;
    const key=s.name; const count=[...labeled].filter(k=>k===key).length;
    let p=s.p; if(p[0][0]>p[p.length-1][0])p=p.slice().reverse();
    const id="mp-st"+(sid++);
    el("path",{id,d:line(p),fill:"none",stroke:"none"},labelG);
    const n=Math.max(1,Math.min(4,Math.floor(s.len/700)));
    for(let k=0;k<n;k++){const t=el("text",{class:"slbl",dy:".35em"},labelG);
      const tp=el("textPath",{href:"#"+id,startOffset:((k+.5)/n*100)+"%","text-anchor":"middle"},t);tp.textContent=s.name;}
    labeled.add(key);
  });

  const decoG=el("g",{},world);
  /* ---------- textos de zonas ---------- */
  const areaLabels=el("g",{},world);
  const ALAB=[["COLÓN",3150,2760,22,"alab h3"],["RÍO URUGUAY",4180,3300,20,"wlab",-55],["RÍO URUGUAY",3550,900,16,"wlab",-45],["URUGUAY",5450,2300,18,"alab"],
    ["Isla de Hornos",4648,4262,11,"wlab l2"],["Isleta San Miguel",4265,1305,11,"wlab l2"],["Islote Varillal",3803,699,11,"wlab l2"],["El Colorado",686,538,13,"alab"],
    ["Parque Quirós",3649,3067,11,"alab l2"],["→ Paysandú",5400,5380,13,"alab"]];
  const aTexts=ALAB.map(([t,x,y,px,cls,rot])=>{const e=el("text",{class:cls,x,y,transform:rot?`rotate(${rot} ${x} ${y})`:""},areaLabels);e.textContent=t;e.dataset.px=px;return e});

  /* ---------- dibujos de atracciones (origen en la base, ~200 de ancho) ---------- */
  const sh=(w=60)=>`<ellipse cx="0" cy="4" rx="${w}" ry="${w*.22}" fill="${INK}" opacity=".2"/>`;
  const ART={
    cartel:()=>`${sh(110)}<g class="bob"><rect x="-112" y="-12" width="224" height="16" rx="5" fill="#cfc4a8" stroke="${INK}" stroke-width="3"/>${["C","O","L","Ó","N"].map((c,i)=>{const cols=["#e8603c","#2f8fc2","#f2b630","#5aa85b","#d9434b"];return `<g transform="translate(${-88+i*44} -12)"><rect x="-19" y="-62" width="38" height="62" rx="6" fill="${cols[i]}" stroke="${INK}" stroke-width="3.5"/><text x="0" y="-16" text-anchor="middle" font-family="Lilita One,system-ui" font-size="40" fill="#fffaf0">${c}</text></g>`}).join("")}</g>`,
    termas:()=>`${sh(90)}<g class="bob"><path d="M-90 0 C-90 -40 90 -40 90 0 C90 22 -90 22 -90 0Z" fill="#c8b48e" stroke="${INK}" stroke-width="4"/><ellipse cx="0" cy="-8" rx="74" ry="22" fill="#5cc4d6" stroke="${INK}" stroke-width="3.5"/><ellipse cx="-20" cy="-12" rx="22" ry="5" fill="#a9ecf3"/>${[-40,0,40].map(x=>`<path d="M${x} -26 c-10 -14 10 -22 0 -36 c-10 -14 10 -22 0 -34" fill="none" stroke="#fffaf0" stroke-width="7" stroke-linecap="round"/><path d="M${x} -26 c-10 -14 10 -22 0 -36 c-10 -14 10 -22 0 -34" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".35"/>`).join("")}</g>`,
    playa:()=>`${sh(70)}<g class="bob"><path d="M-70 0 C-60 -26 60 -26 70 0Z" fill="var(--sand)" stroke="${INK}" stroke-width="3.5"/><line x1="-10" y1="-8" x2="-24" y2="-92" stroke="${INK}" stroke-width="5"/><path d="M-80 -86 C-60 -130 20 -128 32 -92 C10 -100 -10 -96 -24 -92 C-40 -98 -60 -96 -80 -86Z" fill="#e8603c" stroke="${INK}" stroke-width="4"/><path d="M-56 -100 C-44 -118 -30 -120 -24 -92" fill="#fffaf0" stroke="${INK}" stroke-width="2.5"/><rect x="16" y="-22" width="34" height="10" rx="4" fill="#2f8fc2" stroke="${INK}" stroke-width="3" transform="rotate(-12 33 -17)"/></g>`,
    puente:()=>`${sh(120)}<g class="bob"><path d="M-130 -30 H130" stroke="${INK}" stroke-width="12"/><path d="M-130 -30 H130" stroke="#d8d2c0" stroke-width="6"/>${[-90,-30,30,90].map(x=>`<path d="M${x-30} -30 Q${x} -70 ${x+30} -30" fill="none" stroke="${INK}" stroke-width="4"/><rect x="${x-4}" y="-30" width="8" height="30" fill="#b9b19a" stroke="${INK}" stroke-width="3"/>`).join("")}</g>`,
    puerto:()=>`${sh(70)}<g class="bob"><rect x="-70" y="-14" width="80" height="14" fill="#a3764a" stroke="${INK}" stroke-width="3"/><path d="M10 -6 H80 L66 14 H22Z" fill="#fffaf0" stroke="${INK}" stroke-width="3.5"/><rect x="30" y="-28" width="28" height="22" rx="4" fill="#2f8fc2" stroke="${INK}" stroke-width="3"/><line x1="44" y1="-28" x2="44" y2="-60" stroke="${INK}" stroke-width="3"/><path d="M44 -60 L66 -52 L44 -44Z" fill="#e8603c" stroke="${INK}" stroke-width="2.5"/></g>`,
    molino:()=>`${sh(60)}<g class="bob"><path d="M-34 0 L-24 -96 H24 L34 0Z" fill="#f0e2c4" stroke="${INK}" stroke-width="4"/><path d="M-30 -96 L0 -124 L30 -96Z" fill="#a3543c" stroke="${INK}" stroke-width="4"/><rect x="-9" y="-30" width="18" height="30" rx="8" fill="#7a4a2a" stroke="${INK}" stroke-width="3"/><g transform="translate(0 -96)">${[0,90,180,270].map(a=>`<rect x="-6" y="-72" width="12" height="70" fill="#fffaf0" stroke="${INK}" stroke-width="3" transform="rotate(${a+20})"/>`).join("")}<circle r="7" fill="${INK}"/></g></g>`,
    iglesia:()=>`${sh(44)}<g class="bob"><rect x="-34" y="-50" width="68" height="50" fill="#f6efe0" stroke="${INK}" stroke-width="3.5"/><rect x="-14" y="-104" width="28" height="56" fill="#f6efe0" stroke="${INK}" stroke-width="3.5"/><path d="M-18 -104 L0 -134 L18 -104Z" fill="#5a7bc0" stroke="${INK}" stroke-width="3.5"/><path d="M0 -134 V-150 M-7 -144 H7" stroke="${INK}" stroke-width="3.5"/><path d="M-10 0 V-20 a10 10 0 0 1 20 0 V0Z" fill="#7a4a2a" stroke="${INK}" stroke-width="3"/></g>`,
    hospital:()=>`${sh(70)}<g class="bob"><rect x="-70" y="-64" width="140" height="64" rx="6" fill="#fffaf0" stroke="${INK}" stroke-width="4"/><rect x="-26" y="-92" width="52" height="30" rx="4" fill="#fffaf0" stroke="${INK}" stroke-width="4"/><path d="M-7 -88 h14 v8 h8 v14 h-8 v8 h-14 v-8 h-8 v-14 h8Z" fill="#d9434b" stroke="${INK}" stroke-width="2"/>${[-50,-26,26,50].map(x=>`<rect x="${x-8}" y="-48" width="16" height="16" rx="3" fill="#a9d9ee" stroke="${INK}" stroke-width="2.5"/>`).join("")}<rect x="-14" y="-28" width="28" height="28" fill="#a9d9ee" stroke="${INK}" stroke-width="3"/></g>`,
    policia:()=>`${sh(50)}<g class="bob"><rect x="-50" y="-52" width="100" height="52" rx="5" fill="#dfe6f4" stroke="${INK}" stroke-width="4"/><rect x="-56" y="-62" width="112" height="14" rx="4" fill="#3c5fb0" stroke="${INK}" stroke-width="3.5"/><rect x="-10" y="-80" width="20" height="16" rx="5" fill="#5bb7ff" stroke="${INK}" stroke-width="3"/><path d="M0 -42 l14 6 v10 c0 8 -7 12 -14 14 c-7 -2 -14 -6 -14 -14 v-10Z" fill="#f2b630" stroke="${INK}" stroke-width="2.5"/></g>`,
    terminal:()=>`${sh(70)}<g class="bob"><rect x="-70" y="-60" width="140" height="44" rx="10" fill="#f2b630" stroke="${INK}" stroke-width="4"/>${[-46,-18,10,38].map(x=>`<rect x="${x}" y="-52" width="20" height="16" rx="3" fill="#a9d9ee" stroke="${INK}" stroke-width="2.5"/>`).join("")}<circle cx="-40" cy="-14" r="11" fill="${INK}"/><circle cx="40" cy="-14" r="11" fill="${INK}"/><circle cx="-40" cy="-14" r="4" fill="#ddd"/><circle cx="40" cy="-14" r="4" fill="#ddd"/></g>`,
    info:()=>`${sh(30)}<g class="bob"><rect x="-26" y="-56" width="52" height="40" rx="8" fill="#5aa85b" stroke="${INK}" stroke-width="3.5"/><text x="0" y="-24" text-anchor="middle" font-family="Lilita One,system-ui" font-size="30" fill="#fffaf0">i</text><rect x="-3" y="-16" width="6" height="16" fill="${INK}"/></g>`,
    bodega:()=>`${sh(56)}<g class="bob"><rect x="-56" y="-50" width="112" height="50" rx="4" fill="#f0e2c4" stroke="${INK}" stroke-width="4"/><path d="M-62 -48 L0 -86 L62 -48Z" fill="#a3543c" stroke="${INK}" stroke-width="4"/><ellipse cx="-24" cy="-20" rx="16" ry="14" fill="#8a5a33" stroke="${INK}" stroke-width="3"/><ellipse cx="24" cy="-20" rx="16" ry="14" fill="#8a5a33" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="-60" r="8" fill="#7d3c98" stroke="${INK}" stroke-width="2.5"/></g>`
  };
  function pin(color,glyph){return `<g class="bob"><ellipse cx="0" cy="2" rx="10" ry="3" fill="${INK}" opacity=".25"/><path d="M0 0 C-4 -10 -18 -18 -18 -32 a18 18 0 0 1 36 0 C18 -18 4 -10 0 0Z" fill="${color}" stroke="${INK}" stroke-width="3"/><text x="0" y="-25" text-anchor="middle" font-family="Lilita One,system-ui" font-size="17" fill="#fffaf0">${glyph}</text></g>`}

  /* ---------- lugares (coordenadas reales de OpenStreetMap) ---------- */
  const CATS={atr:{name:"Atracciones",color:"#e8603c"},agua:{name:"Playas y río",color:"#2f8fc2"},comer:{name:"Comer y tomar",color:"#d9822b"},salud:{name:"Salud",color:"#d9434b"},seg:{name:"Seguridad",color:"#3c5fb0"},serv:{name:"Servicios",color:"#7a5bb8"},aloj:{name:"Alojamientos",color:"#e0a21d"}};
  const POIS=[
   {name:"Termas de Colón",cat:"atr",lod:1,x:2986,y:2148,art:"termas",desc:"Complejo termal con piletas y parque acuático, en la zona norte de la ciudad, cerca del río.",tags:["Piletas termales","Parque acuático"]},
   {name:"Termas San José",cat:"atr",lod:1,x:2227,y:1199,art:"termas",sz:.8,desc:"Termas del balneario San José, junto al camping y la playa.",tags:["Piletas termales","Camping cerca"]},
   {name:"Puerto Colón",cat:"agua",lod:1,x:3440,y:2474,art:"puerto",desc:"Marina sobre el río Uruguay. Punto de salida de paseos en lancha y excursiones a las islas.",tags:["Excursiones","Lanchas"]},
   {name:"Cartel de Colón",cat:"atr",lod:1,x:2420,y:3600,art:"cartel",sz:.85,desc:"El cartel de letras de colores de la entrada a la ciudad. Parada obligada para la foto de bienvenida.",tags:["Foto","Gratis"]},
   {name:"Playa junto al Parque Quirós",cat:"agua",lod:1,x:3853,y:3194,art:"playa",desc:"Playa de arena sobre el río Uruguay, al lado del Parque Quirós y la zona de Piedras Coloradas.",tags:["Arena","Atardecer"]},
   {name:"Playa Balneario San José",cat:"agua",lod:1,x:2344,y:1093,art:"playa",sz:.85,desc:"Playa del balneario San José, con camping y marina.",tags:["Camping","Marina"]},
   {name:"Puente Internacional General Artigas",cat:"atr",lod:1,x:5095,y:5237,art:"puente",desc:"Une Colón con Paysandú, Uruguay. Paso de frontera con control de Gendarmería.",tags:["Paso a Uruguay"]},
   {name:"Molino Forclaz",cat:"atr",lod:1,x:1099,y:2609,art:"molino",desc:"Molino de viento histórico de los colonos, hoy museo, camino a San José.",tags:["Museo","Historia"]},
   {name:"Parroquia Santos Justo y Pastor",cat:"atr",lod:2,x:3123,y:3059,art:"iglesia",sz:.8,desc:"Iglesia principal del centro, frente a las plazas Washington y Artigas, cerca de la Municipalidad.",tags:["Centro"]},
   {name:"Bodega Vulliez-Sermet",cat:"atr",lod:2,x:2406,y:3773,art:"bodega",sz:.8,desc:"Bodega familiar en las afueras de Colón.",tags:["Vinos","Visitas"]},
   {name:"Hospital San Benjamín",cat:"salud",lod:2,x:3463,y:3021,art:"hospital",desc:"Hospital público con guardia. Emergencias médicas: 107.",tags:["Guardia","Emergencias 107"]},
   {name:"Policía Departamental Colón",cat:"seg",lod:2,x:3170,y:2985,art:"policia",sz:.85,desc:"Jefatura de Policía, en el centro junto a la Municipalidad. Emergencias: 911.",tags:["Emergencias 911"]},
   {name:"Terminal de Ómnibus de Colón",cat:"serv",lod:2,x:2947,y:2600,art:"terminal",desc:"Micros de larga distancia y regionales.",tags:["Micros","Larga distancia"]},
   {name:"Oficina de Turismo",cat:"serv",lod:2,x:3462,y:2526,art:"info",sz:.8,desc:"Oficina de Turismo de Colón, en la zona del puerto. Mapas, alojamientos y excursiones.",tags:["Info turística"]},
   {name:"Información Turística (acceso)",cat:"serv",lod:3,x:2458,y:3557,g:"i",desc:"Puesto de información turística en el acceso a la ciudad.",tags:["Info turística"]},
   {name:"Hospital Río Uruguay",cat:"salud",lod:3,x:2976,y:2722,g:"+",desc:"Centro de salud privado.",tags:["Salud"]},
   {name:"Sanatorio Médico Quirúrgico",cat:"salud",lod:3,x:3348,y:3116,g:"+",desc:"Sanatorio privado.",tags:["Salud"]},
   {name:"Clínica Dr. Mariano Pedro Rebord",cat:"salud",lod:3,x:2695,y:2941,g:"+",desc:"Clínica.",tags:["Salud"]},
   {name:"Farmacia 2 de Abril",cat:"salud",lod:3,x:92,y:1954,g:"+",desc:"Farmacia en la zona de El Colorado / San José.",tags:["Farmacia"]},
   {name:"Bomberos",cat:"seg",lod:3,x:3245,y:3023,g:"🔥",desc:"Cuartel de Bomberos Voluntarios. Emergencias: 100.",tags:["Emergencias 100"]},
   {name:"Destacamento Policial Colón",cat:"seg",lod:3,x:3445,y:2537,g:"★",desc:"Destacamento de policía en la zona del puerto.",tags:["Policía"]},
   {name:"Gendarmería (Puente)",cat:"seg",lod:3,x:3686,y:5092,g:"★",desc:"Control de Gendarmería en el acceso al puente internacional.",tags:["Frontera"]},
   {name:"Municipalidad de Colón",cat:"serv",lod:3,x:3204,y:2991,g:"M",desc:"Palacio municipal, frente a la plaza.",tags:["Trámites"]},
   {name:"Banco BBVA y cajero",cat:"serv",lod:3,x:3316,y:2893,g:"$",desc:"Banco y cajero automático.",tags:["Cajero"]},
   {name:"Estación YPF (centro)",cat:"serv",lod:3,x:2993,y:2829,g:"⛽",desc:"Estación de servicio.",tags:["Combustible"]},
   {name:"Estación YPF (acceso)",cat:"serv",lod:3,x:2486,y:3534,g:"⛽",desc:"Estación de servicio en el acceso a la ciudad.",tags:["Combustible"]},
   {name:"Estación de servicio (acceso)",cat:"serv",lod:3,x:2517,y:3481,g:"⛽",desc:"Estación de servicio en el acceso a la ciudad.",tags:["Combustible"]},
   {name:"Estación YPF (puente)",cat:"serv",lod:3,x:3508,y:4967,g:"⛽",desc:"Estación de servicio camino al puente internacional.",tags:["Combustible"]},
   {name:"Llama de la Esperanza",cat:"atr",lod:3,x:3425,y:2793,g:"★",desc:"Monumento sobre la costa.",tags:["Monumento"]},
   {name:"Esculturas de caricaturas en madera",cat:"atr",lod:3,x:3515,y:2533,g:"★",desc:"Esculturas talladas en madera en la costanera.",tags:["Foto","Gratis"]},
   {name:"Casa de la Primera Administración",cat:"atr",lod:3,x:841,y:2734,g:"★",desc:"Museo de la Colonia San José, cerca del Molino Forclaz.",tags:["Museo","Historia"]},
   {name:"Mirador del puerto",cat:"agua",lod:3,x:3453,y:2483,g:"◉",desc:"Mirador sobre el río Uruguay.",tags:["Atardecer"]},
   {name:"Mirador Parque Quirós",cat:"agua",lod:3,x:3679,y:3064,g:"◉",desc:"Mirador sobre el río en el Parque Quirós.",tags:["Atardecer"]},
   {name:"Mirador costanera",cat:"agua",lod:3,x:3621,y:2675,g:"◉",desc:"Mirador sobre el río Uruguay.",tags:["Atardecer"]},
   {name:"Camping Piedras Coloradas",cat:"agua",lod:3,x:3697,y:2944,g:"⛺",desc:"Camping del club, sobre la barranca del río.",tags:["Camping"]},
  ];
  const LODG_NAME={hotel:"Hotel o alojamiento",chalet:"Cabañas",cabin:"Cabañas",apartment:"Departamentos",hostel:"Hostel",camp_site:"Camping"};
  D.lodg.forEach(h=>{if(POIS.some(p=>p.name===h.name))return;POIS.push({name:h.name,cat:"aloj",lod:3,lab:4,x:h.x,y:h.y,g:h.t==="camp_site"?"⛺":"⌂",
    desc:`${LODG_NAME[h.t]||"Alojamiento"} registrado en el mapa de Colón.`,tags:[LODG_NAME[h.t]||"Alojamiento","¿Sos el dueño? Sumate a Colón 360"]})});

  POIS.forEach(p=>{if(p.lat!=null&&p.lon!=null){[p.x,p.y]=ll2xy(p.lat,p.lon)}});
  /* ---------- decoración: árboles, pastito, vacas y rollos en el campo; botes y peces en el río; sombrillas en la playa ---------- */
  (function(){
    const defs=svg.querySelector("defs");
    const S={
      tree:`<ellipse cx="0" cy="0" rx="13" ry="3.5" fill="${INK}" opacity=".18"/><rect x="-2.5" y="-12" width="5" height="12" fill="#8a5a33" stroke="${INK}" stroke-width="1.6"/><circle cx="0" cy="-22" r="13" fill="#6fb35b" stroke="${INK}" stroke-width="2"/><circle cx="-4.5" cy="-26" r="4" fill="#9fd37f"/>`,
      ombu:`<ellipse cx="0" cy="0" rx="20" ry="4.5" fill="${INK}" opacity=".18"/><path d="M-4 0 L-3 -14 L3 -14 L5 0Z" fill="#7a4a2a" stroke="${INK}" stroke-width="1.6"/><circle cx="-10" cy="-22" r="11" fill="#5fa84d" stroke="${INK}" stroke-width="2"/><circle cx="10" cy="-22" r="11" fill="#5fa84d" stroke="${INK}" stroke-width="2"/><circle cx="0" cy="-30" r="13" fill="#68b155" stroke="${INK}" stroke-width="2"/><circle cx="-4" cy="-34" r="4" fill="#9fd37f"/>`,
      pine:`<ellipse cx="0" cy="0" rx="10" ry="3" fill="${INK}" opacity=".18"/><rect x="-2" y="-8" width="4" height="8" fill="#8a5a33" stroke="${INK}" stroke-width="1.5"/><path d="M0 -38 L12 -8 H-12Z" fill="#4f9a52" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M0 -38 L5 -26 L-2 -24Z" fill="#7cc57a"/>`,
      bush:`<ellipse cx="0" cy="0" rx="10" ry="2.5" fill="${INK}" opacity=".15"/><path d="M-10 0 a6 6 0 0 1 4 -9 a7 7 0 0 1 12 0 a6 6 0 0 1 4 9Z" fill="#7cbd5e" stroke="${INK}" stroke-width="1.8"/>`,
      grass:`<path d="M-7 0 l2.5 -8 l2 8 M-1 0 l2 -11 l2 11 M5 0 l1.5 -7 l2 7" fill="none" stroke="#5c9a43" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
      flowers:`<path d="M-6 0 v-6 M0 0 v-9 M6 0 v-5" stroke="#5c9a43" stroke-width="1.5"/><circle cx="-6" cy="-7" r="2.6" fill="#f2b630" stroke="${INK}" stroke-width="1"/><circle cx="0" cy="-10" r="2.6" fill="#e8603c" stroke="${INK}" stroke-width="1"/><circle cx="6" cy="-6" r="2.6" fill="#fffaf0" stroke="${INK}" stroke-width="1"/>`,
      cow:`<ellipse cx="0" cy="0" rx="15" ry="3" fill="${INK}" opacity=".18"/><path d="M-9 -6 v6 M-5 -6 v6 M5 -6 v6 M9 -6 v6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><rect x="-13" y="-17" width="24" height="12" rx="5" fill="#fffaf0" stroke="${INK}" stroke-width="2"/><path d="M-8 -17 q3 5 7 2 q2 -2 0 -2Z M3 -12 q4 -3 6 1 q-3 3 -6 -1Z" fill="${INK}"/><rect x="9" y="-21" width="9" height="9" rx="3.5" fill="#fffaf0" stroke="${INK}" stroke-width="2"/><rect x="13" y="-15" width="6" height="4" rx="2" fill="#f4b6a6" stroke="${INK}" stroke-width="1.4"/><path d="M10 -21 l-2 -3 M17 -21 l2 -3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><path d="M-13 -14 q-4 1 -3 6" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
      cowb:`<ellipse cx="0" cy="0" rx="15" ry="3" fill="${INK}" opacity=".18"/><path d="M-9 -6 v6 M-5 -6 v6 M5 -6 v6 M9 -6 v6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><rect x="-13" y="-17" width="24" height="12" rx="5" fill="#9a5b34" stroke="${INK}" stroke-width="2"/><path d="M-6 -16 q3 4 7 2" fill="none" stroke="#fffaf0" stroke-width="2"/><rect x="9" y="-21" width="9" height="9" rx="3.5" fill="#9a5b34" stroke="${INK}" stroke-width="2"/><rect x="13" y="-15" width="6" height="4" rx="2" fill="#f4b6a6" stroke="${INK}" stroke-width="1.4"/><path d="M10 -21 l-2 -3 M17 -21 l2 -3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
      hay:`<ellipse cx="0" cy="0" rx="11" ry="2.5" fill="${INK}" opacity=".18"/><circle cx="0" cy="-8.5" r="8.5" fill="#e8c46a" stroke="${INK}" stroke-width="2"/><path d="M0 -8.5 m-4.5 0 a4.5 4.5 0 1 0 4.5 -4.5" fill="none" stroke="#b8913a" stroke-width="1.6"/>`,
      boat:`<path d="M-16 -4 H16 L11 4 H-11Z" fill="#fffaf0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M-2 -6 V-32" stroke="${INK}" stroke-width="2"/><path d="M0 -31 L14 -8 H0Z" fill="#e8603c" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M-4 -28 L-14 -8 H-4Z" fill="#fffaf0" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-20 7 q5 -3 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#fffaf0" stroke-width="2" stroke-linecap="round"/>`,
      lancha:`<path d="M-17 -5 H17 Q15 4 9 5 H-14Z" fill="#2f8fc2" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><rect x="-6" y="-13" width="12" height="8" rx="2" fill="#fffaf0" stroke="${INK}" stroke-width="1.8"/><path d="M-30 2 h10 M-32 -2 h8" stroke="#fffaf0" stroke-width="2" stroke-linecap="round"/>`,
      fish:`<path d="M-14 4 q14 -26 28 0" fill="none" stroke="#fffaf0" stroke-width="2" stroke-dasharray="2 4" stroke-linecap="round"/><g transform="translate(2 -12) rotate(20)"><path d="M-8 0 q8 -7 14 0 q-6 7 -14 0Z M6 0 l5 -4 v8Z" fill="#f2b630" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="-3.5" cy="-1" r="1.1" fill="${INK}"/></g><path d="M-16 5 q2 -3 4 0 M12 5 q2 -3 4 0" fill="none" stroke="#fffaf0" stroke-width="1.6" stroke-linecap="round"/>`,
      swirl:`<path d="M-14 0 q7 -6 14 0 t14 0" fill="none" stroke="#fffaf0" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`,
      duck:`<path d="M-9 0 q0 -8 9 -8 q4 0 6 -3 q1 -6 6 -5 q4 1 3 5 l4 1 l-4 2 q-1 6 -7 8Z" fill="#fffaf0" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round"/><circle cx="13" cy="-13" r="1" fill="${INK}"/><path d="M-12 3 q3 -2 6 0 t6 0" fill="none" stroke="#fffaf0" stroke-width="1.6"/>`,
      umb:`<ellipse cx="0" cy="0" rx="12" ry="3" fill="${INK}" opacity=".2"/><path d="M0 0 V-20" stroke="${INK}" stroke-width="1.8"/><path d="M-14 -18 Q0 -34 14 -18 Q7 -21 0 -18 Q-7 -21 -14 -18Z" fill="var(--uc,#e8603c)" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-6 -24 Q0 -32 0 -18" fill="#fffaf0" opacity=".75"/>`,
      towel:`<rect x="-9" y="-4" width="18" height="8" rx="1.5" fill="var(--uc,#2f8fc2)" stroke="${INK}" stroke-width="1.5" transform="rotate(-12)"/><path d="M-6 -3 v6 M-2 -3 v6" stroke="#fffaf0" stroke-width="1.6" transform="rotate(-12)"/>`,
      castle:`<path d="M-9 0 V-8 h3 v-3 h3 v3 h3 v-3 h3 v3 h3 V0Z" fill="#e9c77a" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/><path d="M0 -11 V-17 l5 2 -5 2" fill="#e8603c" stroke="${INK}" stroke-width="1.2"/>`,
      ball:`<circle cx="0" cy="-4" r="4" fill="#fffaf0" stroke="${INK}" stroke-width="1.3"/><path d="M-4 -4 h8 M0 -8 v8" stroke="#e8603c" stroke-width="1.6"/>`
    };
    Object.entries(S).forEach(([k,v])=>{const s=el("symbol",{id:"mp-d-"+k,overflow:"visible"},defs);s.innerHTML=v});

    // generador aleatorio con semilla: siempre el mismo dibujo
    let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
    const inPoly=(x,y,p)=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,yi]=p[i],[xj,yj]=p[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
    const bb=p=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;p.forEach(([x,y])=>{a=Math.min(a,x);b=Math.min(b,y);c=Math.max(c,x);d=Math.max(d,y)});return [a,b,c,d]};
    const inside=(x,y,poly,box)=>x>=box[0]&&x<=box[2]&&y>=box[1]&&y<=box[3]&&inPoly(x,y,poly);
    const riverBB=bb(D.river), isl=D.islands.map(p=>[p,bb(p)]);
    const lakes=D.areas.filter(a=>a[0]==="water").map(a=>[a[1],bb(a[1])]);
    const beaches=D.areas.filter(a=>a[0]==="beach").map(a=>[a[1],bb(a[1])]);
    const busy=D.areas.filter(a=>a[0]==="pitch"||a[0]==="park").map(a=>[a[1],bb(a[1])]);
    const onIsland=(x,y)=>isl.some(([p,b])=>inside(x,y,p,b));
    const isWater=(x,y)=>(inside(x,y,D.river,riverBB)&&!onIsland(x,y))||lakes.some(([p,b])=>inside(x,y,p,b));
    // grilla de calles para medir distancia
    const C=60,grid=new Map(),key=(i,j)=>i+","+j;
    D.roads.forEach(r=>{for(let i=1;i<r.p.length;i++){const [x1,y1]=r.p[i-1],[x2,y2]=r.p[i];const n=Math.max(1,Math.ceil(Math.hypot(x2-x1,y2-y1)/20));
      for(let t=0;t<=n;t++){const x=x1+(x2-x1)*t/n,y=y1+(y2-y1)*t/n,k=key(Math.floor(x/C),Math.floor(y/C));(grid.get(k)||grid.set(k,[]).get(k)).push(x,y)}}});
    const nearRoad=(x,y,d)=>{const i=Math.floor(x/C),j=Math.floor(y/C);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const L=grid.get(key(i+a,j+b));if(!L)continue;for(let q=0;q<L.length;q+=2){const dx=L[q]-x,dy=L[q+1]-y;if(dx*dx+dy*dy<d*d)return true}}return false};
    const nearPOI=(x,y)=>POIS.some(p=>p.lod<3&&Math.abs(p.x-x)<110&&Math.abs(p.y-y)<90);
    // ruido suave para agrupar montes y potreros
    const hash=(i,j)=>{let h=i*374761393+j*668265263;h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))>>>0)/4294967295};
    const noise=(x,y)=>{const s=520,i=Math.floor(x/s),j=Math.floor(y/s),fx=x/s-i,fy=y/s-j,u=fx*fx*(3-2*fx),w=fy*fy*(3-2*fy);
      const a=hash(i,j),b=hash(i+1,j),c=hash(i,j+1),d=hash(i+1,j+1);return a+(b-a)*u+(c-a)*w+(a-b-c+d)*u*w};

    const items=[]; // [y, symbol, x, scale, color, lod]
    const add=(sym,x,y,s,col,lod)=>items.push([y,sym,x,s,col||"",lod||0]);
    // campo
    const ST=135;
    for(let gy=ST/2;gy<H;gy+=ST)for(let gx=ST/2;gx<W;gx+=ST){
      const x=gx+(rnd()-.5)*ST*.8,y=gy+(rnd()-.5)*ST*.8;
      if(isWater(x,y)||nearRoad(x,y,40)||nearPOI(x,y)||busy.some(([p,b])=>inside(x,y,p,b)))continue;
      const n=noise(x,y),r=rnd(),island=onIsland(x,y);
      if(island||n>.62){ // monte: árboles agrupados
        add(r<.5?"tree":r<.75?"ombu":"bush",x,y,1+rnd()*.5,"",r<.6?0:2);
        if(rnd()<.45){const x2=x+(rnd()-.5)*50,y2=y+(rnd()-.5)*40;if(!isWater(x2,y2)&&!nearRoad(x2,y2,30))add(rnd()<.6?"tree":"pine",x2,y2,.8+rnd()*.4,"",2)}
      }else if(n>.4){ // potrero con vacas
        if(r<.32){const k=1+Math.floor(rnd()*3);for(let c=0;c<k;c++){const x2=x+(rnd()-.5)*55,y2=y+(rnd()-.5)*30;if(!isWater(x2,y2)&&!nearRoad(x2,y2,25))add(rnd()<.55?"cow":"cowb",x2,y2,.95+rnd()*.25,"",c?2:0)}}
        else if(r<.5)add("hay",x,y,1+rnd()*.3,"",0);
        else if(r<.8)add("grass",x,y,1.2+rnd()*.5,"",2);
        else add("tree",x,y,1+rnd()*.4,"",2);
      }else{ // pastizal
        if(r<.45)add("grass",x,y,1.2+rnd()*.6,"",2);
        else if(r<.6)add("flowers",x,y,1.1,"",3);
        else if(r<.75)add("bush",x,y,1,"",2);
        else if(r<.85)add("hay",x,y,1,"",2);
      }
    }
    // río
    const RS=230;
    for(let gy=RS/2;gy<H;gy+=RS)for(let gx=RS/2;gx<W;gx+=RS){
      const x=gx+(rnd()-.5)*RS*.7,y=gy+(rnd()-.5)*RS*.7;
      if(!inside(x,y,D.river,riverBB)||onIsland(x,y))continue;
      // lejos de la costa: el punto y sus alrededores son agua
      if(![[40,0],[-40,0],[0,40],[0,-40]].every(([a,b])=>isWater(x+a,y+b)))continue;
      const r=rnd();
      if(r<.22)add("boat",x,y,1.3,"",0);else if(r<.38)add("lancha",x,y,1.2,"",0);else if(r<.55)add("fish",x,y,1.1,"",2);else if(r<.68)add("duck",x,y,1,"",2);else add("swirl",x,y,1.4,"",0);
    }
    // playas
    const UC=["#e8603c","#2f8fc2","#f2b630","#5aa85b","#d9434b"];
    beaches.forEach(([p,b])=>{const area=(b[2]-b[0])*(b[3]-b[1]);const n=Math.min(40,Math.max(3,Math.round(area/2200)));
      for(let t=0,got=0;t<n*6&&got<n;t++){const x=b[0]+rnd()*(b[2]-b[0]),y=b[1]+rnd()*(b[3]-b[1]);if(!inPoly(x,y,p))continue;got++;
        const r=rnd(),c=UC[Math.floor(rnd()*UC.length)];
        if(r<.45)add("umb",x,y,.9,c,0);else if(r<.75)add("towel",x,y,.9,c,2);else if(r<.88)add("castle",x,y,.9,"",3);else add("ball",x,y,.9,"",3)}});

    // dibujar, ordenado de arriba hacia abajo para que se superpongan bien
    items.sort((a,b)=>a[0]-b[0]);
    const layers=[0,2,3].map(l=>el("g",{class:l?"deco l"+l:"deco","pointer-events":"none"},decoG));
    items.forEach(([y,sym,x,s,col,lod])=>{const u=el("use",{href:"#mp-d-"+sym,transform:`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})`},layers[lod===3?2:lod===2?1:0]);if(col)u.style.setProperty("--uc",col)});
  })();

  const poiG=el("g",{},world);
  const nodes=[];
  function addNode(p){
    const g=el("g",{class:"poi"+(p.lod>1?" l"+p.lod:""),tabindex:0,role:"button","aria-label":p.name},poiG);
    g.dataset.y=p.y;
    const col=CATS[p.cat].color;
    g.innerHTML=(p.art?ART[p.art]():pin(col,p.g))+`<text class="plbl${p.art?"":" l"+(p.lab||3)}" y="${p.art?26:18}"></text>`;
    g.querySelector("text.plbl").textContent=p.name;
    g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openSheet(p)}});
    const n={g,p,t:g.querySelector("text.plbl")};nodes.push(n);return n;
  }
  POIS.sort((a,b)=>a.y-b.y).forEach(addNode);

  /* ---------- lugares de la API de Colón 360 (ubicación exacta por lat/lng) ---------- */
  const CATMAP={Playa:"agua",Hotel:"aloj","Rest.":"comer","Café":"comer","Atracción":"atr",Deporte:"atr",Salud:"salud"};
  let apiNodes=[];
  function setLugares(list){
    apiNodes.forEach(n=>{n.g.remove();nodes.splice(nodes.indexOf(n),1)});apiNodes=[];
    nodes.forEach(n=>{if(n.oculto){n.g.style.display="";n.oculto=false}n.p.item=null});
    (list||[]).forEach(l=>{
      if(l.lat==null||l.lng==null||l.lat===""||l.lng==="")return;
      const lat=+l.lat,lng=+l.lng;if(!Number.isFinite(lat)||!Number.isFinite(lng))return;
      const [x,y]=ll2xy(lat,lng);if(x<0||y<0||x>W||y>H)return;
      const nn=norm(l.label),twin=nodes.find(n=>norm(n.p.name)===nn);
      if(twin&&twin.p.art){twin.p.item=l.item||null;return}   // ya tiene dibujo: solo le sumamos la ficha
      if(twin){twin.g.style.display="none";twin.oculto=true}  // reemplaza al dato de OpenStreetMap
      const p={name:l.label,cat:CATMAP[l.cat]||"atr",lod:2,x,y,g:"★",api:true,item:l.item||null,
        desc:l.address?"Dirección: "+l.address:"Lugar de la guía Colón 360.",tags:["En la guía Colón 360"]};
      apiNodes.push(addNode(p));
    });
    [...poiG.children].sort((a,b)=>(+a.dataset.y||0)-(+b.dataset.y||0)).forEach(g=>poiG.appendChild(g));
    nodes.forEach(n=>n.g.classList.toggle("off",!on.has(n.p.cat)));
    lastK=-1;if(vc)commit();
  }

  /* ---------- vista: pan y zoom ----------
     Durante el gesto solo movemos la imagen ya dibujada (transform CSS por GPU, muy rápido).
     Cuando el dedo se queda quieto, redibujamos el mapa nítido con el nivel de detalle que corresponde. */
  let v={tx:0,ty:0,k:.3};
  const L2=.55,L3=1.1,L4=2.2,KMAX=5;
  const app=$id("app");
  const vw=()=>app.clientWidth, vh=()=>app.clientHeight;
  const kMin=()=>Math.min(vw()/W,vh()/H)*.9;
  let lastK=-1,vc=null,OX=0,OY=0,cTimer=0;
  function layout(){OX=Math.round(vw()*.35);OY=Math.round(vh()*.35);
    Object.assign(svg.style,{left:-OX+"px",top:-OY+"px",right:"auto",bottom:"auto",width:vw()+2*OX+"px",height:vh()+2*OY+"px",transformOrigin:OX+"px "+OY+"px"})}
  function clampV(){const m=200, ww=W*v.k, hh=H*v.k;
    v.tx=ww+2*m<vw()?(vw()-ww)/2:Math.min(m,Math.max(vw()-ww-m,v.tx));
    v.ty=hh+2*m<vh()?(vh()-hh)/2:Math.min(m,Math.max(vh()-hh-m,v.ty))}
  function commit(){clearTimeout(cTimer);vc={...v};
    world.setAttribute("transform",`translate(${v.tx+OX} ${v.ty+OY}) scale(${v.k})`);
    svg.style.transform="";
    if(v.k!==lastK){lastK=v.k;rescale()}}
  function apply(now){clampV();
    if(!vc||now){commit();return}
    const a=v.k/vc.k,bx=v.tx-a*vc.tx,by=v.ty-a*vc.ty;
    const covered=a*-OX+bx<=0&&a*(vw()+OX)+bx>=vw()&&a*-OY+by<=0&&a*(vh()+OY)+by>=vh();
    if(!covered||a>2.6||a<.4){commit();return}
    svg.style.transform=`translate3d(${bx}px,${by}px,0) scale(${a})`;
    clearTimeout(cTimer);cTimer=setTimeout(commit,pts.size?220:120)}
  function rescale(){
    const k=v.k;
    svg.classList.toggle("z2",k>=L2&&k<L3);svg.classList.toggle("z3",k>=L3&&k<L4);svg.classList.toggle("z4",k>=L4);
    const z1=k<L2;if(k>=L2)$id("lvl").hidden=true;
    // calles: ancho real en metros, con un mínimo en pantalla
    casing.forEach(([c,e])=>{const r=RCLS[c];const f=Math.max(r.m/U,r.min/k);e.setAttribute("stroke-width",f+Math.max(2.2/k,1.5));e.setAttribute("stroke-opacity",c>=3?.35:z1&&c===2?.5:1)});
    filling.forEach(([c,e])=>{const r=RCLS[c];e.setAttribute("stroke-width",Math.max(r.m/U,r.min/k));if(r.dash)e.setAttribute("stroke-dasharray",`${6/k} ${4/k}`)});
    const bw=Math.max(14/U,5/k);brC.setAttribute("stroke-width",bw+3.5/k);brF.setAttribute("stroke-width",bw);brDash.setAttribute("stroke-width",bw*.35);brDash.setAttribute("stroke-dasharray",`${2/k} ${6/k}`);
    streamPaths.forEach(e=>e.setAttribute("stroke-width",Math.max(+e.dataset.w,+e.dataset.min/k)));
    labelG.setAttribute("font-size",11/k);labelG.setAttribute("stroke-width",3.2/k);
    aTexts.forEach(e=>e.setAttribute("font-size",(+e.dataset.px)*Math.max(1,Math.pow(k/.3,.25))/k));
    // íconos: crecen un poco con el zoom, pero sin tapar el mapa
    const art=Math.min(160,80*Math.pow(k/.3,.35)), pinPx=Math.min(38,24*Math.pow(k/.3,.2));
    nodes.forEach(({g,p,t})=>{const px=p.art?art*(p.sz||1):p.cat==="aloj"?pinPx*(k<L4?.68:.9):pinPx;const s=px/(p.art?200:40)/k;
      g.setAttribute("transform",`translate(${p.x} ${p.y}) scale(${s})`);
      const fs=(p.art?13:11.5)/(s*k);t.setAttribute("font-size",fs);t.setAttribute("stroke-width",4/(s*k));});
    sizeMe();
    // escala gráfica
    const target=90/k*U;const nice=[20,50,100,200,500,1000,2000,5000].find(n=>n>=target*.6)||5000;
    $id("scaleBar").style.width=(nice/U*k)+"px";
    $id("scaleTxt").textContent=nice>=1000?(nice/1000)+" km":nice+" m";
  }
  const rectOf=()=>app.getBoundingClientRect();
  function zoomAt(cx,cy,f){const r=rectOf(),px=cx-r.left,py=cy-r.top;const nk=Math.min(KMAX,Math.max(kMin(),v.k*f));f=nk/v.k;
    v.tx=px-(px-v.tx)*f;v.ty=py-(py-v.ty)*f;v.k=nk;apply()}
  function flyTo(x,y,k,done){const s={...v},e={k,tx:vw()/2-x*k,ty:vh()*.42-y*k};const t0=performance.now(),D=reduce?0:550;
    (function step(t){const u=D?Math.min(1,(t-t0)/D):1,q=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
      const lk=Math.exp(Math.log(s.k)+(Math.log(e.k)-Math.log(s.k))*q);
      // mantener el punto destino interpolado en pantalla
      const cx0=(vw()/2-s.tx)/s.k,cy0=(vh()*.42-s.ty)/s.k,cx=cx0+(x-cx0)*q,cy=cy0+(y-cy0)*q;
      v.k=lk;v.tx=vw()/2-cx*lk;v.ty=vh()*.42-cy*lk;apply(u>=1);if(u<1)requestAnimationFrame(step);else if(done)done()})(t0)}
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  svg.addEventListener("wheel",e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*.0016))},{passive:false});
  const pts=new Map();let last=null,moved=false,pinch=null,downT=null;
  svg.addEventListener("pointerdown",e=>{downT=e.target;pts.set(e.pointerId,[e.clientX,e.clientY]);moved=false;
    if(pts.size===1){last=[e.clientX,e.clientY];svg.classList.add("drag")}
    if(pts.size===2){const [a,b]=[...pts.values()];pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]),k:v.k};moved=true}});
  svg.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===2&&pinch){const [a,b]=[...pts.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);zoomAt((a[0]+b[0])/2,(a[1]+b[1])/2,pinch.k*d/pinch.d/v.k);return}
    if(pts.size===1&&last){const dx=e.clientX-last[0],dy=e.clientY-last[1];if(Math.abs(dx)+Math.abs(dy)>3){moved=true;try{svg.setPointerCapture(e.pointerId)}catch(_){}}
      if(moved){v.tx+=dx;v.ty+=dy;apply()}last=[e.clientX,e.clientY]}});
  function up(e){if(pts.size<=1){clearTimeout(cTimer);cTimer=setTimeout(commit,60)}
    if(e.type==="pointerup"&&!moved&&pts.size===1){const g=downT&&downT.closest&&downT.closest(".poi");
      if(g&&!g.classList.contains("off"))openSheet(nodes[nodesIndex(g)].p);else closeSheet()}
    pts.delete(e.pointerId);if(pts.size<2)pinch=null;if(pts.size===1)last=[...pts.values()][0];else{last=null;svg.classList.remove("drag")}}
  const nodesIndex=g=>nodes.findIndex(n=>n.g===g);
  svg.addEventListener("pointerup",up);svg.addEventListener("pointercancel",up);
  svg.addEventListener("dblclick",e=>zoomAt(e.clientX,e.clientY,2));
  const ctr=()=>{const r=rectOf();return [r.left+r.width/2,r.top+r.height/2]};
  $id("zin").onclick=()=>zoomAt(...ctr(),1.7);
  $id("zout").onclick=()=>zoomAt(...ctr(),1/1.7);
  $id("zhome").onclick=()=>flyTo(3150,2760,homeK());
  const homeK=()=>Math.max(kMin(),Math.min(.9,Math.min(vw(),vh()*1.1)/1500));

  /* ---------- ficha ---------- */
  const sheet=$id("sheet");
  function openSheet(p){const c=CATS[p.cat];
    const ic=$id("sIc");ic.style.background=c.color;ic.textContent=p.g||c.name[0];
    $id("sCat").textContent=c.name;$id("sName").textContent=p.name;$id("sDesc").textContent=p.desc;
    const tags=p.tags.slice();if(p.approx)tags.push("Ubicación a confirmar");
    $id("sTags").innerHTML=tags.map(x=>`<span class="tag${/destac/i.test(x)?" pro":/confirmar/.test(x)?" warn":""}">${x}</span>`).join("");
    const ver=$id("sVer");ver.hidden=!p.item;ver.onclick=()=>{if(p.item&&opts.onVer)opts.onVer(p.item)};
    const [la,lo]=xy2ll(p.x,p.y);$id("sGo").href=`https://www.google.com/maps/dir/?api=1&destination=${la.toFixed(6)},${lo.toFixed(6)}`;
    sheet.classList.add("open");$id("lvl").hidden=true}
  function closeSheet(){sheet.classList.remove("open")}
  $id("sClose").onclick=closeSheet;

  /* ---------- filtros ---------- */
  const chips=$id("chips"),on=new Set(Object.keys(CATS));
  Object.entries(CATS).forEach(([k,c])=>{const b=document.createElement("button");b.className="chip";b.setAttribute("aria-pressed","true");
    b.innerHTML=`<span class="dot" style="background:${c.color}"></span>${c.name}`;
    b.onclick=()=>{on.has(k)?on.delete(k):on.add(k);b.setAttribute("aria-pressed",on.has(k));nodes.forEach(n=>n.g.classList.toggle("off",!on.has(n.p.cat)))};
    chips.appendChild(b)});

  /* ---------- buscador: lugares, calles y esquinas ("San Martín y 12 de Abril") ---------- */
  const q=$id("q"),res=$id("res");
  var norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\s+/g," ").trim();
  const segsByName={};D.roads.forEach(r=>{if(r.n<0)return;const nm=D.names[r.n];(segsByName[nm]=segsByName[nm]||[]).push(r.p)});
  const STREETS=Object.keys(segsByName).map(name=>({name,n:norm(name),segs:segsByName[name]}));
  const poiIdx=()=>nodes.filter(n=>!n.oculto).map(n=>({p:n.p,n:norm(n.p.name)}));
  const rank=(n,t)=>n===t?0:n.startsWith(t)?1:(" "+n).includes(" "+t)?2:3;
  function findStreets(t){return STREETS.filter(s=>s.n.includes(t)||norm(s.name.replace(/^(avenida|boulevard|boulevar|doctor|pasaje|general|presidente|intendente) /i,"")).includes(t)).sort((a,b)=>rank(a.n,t)-rank(b.n,t)||a.n.length-b.n.length)}
  function dSeg(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;let u=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0;u=Math.max(0,Math.min(1,u));const x=a[0]+u*dx,y=a[1]+u*dy;return [Math.hypot(p[0]-x,p[1]-y),x,y]}
  function corner(A,B){let best=null;
    A.segs.forEach(pa=>B.segs.forEach(pb=>{
      pa.forEach(pt=>{for(let i=1;i<pb.length;i++){const [d,x,y]=dSeg(pt,pb[i-1],pb[i]);if(!best||d<best.d)best={d,x,y}}});
      pb.forEach(pt=>{for(let i=1;i<pa.length;i++){const [d,x,y]=dSeg(pt,pa[i-1],pa[i]);if(!best||d<best.d)best={d,x,y}}});}));
    return best&&best.d<=6?best:null}
  let hl=null,mark=null;
  function clearHl(){if(hl){hl.remove();hl=null}if(mark){mark.remove();mark=null}}
  function showStreet(s){clearHl();hl=el("g",{},roadG);
    s.segs.forEach(p=>el("path",{d:line(p),fill:"none",stroke:"var(--accent)","stroke-width":6,"stroke-linecap":"round","stroke-linejoin":"round","vector-effect":"non-scaling-stroke",opacity:.85},hl));
    const all=s.segs.flat(),xs=all.map(a=>a[0]),ys=all.map(a=>a[1]);const bw=Math.max(...xs)-Math.min(...xs),bh=Math.max(...ys)-Math.min(...ys);
    closeSheet();flyTo((Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2,Math.min(2.5,Math.max(L2,Math.min(vw()*.75/(bw+1),vh()*.5/(bh+1)))))}
  function dropMark(x,y,title,desc){clearHl();
    mark=el("g",{class:"poi",transform:`translate(${x} ${y})`},poiG);mark.innerHTML=pin("#e8603c","●");
    const p={name:title,cat:"serv",x,y,g:"📍",desc,tags:["Esquina"]};
    const fit=()=>{const s=34/40/v.k;mark.setAttribute("transform",`translate(${x} ${y}) scale(${s})`)};
    flyTo(x,y,Math.max(v.k,1.6),()=>{fit();openSheet(p)});fit()}
  function render(items,msg){res.innerHTML="";
    if(msg){const m=document.createElement("button");m.disabled=true;m.textContent=msg;res.appendChild(m)}
    items.forEach(it=>{const b=document.createElement("button");b.innerHTML=`<span class="dot" style="background:${it.col}"></span><span></span><small>${it.kind}</small>`;b.children[1].textContent=it.label;
      b.onclick=()=>{res.hidden=true;q.blur();it.go()};res.appendChild(b)});
    res.hidden=!items.length&&!msg}
  q.addEventListener("input",()=>{
    let raw=norm(q.value);if(raw.length<2){res.hidden=true;return}
    // esquina: "calle A y calle B" / "A esquina B" / "A & B"
    const parts=raw.split(/ y | e | esquina | esq\.? | & | \/ /);
    if(parts.length===2&&parts[0].length>1&&parts[1].length>1){
      const As=findStreets(parts[0]).slice(0,4),Bs=findStreets(parts[1]).slice(0,4),out=[];
      As.forEach(a=>Bs.forEach(b=>{if(a===b||out.length>=6)return;const c=corner(a,b);if(c)out.push({label:`${a.name} y ${b.name}`,kind:"Esquina",col:"#e8603c",
        go:()=>dropMark(c.x,c.y,`${a.name} y ${b.name}`,"Esquina ubicada con las calles reales del mapa.")})}));
      render(out,out.length?"":"Esas dos calles no se cruzan. Probá con otra esquina.");return}
    // altura: "San Martín 450" -> mostramos la calle
    let num=null;const mnum=raw.match(/^(.*\D)\s+(\d{1,5})$/);if(mnum){raw=mnum[1].trim();num=mnum[2]}
    const ss=findStreets(raw).slice(0,5).map(s=>({label:s.name,kind:"Calle",col:"#c9b48a",go:()=>showStreet(s)}));
    const ps=poiIdx().filter(x=>x.n.includes(raw)).sort((a,b)=>rank(a.n,raw)-rank(b.n,raw)||(a.p.cat==="aloj")-(b.p.cat==="aloj")||(a.p.lod||3)-(b.p.lod||3)).slice(0,5)
      .map(({p})=>({label:p.name,kind:CATS[p.cat].name,col:CATS[p.cat].color,go:()=>{if(!on.has(p.cat))chips.children[Object.keys(CATS).indexOf(p.cat)].click();clearHl();flyTo(p.x,p.y,Math.max(v.k,p.lod>=3?L3*1.3:L2*1.4),()=>openSheet(p))}}));
    const items=num?[...ss,...ps]:(ps.length&&rank(ps[0].label?norm(ps[0].label):"",raw)<rank(ss[0]?norm(ss[0].label):"zz",raw)?[...ps,...ss]:[...ss,...ps]).slice(0,7);
    render(items.slice(0,7),num&&ss.length?`La altura ${num} todavía no está cargada: te mostramos la calle. Para un punto exacto, buscá la esquina (ej. "12 de Abril y Alem").`:items.length?"":`No encontramos "${q.value}".`)});
  q.addEventListener("keydown",e=>{if(e.key==="Enter"){const b=res.querySelector("button:not([disabled])");if(b)b.click()}if(e.key==="Escape"){res.hidden=true;q.blur()}});
  listen(document,"pointerdown",e=>{if(!e.target.closest(".search"))res.hidden=true});


  /* ---------- mi ubicación (en la app usa el GPS del celular) ---------- */
  let me=null,watch=null;
  function toast(t){const b=$id("lvl");b.textContent=t;b.hidden=false;b.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>{b.hidden=true},4500)}
  function showMe(lat,lon,acc){const [x,y]=ll2xy(lat,lon);
    if(x<0||y<0||x>W||y>H){toast("Estás fuera de la zona del mapa de Colón.");return false}
    if(!me){me=el("g",{},world);me.innerHTML=`<circle class="acc" fill="#2f8fc2" fill-opacity=".15" stroke="#2f8fc2" stroke-opacity=".5"/><circle class="dot" r="1" fill="#2f8fc2" stroke="#fffaf0"/>`}
    me.dataset.x=x;me.dataset.y=y;me.dataset.acc=acc||10;sizeMe();return [x,y]}
  function sizeMe(){if(!me)return;const x=+me.dataset.x,y=+me.dataset.y;
    const a=me.querySelector(".acc"),d=me.querySelector(".dot");a.setAttribute("cx",x);a.setAttribute("cy",y);a.setAttribute("r",Math.max(+me.dataset.acc/U,10/v.k));a.setAttribute("stroke-width",1.5/v.k);
    d.setAttribute("cx",x);d.setAttribute("cy",y);d.setAttribute("r",7/v.k);d.setAttribute("stroke-width",3/v.k)}
  $id("zme").onclick=()=>{
    if(!("geolocation" in navigator)){toast("Tu dispositivo no permite usar la ubicación.");return}
    let first=true;
    try{if(watch!=null)navigator.geolocation.clearWatch(watch);
      watch=navigator.geolocation.watchPosition(pos=>{const r=showMe(pos.coords.latitude,pos.coords.longitude,pos.coords.accuracy);if(r&&first){first=false;flyTo(r[0],r[1],Math.max(v.k,1.6))}},
        ()=>toast("No pudimos ver tu ubicación. Revisá que Colón 360 tenga permiso de ubicación y que el GPS esté prendido."),{enableHighAccuracy:true,maximumAge:5000,timeout:12000})}
    catch(_){toast("No pudimos ver tu ubicación. Revisá que Colón 360 tenga permiso de ubicación y que el GPS esté prendido.")}};

  /* ---------- arranque ---------- */
  function start(){layout();v.k=homeK();v.tx=vw()/2-3150*v.k;v.ty=vh()*.5-2760*v.k;lastK=-1;apply(true)}
  listen(window,"resize",()=>{layout();lastK=-1;apply(true)});
  const startRaf=requestAnimationFrame(start);

  // botones propios de la app
  $id("back").onclick = () => opts.onVolver && opts.onVolver();
  if (opts.onMapaReal) {
    const b = document.createElement("button");
    b.className = "chip alt";
    b.textContent = "Ver mapa real";
    b.onclick = () => opts.onMapaReal();
    chips.appendChild(b);
  }
  if (opts.lugares) setLugares(opts.lugares);

  return {
    setLugares,
    destroy() {
      offs.forEach((f) => f());
      cancelAnimationFrame(startRaf);
      clearTimeout(cTimer);
      try { if (watch != null) navigator.geolocation.clearWatch(watch); } catch (_) {}
      root.innerHTML = "";
    },
  };
}
