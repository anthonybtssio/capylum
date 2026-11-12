/* =========================================================
   Capylum — MA MAISON (style Animal Crossing)
   On se promène dans sa maison, on achète des meubles avec
   l'argent gagné, on décore, et l'ordinateur ouvre la bourse.
   ========================================================= */
const HN=8,HT=1.5;
const FURN={
 desk:{n:'Bureau + ordinateur',ic:'🖥️',p:0,cat:'Bureau',w:2,d:1,act:'pc',fixed:1},
 bed1:{n:'Lit simple',ic:'🛏️',p:150,cat:'Chambre',w:1,d:2,act:'bed'},
 bed2:{n:'Grand lit douillet',ic:'🛏️',p:450,cat:'Chambre',w:2,d:2,act:'bed'},
 night:{n:'Table de chevet',ic:'🕯️',p:40,cat:'Chambre',w:1,d:1},
 wardrobe:{n:'Armoire',ic:'🚪',p:220,cat:'Chambre',w:2,d:1},
 teddy:{n:'Peluche géante',ic:'🧸',p:15,cat:'Chambre',w:1,d:1,act:'hug'},
 sofa:{n:'Canapé',ic:'🛋️',p:380,cat:'Salon',w:2,d:1,act:'sit'},
 armchair:{n:'Fauteuil',ic:'💺',p:120,cat:'Salon',w:1,d:1,act:'sit'},
 pouf:{n:'Pouf',ic:'🟠',p:20,cat:'Salon',w:1,d:1,act:'sit'},
 ctable:{n:'Table basse',ic:'🪵',p:60,cat:'Salon',w:1,d:1},
 tv:{n:'Grande télé',ic:'📺',p:400,cat:'Salon',w:2,d:1,act:'tv'},
 rug:{n:'Tapis rond',ic:'🟣',p:45,cat:'Salon',w:2,d:2,flat:1},
 shelf:{n:'Bibliothèque',ic:'📚',p:160,cat:'Salon',w:2,d:1,act:'book'},
 fire:{n:'Cheminée',ic:'🔥',p:800,cat:'Salon',w:2,d:1,act:'fire'},
 table:{n:'Table + 2 chaises',ic:'🍽️',p:180,cat:'Cuisine',w:2,d:2},
 fridge:{n:'Frigo',ic:'🧊',p:350,cat:'Cuisine',w:1,d:1,act:'fridge'},
 kitchen:{n:'Coin cuisine',ic:'🍳',p:600,cat:'Cuisine',w:2,d:1,act:'cook'},
 plant:{n:'Plante verte',ic:'🪴',p:25,cat:'Déco',w:1,d:1},
 palm:{n:'Palmier en pot',ic:'🌴',p:70,cat:'Déco',w:1,d:1},
 lamp:{n:'Lampadaire',ic:'💡',p:35,cat:'Déco',w:1,d:1},
 nlight:{n:'Veilleuse étoile',ic:'⭐',p:12,cat:'Déco',w:1,d:1},
 aquarium:{n:'Aquarium',ic:'🐠',p:250,cat:'Déco',w:2,d:1,act:'fish'},
 trophy:{n:'Coupe en or',ic:'🏆',p:2000,cat:'Déco',w:1,d:1,act:'trophy'},
 console:{n:'Console + pouf gamer',ic:'🎮',p:300,cat:'Loisirs',w:1,d:1,act:'game'},
 arcade:{n:'Borne d’arcade',ic:'🕹️',p:900,cat:'Loisirs',w:1,d:1,act:'game'},
 guitar:{n:'Guitare',ic:'🎸',p:180,cat:'Loisirs',w:1,d:1,act:'music'},
 piano:{n:'Piano',ic:'🎹',p:1500,cat:'Loisirs',w:2,d:1,act:'music'},
 babyfoot:{n:'Baby-foot',ic:'⚽',p:450,cat:'Loisirs',w:2,d:1,act:'game'},
 cat:{n:'Panier + chat',ic:'🐱',p:200,cat:'Animaux',w:1,d:1,act:'cat'},
 dog:{n:'Niche + chien',ic:'🐶',p:250,cat:'Animaux',w:1,d:1,act:'dog'},
};
const HSTYLE={
 wp0:{n:'Mur crème',t:'wall',c:'#F3E9DA',p:0},wp1:{n:'Mur bleu ciel',t:'wall',c:'#CFE3F5',p:60},wp2:{n:'Mur rose',t:'wall',c:'#F8D7DA',p:60},
 wp3:{n:'Mur vert sauge',t:'wall',c:'#D7EBD0',p:60},wp4:{n:'Papier peint rayé',t:'wall',c:'#FFF4D6',st:'#F7C948',p:120},wp5:{n:'Mur bleu nuit',t:'wall',c:'#2F3A5C',p:90},
 fl0:{n:'Parquet clair',t:'floor',c:'#D9B48A',st:'#C9A077',p:0},fl1:{n:'Carrelage damier',t:'floor',c:'#F4F4F4',st:'#2F3142',p:120},fl2:{n:'Moquette lavande',t:'floor',c:'#C9B8E8',p:90},
 fl3:{n:'Marbre',t:'floor',c:'#EDEDF2',st:'#D4D6DE',p:400},fl4:{n:'Gazon synthétique',t:'floor',c:'#7FBF5A',st:'#6EAE4B',p:70},
};
const HCATS=['Salon','Chambre','Cuisine','Bureau','Déco','Loisirs','Animaux','Murs & sols'];
function hState(){
  if(!G.home)G.home={items:[{id:'desk',i:0,j:0,r:0},{id:'bed1',i:7,j:0,r:0},{id:'plant',i:2,j:0,r:0},{id:'rug',i:3,j:4,r:0}],wall:'wp0',floor:'fl0',owned:['wp0','fl0'],inv:[]};
  return G.home;
}
const fp=(it)=>{const f=FURN[it.id];return it.r%2?[f.d,f.w]:[f.w,f.d]};
function homeValue(){const H=G.home;if(!H)return 0;return[...H.items.map(x=>x.id),...H.inv].reduce((a,id)=>a+Math.round((FURN[id]?FURN[id].p:0)*.5),0)}
function fits(id,i,j,r,skip){
  const f=FURN[id],[w,d]=r%2?[f.d,f.w]:[f.w,f.d];if(i<0||j<0||i+w>HN||j+d>HN)return false;if(f.flat)return true;
  return!hState().items.some((it,k)=>{if(k===skip||FURN[it.id].flat)return false;const[w2,d2]=fp(it);return i<it.i+w2&&it.i<i+w&&j<it.j+d2&&it.j<j+d});
}
function freeSpot(id){for(const r of[0,1])for(let j=0;j<HN;j++)for(let i=0;i<HN;i++)if(fits(id,i,j,r))return{i,j,r};return null}

/* =========================================================
   CONSTRUCTION DES MEUBLES (centrés, face vers +z)
   ========================================================= */
function buildFurn(id){
  const k=KIT,g=new THREE.Group(),f=FURN[id];const W=f.w*HT,D=f.d*HT;g.userData.anim=null;
  const wood='#B9875A',dark='#6B4A33';
  const legs=(w,d,h,c)=>[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>k.box(g,.1,h,.1,c,a*(w/2-.1),0,b*(d/2-.1)));
  switch(id){
   case'desk':{k.box(g,W-.3,.1,D-.4,wood,0,.95,-.1);legs(W-.3,D-.4,.95,dark);
     k.box(g,1.2,.75,.08,'#2F3142',-.3,1.25,-.4);const sc=new THREE.Mesh(new THREE.PlaneGeometry(1.08,.62),new THREE.MeshBasicMaterial({color:'#7FD3FF'}));sc.position.set(-.3,1.63,-.355);g.add(sc);g.userData.screen=sc;
     k.box(g,.1,.25,.1,'#2F3142',-.3,1.05,-.42);k.box(g,.8,.04,.3,'#E6E8F0',-.3,1.05,-.05);k.box(g,.18,.04,.25,'#E6E8F0',.4,1.05,-.05);
     k.ball(g,.12,'#F7C948',.9,1.12,-.45,8);k.cyl(g,.08,.1,.15,'#E0605F',.9,1.05,-.45,8);
     const ch=new THREE.Group();ch.position.set(-.3,0,.55);g.add(ch);k.box(ch,.7,.1,.6,'#3F3FD4',0,.55,0);k.box(ch,.7,.7,.1,'#3F3FD4',0,.6,.28);k.cyl(ch,.05,.05,.5,'#555',0,.05,0,6);break}
   case'bed1':case'bed2':{const w=W-.25,d=D-.2;k.box(g,w,.45,d,dark,0,0,0);k.box(g,w,1.2,.12,dark,0,0,-d/2);k.box(g,w-.1,.25,d-.15,'#FFFFFF',0,.45,.02);
     k.box(g,w-.5,.15,.45,'#FFFFFF',0,.7,-d/2+.4);k.box(g,w,.08,d*.62,id==='bed2'?'#E0605F':'#3F3FD4',0,.7,d*.18);break}
   case'night':{k.box(g,.8,.7,.7,wood,0,0,0);k.box(g,.6,.05,.02,dark,0,.5,.36);k.cyl(g,.1,.14,.3,'#F7C948',0,.7,0,10);k.cone(g,.22,.25,'#FFF3D6',0,1,0,10);break}
   case'wardrobe':{k.box(g,W-.3,3,D-.4,'#C89F72',0,0,-.1);k.box(g,.04,2.8,.02,dark,0,.1,D/2-.29);[-.15,.15].forEach(o=>k.ball(g,.06,'#F5C542',o,1.5,D/2-.28,6));break}
   case'teddy':{const c='#B9875A';k.ball(g,.42,c,0,.42,0,14);k.ball(g,.3,c,0,1.05,0,14);[-.22,.22].forEach(o=>k.ball(g,.11,c,o,1.3,0,8));k.ball(g,.12,'#E7CBA9',0,.98,.25,8);
     [-.32,.32].forEach(o=>k.ball(g,.15,c,o,.55,.12,8));[-.2,.2].forEach(o=>k.ball(g,.16,c,o,.12,.25,8));[-.1,.1].forEach(o=>k.ball(g,.035,'#2F3142',o,1.1,.27,6));g.userData.anim='bob';break}
   case'sofa':{k.box(g,W-.2,.5,D-.3,'#E2643A',0,0,0);k.box(g,W-.2,.8,.3,'#E2643A',0,.4,-(D-.3)/2+.15);[-1,1].forEach(s=>k.box(g,.28,.75,D-.3,'#C8463F',s*(W/2-.24),0,0));
     [-.6,.6].forEach(o=>k.box(g,1.05,.15,D-.7,'#F08A6A',o,.5,.1));break}
   case'armchair':case'pouf':{if(id==='pouf'){const p=k.ball(g,.55,'#F7A23B',0,.35,0,14);p.scale.y=.65;break}
     k.box(g,1.1,.5,1.1,'#2DB36F',0,0,0);k.box(g,1.1,.8,.25,'#2DB36F',0,.4,-.43);[-1,1].forEach(s=>k.box(g,.2,.7,1.1,'#24A866',s*.55,0,0));break}
   case'ctable':{k.cyl(g,.6,.6,.08,wood,0,.45,0,20);k.cyl(g,.08,.1,.45,dark,0,0,0,8);k.cyl(g,.12,.1,.18,'#FFFFFF',.2,.53,.1,10);break}
   case'tv':{k.box(g,W-.4,.55,.8,wood,0,0,-.2);const s=k.box(g,W-.6,1.25,.08,'#1E1F2A',0,.85,-.3);const sc=new THREE.Mesh(new THREE.PlaneGeometry(W-.75,1.1),new THREE.MeshBasicMaterial({color:'#3F3FD4'}));sc.position.set(0,1.475,-.255);g.add(sc);g.userData.screen=sc;break}
   case'rug':{const m=new THREE.Mesh(new THREE.CircleGeometry(Math.min(W,D)/2-.1,40),k.M('#B69BE0'));m.rotation.x=-Math.PI/2;m.position.y=.02;m.receiveShadow=true;g.add(m);
     const m2=new THREE.Mesh(new THREE.RingGeometry(.9,1.05,40),k.M('#F3E9FF'));m2.rotation.x=-Math.PI/2;m2.position.y=.03;g.add(m2);break}
   case'shelf':{k.box(g,W-.3,2.6,.7,wood,0,0,-.3);const C=['#E0605F','#3F3FD4','#2DB36F','#F7A23B','#8B5CF6','#22B8CF'];
     for(let r=0;r<3;r++){k.box(g,W-.4,.05,.6,dark,0,.6+r*.7,-.25);for(let b=0;b<9;b++)k.box(g,.18,.45+Math.random()*.15,.45,C[(b+r)%6],-W/2+.5+b*.27,.65+r*.7,-.25)}break}
   case'fire':{k.box(g,W-.3,1.6,.8,'#B9BEC8',0,0,-.3);k.box(g,W,.15,.95,'#9AA0AB',0,1.6,-.3);k.box(g,1.3,.9,.2,'#2F3142',0,.1,.02);
     const fl=new THREE.Mesh(new THREE.ConeGeometry(.3,.6,8),new THREE.MeshBasicMaterial({color:'#FF9A3C'}));fl.position.set(0,.45,.08);g.add(fl);g.userData.flame=fl;break}
   case'table':{k.cyl(g,.9,.9,.08,wood,0,.95,0,24);k.cyl(g,.1,.14,.95,dark,0,0,0,8);[[-1.05,0,1],[1.05,0,-1]].forEach(([x,z,s])=>{const c=new THREE.Group();c.position.set(x,0,z);c.rotation.y=s*Math.PI/2;g.add(c);k.box(c,.55,.08,.55,'#E0605F',0,.55,0);k.box(c,.55,.6,.08,'#E0605F',0,.6,-.25);legs(.55,.55,.55,dark)});
     k.ball(g,.15,'#E5484D',.2,1.1,.1,8);k.ball(g,.13,'#F7C948',-.1,1.1,-.2,8);break}
   case'fridge':{k.box(g,1,2.3,.9,'#F4F5F7',0,0,-.1);k.box(g,.9,.02,.02,'#C9CED8',0,1.5,.36);k.box(g,.06,.5,.06,'#9AA0AB',.35,1.7,.38);k.box(g,.06,.4,.06,'#9AA0AB',.35,.9,.38);
     k.box(g,.2,.2,.02,'#F7C948',-.2,1.9,.36);break}
   case'kitchen':{k.box(g,W-.2,1,.9,'#F4F5F7',0,0,-.25);k.box(g,W-.1,.08,1,'#6B7080',0,1,-.25);[-.5,.4].forEach(o=>k.cyl(g,.2,.2,.03,'#2F3142',o,1.08,-.2,16));
     k.cyl(g,.25,.2,.25,'#C9CED8',-.5,1.1,-.2,12);k.box(g,W-.4,.04,.02,'#C9CED8',0,.75,.21);break}
   case'plant':{k.cyl(g,.28,.22,.45,'#E0605F',0,0,0,12);const b=k.ball(g,.45,'#4E8F3A',0,.85,0,10);b.scale.y=1.2;break}
   case'palm':{k.cyl(g,.3,.24,.5,'#F2C94C',0,0,0,12);k.cyl(g,.06,.08,1.4,'#8E6E5A',0,.5,0,6);for(let a=0;a<6;a++){const l=k.box(g,1,.05,.25,'#3F8F4A',0,1.9,0);l.rotation.y=a*Math.PI/3;l.geometry.translate(.5,0,0);l.rotation.z=-.4}break}
   case'lamp':{k.cyl(g,.25,.3,.08,'#2F3142',0,0,0,12);k.cyl(g,.04,.04,2,'#2F3142',0,.08,0,6);const s=k.cone(g,.4,.5,'#FFF3D6',0,1.95,0,14);s.rotation.x=Math.PI;
     const bulb=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),new THREE.MeshBasicMaterial({color:'#FFE9A8'}));bulb.position.y=1.85;g.add(bulb);break}
   case'nlight':{k.cyl(g,.15,.18,.3,'#8B5CF6',0,0,0,10);const st=new THREE.Mesh(new THREE.OctahedronGeometry(.25,0),new THREE.MeshBasicMaterial({color:'#FFE36E'}));st.position.y=.6;g.add(st);g.userData.spin=st;break}
   case'aquarium':{k.box(g,W-.3,.8,.8,dark,0,0,-.2);const gl=new THREE.Mesh(new THREE.BoxGeometry(W-.4,.9,.7),new THREE.MeshPhongMaterial({color:'#7FD3FF',transparent:true,opacity:.45,shininess:100}));gl.position.set(0,1.25,-.2);g.add(gl);
     k.box(g,W-.45,.08,.65,'#F2E2B8',0,.82,-.2);const fish=[];['#F7A23B','#E5484D','#F7C948'].forEach((c,i)=>{const f=k.ball(g,.09,c,0,1.1+i*.15,-.2,8);f.scale.x=1.6;fish.push(f)});g.userData.fish=fish;break}
   case'trophy':{k.box(g,.7,.9,.7,'#2F3142',0,0,0);k.cyl(g,.15,.25,.15,'#F5C542',0,.9,0,12);k.cyl(g,.05,.05,.3,'#F5C542',0,1.05,0,8);
     const c=k.cyl(g,.35,.15,.5,KIT.chrome('#F5C542'),0,1.35,0,16);g.userData.spin=c;break}
   case'console':{const p=k.ball(g,.5,'#8B5CF6',0,.3,.15,14);p.scale.y=.6;k.box(g,.5,.08,.3,'#2F3142',0,.62,.3);k.box(g,.12,.06,.12,'#E5484D',-.15,.7,.3);break}
   case'arcade':{k.box(g,1,2.3,.9,'#3F3FD4',0,0,-.1);k.box(g,.9,.3,.5,'#2F3142',0,1,.2);const sc=new THREE.Mesh(new THREE.PlaneGeometry(.75,.6),new THREE.MeshBasicMaterial({color:'#2DB36F'}));sc.position.set(0,1.75,.36);g.add(sc);g.userData.screen=sc;
     k.ball(g,.06,'#E5484D',-.2,1.35,.35,8);k.ball(g,.06,'#F7C948',.1,1.35,.35,8);k.ball(g,.06,'#2DB36F',.25,1.35,.35,8);break}
   case'guitar':{k.box(g,.5,.08,.5,'#2F3142',0,0,0);const b=k.ball(g,.32,'#C8863F',0,.6,0,14);b.scale.z=.35;const b2=k.ball(g,.25,'#C8863F',0,1,0,14);b2.scale.z=.35;k.box(g,.1,.9,.06,dark,0,1.15,0);k.cyl(g,.08,.08,.02,'#2F3142',0,.65,.12,10).rotation.x=Math.PI/2;break}
   case'piano':{k.box(g,W-.4,1.5,.8,'#1E1F2A',0,0,-.25);k.box(g,W-.4,.12,.45,'#1E1F2A',0,.9,.3);k.box(g,W-.55,.06,.3,'#FFFFFF',0,1.02,.3);for(let i=0;i<10;i++)k.box(g,.06,.05,.18,'#1E1F2A',-1.1+i*.24,1.08,.24);
     k.box(g,1.1,.5,.4,'#1E1F2A',0,0,.9);break}
   case'babyfoot':{k.box(g,W-.3,.4,1.2,'#2DB36F',0,.8,0);legs(W-.3,1.2,.8,'#2F3142');for(let i=0;i<4;i++)k.box(g,.04,.04,1.8,'#C9CED8',-.9+i*.6,1.1,0);break}
   case'cat':{const bs=k.cyl(g,.55,.45,.3,'#C8863F',0,0,0,16);const cg=new THREE.Group();g.add(cg);cg.position.y=.3;k.ball(cg,.32,'#F7A23B',0,.2,0,12).scale.set(1,.7,1.3);
     k.ball(cg,.22,'#F7A23B',0,.45,.32,12);[-.12,.12].forEach(o=>k.cone(cg,.07,.15,'#F7A23B',o,.6,.32,4));[-.07,.07].forEach(o=>k.ball(cg,.03,'#2F3142',o,.5,.52,6));
     const tail=k.box(cg,.06,.06,.45,'#F7A23B',0,.2,-.5);g.userData.tail=tail;g.userData.anim='breathe';g.userData.body=cg;break}
   case'dog':{k.box(g,1.1,.9,1,'#C8463F',0,0,-.15);k.roof(g,.9,.5,'#8E6E5A',0,.9,-.15);k.box(g,.45,.5,.02,'#2F3142',0,0,.36);
     const dg=new THREE.Group();g.add(dg);dg.position.set(.35,0,.55);k.ball(dg,.22,'#E8C46A',0,.3,0,10).scale.set(1,.8,1.4);k.ball(dg,.17,'#E8C46A',0,.5,.25,10);
     [-.1,.1].forEach(o=>k.ball(dg,.07,'#8E6E5A',o,.62,.22,6));const tail=k.box(dg,.05,.05,.25,'#E8C46A',0,.4,-.32);tail.rotation.x=-.6;g.userData.tail=tail;g.userData.anim='wag';break}
  }
  return g;
}

/* =========================================================
   LA SCÈNE 3D DE LA MAISON
   ========================================================= */
const HOME=(()=>{
  let host,r,scene,cam,hero,raf=0,on=false,clock,itemsG=[],floor,walls=[],floorMat,wallMat,heroT=null,pop=null,popT=0,sel=-1,mode='walk',placing=null,selRing;
  const k=()=>KIT;
  function floorTex(st){const s=HSTYLE[st];return new THREE.CanvasTexture(KIT.cvs(256,256,(g,W,H)=>{g.fillStyle=s.c;g.fillRect(0,0,W,H);
    if(st==='fl0'){for(let y=0;y<8;y++){g.fillStyle=y%2?'#D2AB80':'#DDBA92';g.fillRect(0,y*32,W,30);g.fillStyle='rgba(0,0,0,.08)';g.fillRect((y*97)%256,y*32,3,32)}}
    else if(st==='fl1'){for(let y=0;y<4;y++)for(let x=0;x<4;x++)if((x+y)%2){g.fillStyle=s.st;g.fillRect(x*64,y*64,64,64)}}
    else if(st==='fl3'){g.strokeStyle=s.st;g.lineWidth=3;for(let i=0;i<6;i++){g.beginPath();g.moveTo(Math.random()*W,0);g.bezierCurveTo(Math.random()*W,H/3,Math.random()*W,H*2/3,Math.random()*W,H);g.stroke()}}
    else if(st==='fl4'){for(let i=0;i<500;i++){g.fillStyle=Math.random()<.5?s.st:'#8FD06A';g.fillRect(Math.random()*W,Math.random()*H,2,6)}}}))}
  function wallTex(st){const s=HSTYLE[st];return new THREE.CanvasTexture(KIT.cvs(128,128,(g,W,H)=>{g.fillStyle=s.c;g.fillRect(0,0,W,H);if(s.st){g.fillStyle=s.st;for(let x=0;x<W;x+=32)g.fillRect(x,0,12,H)}}))}
  function applyStyles(){const H=hState();const ft=floorTex(H.floor);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(2,2);floorMat.map=ft;floorMat.needsUpdate=true;
    const wt=wallTex(H.wall);wt.wrapS=THREE.RepeatWrapping;wt.repeat.set(4,1);wallMat.map=wt;wallMat.needsUpdate=true}
  function build(){
    const K=k();scene=new THREE.Scene();cam=new THREE.PerspectiveCamera(36,1,.5,200);
    scene.add(new THREE.HemisphereLight(0xfffaf0,0x9a8a7a,.75));
    const sun=new THREE.DirectionalLight(0xfff0d8,.55);sun.position.set(-8,16,10);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:1,far:50});sun.shadow.bias=-.0008;scene.add(sun);
    const warm=new THREE.PointLight(0xffd9a0,.35,30);warm.position.set(0,5,2);scene.add(warm);
    const S=HN*HT;
    floorMat=new THREE.MeshLambertMaterial({color:'#ffffff'});floor=new THREE.Mesh(new THREE.PlaneGeometry(S,S),floorMat);floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.userData.floor=1;scene.add(floor);
    K.box(scene,S+.6,.4,S+.6,'#8E6E5A',0,-.4,0);
    wallMat=new THREE.MeshLambertMaterial({color:'#ffffff'});
    const back=new THREE.Mesh(new THREE.BoxGeometry(S+.6,3.8,.3),wallMat);back.position.set(0,1.9,-S/2-.15);back.receiveShadow=true;scene.add(back);
    [-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.BoxGeometry(.3,3.8,S),wallMat);w.position.set(s*(S/2+.15),1.9,0);w.receiveShadow=true;scene.add(w);walls.push(w)});
    K.box(scene,S,.2,.05,'#FFFFFF',0,0,-S/2+.03);[-1,1].forEach(s=>K.box(scene,.05,.2,S,'#FFFFFF',s*(S/2-.03),0,0));
    // fenêtre + porte
    const win=new THREE.Group();win.position.set(2.4,1.3,-S/2+.02);scene.add(win);
    const sky=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(KIT.cvs(64,64,(g)=>{const gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'#7EC3F2');gr.addColorStop(1,'#D3EEFF');g.fillStyle=gr;g.fillRect(0,0,64,64);g.fillStyle='#fff';g.beginPath();g.arc(20,24,7,0,7);g.arc(30,22,9,0,7);g.arc(40,25,6,0,7);g.fill();g.fillStyle='#7FB24F';g.fillRect(0,52,64,12)}))}));sky.position.y=.75;win.add(sky);
    K.box(win,2.6,.12,.12,'#FFFFFF',0,0,0);K.box(win,2.6,.12,.12,'#FFFFFF',0,1.45,0);[-1.25,0,1.25].forEach(x=>K.box(win,.1,1.5,.12,'#FFFFFF',x,0,0));K.box(win,2.9,.1,.3,'#FFFFFF',0,-.1,.1);
    const door=new THREE.Group();door.position.set(-S/2+.02,0,2.5);door.rotation.y=Math.PI/2;scene.add(door);K.box(door,1.3,2.5,.08,'#8E6E5A',0,0,0);K.ball(door,.07,'#F5C542',.45,1.2,.06,6);
    // cadre photo de l'avatar
    const fr=new THREE.Group();fr.position.set(-2.6,2.1,-S/2+.04);scene.add(fr);K.box(fr,1.3,1,.06,'#B9875A',0,0,0);
    const img=new Image();const tex=new THREE.Texture(img);img.onload=()=>{tex.needsUpdate=true};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(avatarSVG(G.char,128).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
    const ph=new THREE.Mesh(new THREE.PlaneGeometry(1.05,.78),new THREE.MeshBasicMaterial({map:tex}));ph.position.set(0,.5,.04);fr.add(ph);
    applyStyles();
    selRing=new THREE.Mesh(new THREE.RingGeometry(.6,.75,32),new THREE.MeshBasicMaterial({color:'#F7C948',transparent:true,opacity:.9,depthWrite:false}));selRing.rotation.x=-Math.PI/2;selRing.position.y=.05;selRing.visible=false;scene.add(selRing);
    hero=KIT.hero(G.char);hero.g.scale.setScalar(.62);hero.g.position.set(0,0,2.2);scene.add(hero.g);
    rebuildItems();clock=new THREE.Clock();
    host.addEventListener('pointerup',onTap);
  }
  function rebuildItems(){
    itemsG.forEach(g=>scene.remove(g));itemsG=[];
    hState().items.forEach((it,idx)=>{const g=buildFurn(it.id);const[w,d]=fp(it);g.position.set((it.i+w/2-HN/2)*HT,0,(it.j+d/2-HN/2)*HT);g.rotation.y=-it.r*Math.PI/2;g.userData.idx=idx;scene.add(g);itemsG.push(g)});
    showSel();
  }
  function showSel(){if(!selRing)return;const it=sel>=0&&hState().items[sel];selRing.visible=!!it&&mode==='edit';if(it){const g=itemsG[sel];const[w,d]=fp(it);selRing.position.x=g.position.x;selRing.position.z=g.position.z;selRing.scale.setScalar(Math.max(w,d)*.9)}}
  function fitCam(){if(!host)return;const a=host.clientWidth/Math.max(1,host.clientHeight);cam.aspect=a;cam.updateProjectionMatrix();
    const need=HN*HT*.62,len=Math.max(22,need/(Math.tan(18*Math.PI/180)*Math.min(a,1.25)));const dir=new THREE.Vector3(0,.68,.73).normalize();
    cam.position.copy(dir.multiplyScalar(len));cam.position.y+=0;cam.lookAt(0,0,a<.9?1.6:.6)}
  function mount(el){host=el;r=KIT.attach(el);if(!r)return false;if(!scene)build();return true}
  function show(){if(!r)return;KIT.attach(host);fitCam();on=true;if(!raf)loop()}
  function hide(){on=false}
  const ray=window.THREE?new THREE.Raycaster():null;
  function onTap(e){
    if(!on||e.target!==r.domElement)return;const b=r.domElement.getBoundingClientRect();
    ray.setFromCamera({x:(e.clientX-b.left)/b.width*2-1,y:-(e.clientY-b.top)/b.height*2+1},cam);
    const hits=ray.intersectObjects([...itemsG,floor],true);if(!hits.length)return;
    let o=hits[0].object;while(o&&o.userData.idx===undefined&&!o.userData.floor)o=o.parent;
    const p=hits[0].point,ti=Math.floor(p.x/HT+HN/2),tj=Math.floor(p.z/HT+HN/2);
    if(mode==='edit'){
      if(placing!=null){placeAt(ti,tj);return}
      if(o&&o.userData.idx!==undefined){sel=o.userData.idx;beep('tap');showSel();homeHud();return}
      if(sel>=0){sel=-1;showSel();homeHud()}return}
    if(o&&o.userData.idx!==undefined){const it=hState().items[o.userData.idx];const g=itemsG[o.userData.idx];walkTo(g.position.x,g.position.z+(fp(it)[1]*HT/2+.5),()=>interact(it,g));return}
    walkTo(p.x,p.z);
  }
  function walkTo(x,z,cb){const S=HN*HT/2-.5;heroT={x:clamp(x,-S,S),z:clamp(z,-S,S),cb};}
  function placeAt(i,j){const P=placing;const f=FURN[P.id];
    // on essaie de centrer l'objet sur la case touchée
    const[w,d]=P.r%2?[f.d,f.w]:[f.w,f.d];i=clamp(i-Math.floor((w-1)/2),0,HN-w);j=clamp(j-Math.floor((d-1)/2),0,HN-d);
    if(!fits(P.id,i,j,P.r,P.idx)){beep('bad');toast('Pas assez de place ici 🙈','neg');return}
    const H=hState();if(P.idx!=null){Object.assign(H.items[P.idx],{i,j,r:P.r});sel=P.idx}else{H.items.push({id:P.id,i,j,r:P.r});H.inv.splice(H.inv.indexOf(P.id),1);sel=H.items.length-1}
    placing=null;beep('ok');save();rebuildItems();homeHud();sparkAt(itemsG[sel])}
  function sparkAt(g){if(!g)return;emote('✨',g.position)}
  function emote(e,pos){if(pop)scene.remove(pop);pop=KIT.emojiSprite(e,1.2);pop.position.set(pos.x,(pos.y||0)+3,pos.z);scene.add(pop);popT=1.6}
  const SAY={pc:null,bed:['💤','Petite sieste… 😴'],sit:['😌','Ahhh, confortable !'],tv:['📺','Un épisode, pas plus !'],book:['📖','Un bon livre…'],fire:['🔥','Bien au chaud !'],
    fridge:['🧃','Un petit jus frais'],cook:['🍳','Ça sent bon !'],fish:['🐠','Les poissons te font coucou'],trophy:['🏆','Quelle réussite !'],game:['🎮','Partie endiablée !'],
    music:['🎵','Do ré mi…'],cat:['😺','Miaou !'],dog:['🐶','Wouf wouf !'],hug:['🤗','Câlin !']};
  function interact(it,g){const f=FURN[it.id];if(f.act==='pc'){hero.g.rotation.y=Math.PI;return computer('desk')}
    const s=SAY[f.act]||['✨',f.n];emote(s[0],g.position);toast(s[1]);if(f.act==='music')[523,659,784].forEach((n,i)=>setTimeout(()=>beep('ok'),i*160));else beep('coin')}
  function loop(){
    raf=requestAnimationFrame(loop);if(!on||document.hidden||$('#home').classList.contains('hidden'))return;
    const dt=Math.min(.05,clock.getDelta()),t=clock.elapsedTime;
    if(heroT){const p=hero.g.position,dx=heroT.x-p.x,dz=heroT.z-p.z,dd=Math.hypot(dx,dz);
      if(dd<.08){const cb=heroT.cb;heroT=null;hero.idle(t);cb&&cb()}else{const s=Math.min(dd,3.6*dt);p.x+=dx/dd*s;p.z+=dz/dd*s;hero.g.rotation.y=Math.atan2(dx,dz);hero.walk(t,1)}}
    else hero.idle(t);
    itemsG.forEach(g=>{const u=g.userData;if(u.screen)u.screen.material.color.setHSL((t*.05+g.position.x*.1)%1,.6,.62);if(u.spin)u.spin.rotation.y=t*1.5;
      if(u.fish)u.fish.forEach((f,i)=>{f.position.x=Math.sin(t*(.8+i*.3)+i)*.8;f.rotation.y=Math.cos(t*(.8+i*.3)+i)>0?0:Math.PI});
      if(u.tail)u.tail.rotation.y=Math.sin(t*(u.anim==='wag'?12:3))*.5;if(u.body)u.body.scale.y=1+Math.sin(t*2)*.04;if(u.anim==='bob')g.children[0]&&(g.children[0].scale.y=1+Math.sin(t*2)*.03);
      if(u.flame){u.flame.scale.set(1+Math.sin(t*13)*.1,1+Math.sin(t*9)*.2,1);u.flame.material.color.setHSL(.07+Math.sin(t*7)*.02,1,.58)}});
    if(selRing&&selRing.visible){selRing.material.opacity=.6+Math.sin(t*5)*.3}
    if(pop){popT-=dt;pop.position.y+=dt*.6;pop.material.opacity=Math.min(1,popT);if(popT<=0){scene.remove(pop);pop=null}}
    r.render(scene,cam);
  }
  return{mount,show,hide,rebuild:()=>{if(scene){rebuildItems()}},styles:()=>{if(scene)applyStyles()},refreshHero:()=>{if(scene){scene.remove(hero.g);const p=hero.g.position.clone();hero=KIT.hero(G.char);hero.g.scale.setScalar(.62);hero.g.position.copy(p);scene.add(hero.g)}},
    setMode:m=>{mode=m;if(m!=='edit'){sel=-1;placing=null}showSel()},mode:()=>mode,sel:()=>sel,setSel:i=>{sel=i;showSel()},placing:()=>placing,setPlacing:p=>{placing=p},resize:()=>{if(on&&r){KIT.attach(host);fitCam()}},ok:()=>!!r};
})();
window.addEventListener('resize',()=>HOME.resize());

/* =========================================================
   INTERFACE DE LA MAISON
   ========================================================= */
function homeDom(){
  if($('#home'))return;
  const d=document.createElement('div');d.id='home';d.className='hidden';
  d.innerHTML=`<div id="home3d"></div><div id="homefb" class="hidden"></div>
   <div class="hhead"><button class="bback" data-a="hBack">← Ville</button><div class="hmoney" id="homeMoney"></div><button class="chipbtn" data-a="hHelp" aria-label="Aide">❓</button></div>
   <div class="hpanel" id="hPanel"></div>
   <div class="hbar" id="hBar"></div>`;
  document.body.appendChild(d);
}
function openHome(){
  homeDom();hState();mkt();mktCatchUp();
  $('#city').classList.add('hidden');if(city)city.pause(true);$('#home').classList.remove('hidden');
  const ok=HOME.mount($('#home3d'));
  if(!ok){$('#homefb').classList.remove('hidden');renderHomeFb()}else HOME.show();
  HOME.setMode('walk');homeHud();
  if(!G.tuto||!G.tuto.home)setTimeout(()=>tour('home'),500);
}
function closeHome(){HOME.hide();HOME.setMode('walk');$('#home').classList.add('hidden');wipe('#8DB36B','🏙️',()=>showCity())}
function renderHomeFb(){const H=hState();$('#homefb').innerHTML=`<div class="hfb">${H.items.map(it=>`<div>${FURN[it.id].ic}<small>${FURN[it.id].n}</small></div>`).join('')}</div>`}
function homeHud(){
  if(!$('#home'))return;const pv=portValue();
  $("#homeMoney").innerHTML=`<span>💳 <b>${fmt(G.money)}</b></span>${pv?`<span>📈 <b>${fmt(pv)}</b></span>`:''}`;
  const m=HOME.mode(),H=hState(),sel=HOME.sel(),pl=HOME.placing();let panel='',bar='';
  if(m==='edit'){
    if(pl)panel=`<div class="hp"><b>${FURN[pl.id].ic} Touche le sol pour poser : ${FURN[pl.id].n}</b><div class="hpb"><button data-a="hRot">↻ Tourner</button><button data-a="hCancel">✕ Annuler</button></div></div>`;
    else if(sel>=0){const it=H.items[sel],f=FURN[it.id];panel=`<div class="hp"><b>${f.ic} ${f.n}</b><div class="hpb"><button data-a="hRot">↻ Tourner</button><button data-a="hMove">✥ Déplacer</button>${f.fixed?'':`<button data-a="hStore">📦 Ranger</button><button data-a="hSell">💰 Revendre ${fmt(Math.round(f.p*.5))}</button>`}</div></div>`}
    else panel=`<div class="hp"><b>✏️ Mode déco : touche un meuble pour le déplacer, le tourner ou le ranger.</b></div>`;
    bar=`<button data-a="hCat"><span>📖</span>Catalogue</button><button data-a="hInv"><span>📦</span>Rangement${H.inv.length?` (${H.inv.length})`:''}</button><button class="main" data-a="hEdit"><span>✅</span>Terminer</button>`;
  }else bar=`<button data-a="hCat"><span>📖</span>Catalogue</button><button data-a="hEdit"><span>✏️</span>Décorer</button><button data-a="hInv"><span>📦</span>Rangement${H.inv.length?` (${H.inv.length})`:''}</button><button class="main" data-a="pc"><span>🖥️</span>Ordi · Bourse</button>`;
  $('#hPanel').innerHTML=panel;$('#hBar').innerHTML=bar;
}
let HC={cat:'Salon'};
function catalogue(cat){
  if(cat)HC.cat=cat;const H=hState(),c=HC.cat,bl=G.run?'⏸️ Termine ton mois en cours pour faire des achats.':null;
  const items=c==='Murs & sols'?Object.entries(HSTYLE).map(([id,s])=>({id,n:s.n,p:s.p,ic:s.t==='wall'?'🧱':'🟫',style:1,sw:s.c,owned:H.owned.includes(id),on:H.wall===id||H.floor===id}))
    :Object.entries(FURN).filter(([,f])=>f.cat===c&&!f.fixed).map(([id,f])=>({id,...f,count:H.items.filter(x=>x.id===id).length+H.inv.filter(x=>x===id).length}));
  modal(`<div class="sh" style="--tc:#F59E0B"><div class="ty"><span>📖 Catalogue de la maison</span><span>💳 ${fmt(G.money)}</span></div><h3 style="margin-top:6px">Que veux-tu acheter ?</h3></div><div class="sb">
    ${bl?`<div class="verdict neu"><p>${bl}</p></div>`:''}
    <div class="gtabs">${HCATS.map(x=>`<button class="${x===c?'on':''}" data-a="hCatTab" data-v="${x}">${x}</button>`).join('')}</div>
    <div class="cgrid">${items.map(it=>{const can=G.money>=it.p;
      return`<div class="citem ${it.on?'sel':''}"><div class="ce" ${it.style?`style="background:${it.sw}"`:''}>${it.ic}</div><b>${it.n}</b><small>${it.p?fmt(it.p):'Gratuit'}${it.count?` · tu en as ${it.count}`:''}</small>
        ${it.style?(it.owned?`<button class="cb ${it.on?'ghost':''}" data-a="hStyle" data-v="${it.id}" ${it.on?'disabled':''}>${it.on?'Appliqué':'Appliquer'}</button>`:`<button class="cb" data-a="hBuyS" data-v="${it.id}" ${!can||bl?'disabled':''}>Acheter</button>`)
          :`<button class="cb" data-a="hBuy" data-v="${it.id}" ${!can||bl?'disabled':''}>${can?'Acheter':'Trop cher'}</button>`}</div>`}).join('')}</div>
    <p style="font-size:12.5px;color:var(--muted);margin:10px 0 0">💡 Ici, tu dépenses le <b>vrai argent de ta partie</b>. Une maison bien décorée, c’est sympa… mais garde de quoi payer tes factures du mois prochain !</p>
    <button class="btn ghost" data-a="close">Fermer</button></div>`);
}
function buyFurn(id){
  const f=FURN[id];if(G.run)return toast('Termine ton mois en cours d’abord !','neg');if(G.money<f.p)return toast('Pas assez sur ton compte','neg');
  G.money-=f.p;const H=hState();H.inv.push(id);beep('coin');confettiMini();save();closeModal();
  const spot=freeSpot(id);if(spot&&HOME.ok()){HOME.setMode('edit');HOME.setPlacing(null);H.items.push({id,...spot});H.inv.splice(H.inv.lastIndexOf(id),1);save();HOME.rebuild();HOME.setSel(H.items.length-1);toast(`🎉 ${f.n} installé·e ! Touche « Déplacer » pour changer sa place.`,'pos')}
  else toast(`📦 ${f.n} est dans ton rangement`,'pos');
  homeHud();
}
function confettiMini(){const c=$('#confetti'),cols=['#F59E0B','#E0605F','#2DB36F','#3F3FD4'];for(let i=0;i<24;i++){const s=document.createElement('i');s.style.left=(30+Math.random()*40)+'vw';s.style.background=cols[i%4];s.style.animationDuration=rnd(1,1.8)+'s';c.appendChild(s);setTimeout(()=>s.remove(),2000)}}
function inventory(){
  const H=hState(),cnt={};H.inv.forEach(id=>cnt[id]=(cnt[id]||0)+1);
  modal(`<div class="sh" style="--tc:#8B5CF6"><div class="em">📦</div><h3>Mon rangement</h3></div><div class="sb">
    ${Object.keys(cnt).length?`<div class="cgrid">${Object.entries(cnt).map(([id,n])=>`<div class="citem"><div class="ce">${FURN[id].ic}</div><b>${FURN[id].n}</b><small>×${n}</small><button class="cb" data-a="hPlace" data-v="${id}">Poser</button></div>`).join('')}</div>`
      :'<p class="muted">Rien dans ton rangement. En mode ✏️ Décorer, tu peux ranger un meuble pour libérer de la place.</p>'}
    <button class="btn ghost" data-a="close">Fermer</button></div>`);
}
Object.assign(A,{
  home:()=>wipe('#F59E0B','🏠',openHome),
  hBack:closeHome,hCat:()=>catalogue(),hCatTab:v=>catalogue(v),hBuy:v=>buyFurn(v),hInv:inventory,
  hBuyS:v=>{const s=HSTYLE[v],H=hState();if(G.run)return toast('Termine ton mois en cours d’abord !','neg');if(G.money<s.p)return toast('Pas assez sur ton compte','neg');G.money-=s.p;H.owned.push(v);H[s.t]=v;beep('coin');save();HOME.styles();homeHud();catalogue()},
  hStyle:v=>{const s=HSTYLE[v],H=hState();H[s.t]=v;save();HOME.styles();catalogue()},
  hEdit:()=>{HOME.setMode(HOME.mode()==='edit'?'walk':'edit');homeHud()},
  hRot:()=>{const pl=HOME.placing(),H=hState();if(pl){pl.r=(pl.r+1)%4;homeHud();return}const s=HOME.sel();if(s<0)return;const it=H.items[s];const nr=(it.r+1)%4;if(fits(it.id,it.i,it.j,nr,s)){it.r=nr;save();HOME.rebuild();beep('tap')}else toast('Pas assez de place pour tourner ici','neg')},
  hMove:()=>{const s=HOME.sel();if(s<0)return;const it=hState().items[s];HOME.setPlacing({id:it.id,r:it.r,idx:s});homeHud()},
  hCancel:()=>{HOME.setPlacing(null);homeHud()},
  hStore:()=>{const s=HOME.sel(),H=hState();if(s<0)return;H.inv.push(H.items[s].id);H.items.splice(s,1);HOME.setSel(-1);save();HOME.rebuild();homeHud();toast('📦 Rangé !')},
  hSell:()=>{const s=HOME.sel(),H=hState();if(s<0)return;const f=FURN[H.items[s].id],v=Math.round(f.p*.5);G.money+=v;H.items.splice(s,1);HOME.setSel(-1);save();HOME.rebuild();homeHud();beep('coin');
    toast(`💰 Revendu ${fmt(v)} (la moitié du prix : un meuble perd de la valeur dès qu’on l’achète)`,'pos')},
  hPlace:v=>{closeModal();if(!HOME.ok())return;HOME.setMode('edit');HOME.setPlacing({id:v,r:0,idx:null});homeHud()},
  hHelp:()=>tour('home',true),
});
