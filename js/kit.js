/* =========================================================
   Capylum — boîte à outils 3D partagée (rue du mois + maison)
   Un seul moteur WebGL est partagé entre les deux écrans.
   ========================================================= */
const KIT=(()=>{
  let renderer=null,failed=false;
  function getRenderer(){
    if(renderer||failed)return renderer;
    if(!window.THREE){failed=true;return null}
    try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'})}catch(e){failed=true;return null}
    if(!renderer.getContext()){renderer=null;failed=true;return null}
    const mobile=matchMedia('(pointer:coarse)').matches||innerWidth<760;
    renderer.setPixelRatio(Math.min(mobile?1.6:2,window.devicePixelRatio||1));
    renderer.setClearColor(0x000000,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.domElement.style.display='block';renderer.domElement.style.width='100%';renderer.domElement.style.height='100%';
    return renderer;
  }
  function attach(el){const r=getRenderer();if(!r)return null;if(r.domElement.parentNode!==el)el.appendChild(r.domElement);
    const w=el.clientWidth||innerWidth,h=el.clientHeight||innerHeight;r.setSize(w,h,false);return r}

  /* ---------- Matériaux et formes ---------- */
  const MAT={};
  const M=c=>MAT[c]||(MAT[c]=new THREE.MeshLambertMaterial({color:c}));
  const mat=c=>(c&&c.isMaterial)||Array.isArray(c)?c:M(c);
  const sh=m=>{m.castShadow=true;m.receiveShadow=true;return m};
  function box(p,w,h,d,c,x=0,y=0,z=0){const m=sh(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)));m.position.set(x,y+h/2,z);p.add(m);return m}
  function cyl(p,rt,rb,h,c,x=0,y=0,z=0,seg=16){const m=sh(new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat(c)));m.position.set(x,y+h/2,z);p.add(m);return m}
  function cone(p,r,h,c,x=0,y=0,z=0,seg=8){const m=sh(new THREE.Mesh(new THREE.ConeGeometry(r,h,seg),mat(c)));m.position.set(x,y+h/2,z);p.add(m);return m}
  function ball(p,r,c,x=0,y=0,z=0,seg=12){const m=sh(new THREE.Mesh(new THREE.SphereGeometry(r,seg,Math.max(6,seg*.75|0)),mat(c)));m.position.set(x,y,z);p.add(m);return m}
  function flat(p,w,d,c,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(c));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;p.add(m);return m}
  function roof(p,r,h,c,x=0,y=0,z=0){const m=sh(new THREE.Mesh(new THREE.ConeGeometry(r,h,4),mat(c)));m.position.set(x,y+h/2,z);m.rotation.y=Math.PI/4;p.add(m);return m}
  const chrome=c=>new THREE.MeshPhongMaterial({color:c,specular:0x888888,shininess:80});
  const glass=()=>new THREE.MeshPhongMaterial({color:'#BFE3F5',specular:0xffffff,shininess:110,transparent:true,opacity:.85});

  /* ---------- Textes (enseignes, étiquettes) ---------- */
  function cvs(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
  function textCanvas(text,{bg='#fff',fg='#2F3142',w=512,h=128,radius=0,border=null}={}){
    return cvs(w,h,(g,W,H)=>{
      if(bg){g.fillStyle=bg;if(radius){const r=radius;g.beginPath();g.moveTo(r,0);g.arcTo(W,0,W,H,r);g.arcTo(W,H,0,H,r);g.arcTo(0,H,0,0,r);g.arcTo(0,0,W,0,r);g.fill();
        if(border){g.lineWidth=8;g.strokeStyle=border;g.stroke()}}else g.fillRect(0,0,W,H)}
      let fs=Math.round(H*.56);const font=s=>`900 ${s}px Nunito, "Segoe UI Emoji", "Apple Color Emoji", Arial, sans-serif`;g.font=font(fs);
      while(g.measureText(text).width>W*.88&&fs>10){fs-=3;g.font=font(fs)}
      g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';g.fillText(text,W/2,H/2+fs*.05)});
  }
  function signPlane(p,text,bg,fg,w,h,x=0,y=0,z=0,ry=0){
    const t=new THREE.CanvasTexture(textCanvas(text,{bg,fg,w:512,h:Math.max(64,Math.round(512*h/w))}));
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));m.position.set(x,y,z);m.rotation.y=ry;p.add(m);return m}
  function label(text,opts={}){
    const w=opts.w||512,h=opts.h||128;
    const t=new THREE.CanvasTexture(textCanvas(text,{bg:'bg' in opts?opts.bg:'#fff',fg:opts.fg||'#2F3142',w,h,radius:opts.radius??46,border:opts.border||null}));
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));const sc=opts.scale||1.6;s.scale.set(sc*w/h,sc,1);return s}
  function emojiSprite(e,size=1){const s=label(e,{bg:null,w:128,h:128,scale:size});return s}

  /* ---------- Le personnage (même look que dans la ville) ---------- */
  function hero(c){
    c=c||(typeof DEF_CHAR!=='undefined'?DEF_CHAR:null)||{skin:'#F1C9A5',hair:'#3B2A20',style:'court',top:'#E0605F'};
    const g=new THREE.Group(),legs=[],arms=[];const sk=c.skin,hr=c.hair;
    [-.21,.21].forEach(s=>{const L=new THREE.Group();L.position.set(s,1.05,0);box(L,.33,.9,.36,'#34495E',0,-.95,0);box(L,.36,.18,.52,'#2F3142',0,-1.05,.06);g.add(L);legs.push(L)});
    cyl(g,.42,.47,1.05,c.top,0,1.02,0,14);
    [-1,1].forEach(s=>{const a=new THREE.Group();a.position.set(s*.56,1.95,0);cyl(a,.13,.12,.82,c.top,0,-.82,0,8);ball(a,.14,sk,0,-.92,0,10);a.rotation.z=s*.12;g.add(a);arms.push(a)});
    cyl(g,.15,.15,.2,sk,0,2.05,0,8);
    ball(g,.5,sk,0,2.68,0,20);
    [-.18,.18].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.065,8,6),M('#2F3142'));e.position.set(s,2.72,.46);g.add(e);
      const ck=new THREE.Mesh(new THREE.SphereGeometry(.08,8,6),M('#F28B82'));ck.position.set(s*1.5,2.57,.4);ck.scale.set(1,.6,.4);g.add(ck)});
    const cap=sh(new THREE.Mesh(new THREE.SphereGeometry(.53,20,14,0,Math.PI*2,0,Math.PI*.52),M(hr)));cap.position.y=2.7;cap.rotation.x=-.18;g.add(cap);
    if(c.style==='long')box(g,.95,.95,.32,hr,0,1.95,-.3);
    if(c.style==='chignon')ball(g,.24,hr,0,3.25,-.25,12);
    if(c.style==='boucle')for(let k=0;k<12;k++){const t=k/12*Math.PI*2;ball(g,.2,hr,Math.cos(t)*.48,2.95+Math.sin(k)*.08,Math.sin(t)*.48-.05,8)}
    const shadow=new THREE.Mesh(new THREE.CircleGeometry(.8,24),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.16,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.02;g.add(shadow);
    const api={g,legs,arms,
      walk(t,k){const s=Math.sin(t*11)*.65*k;legs[0].rotation.x=s;legs[1].rotation.x=-s;arms[0].rotation.x=-s*.8;arms[1].rotation.x=s*.8},
      idle(t){legs[0].rotation.x=legs[1].rotation.x=0;arms[0].rotation.x=Math.sin(t*2.2)*.12;arms[1].rotation.x=-Math.sin(t*2.2)*.12;arms[1].rotation.z=.12},
      wave(t){arms[1].rotation.z=-1.9-Math.sin(t*12)*.35}};
    return api;
  }

  /* ---------- Petit nuage cartoon ---------- */
  function cloud(p,x,y,z,s=1){const g=new THREE.Group();const m=new THREE.MeshLambertMaterial({color:'#FFFFFF',flatShading:true});
    for(let j=0;j<4;j++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry((1.2+Math.random()*.8)*s,0),m);b.position.set((j-1.5)*1.5*s,Math.random()*.4,Math.random()*.6);b.scale.y=.65;g.add(b)}
    g.position.set(x,y,z);p.add(g);return g}

  /* ---------- Arbre ---------- */
  function tree(p,x,z,s=1,round){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);
    cyl(g,.13,.17,.8,'#7A5236',0,0,0,6);
    if(round){const b=sh(new THREE.Mesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshLambertMaterial({color:['#4E8F3A','#5DA046','#7FB24F'][Math.floor(Math.random()*3)],flatShading:true})));b.position.y=1.6;g.add(b)}
    else cone(g,.9,2.4,'#2F6B3A',0,.6,0,7);
    p.add(g);return g}

  return{getRenderer,attach,M,mat,sh,box,cyl,cone,ball,flat,roof,chrome,glass,cvs,textCanvas,signPlane,label,emojiSprite,hero,cloud,tree};
})();
