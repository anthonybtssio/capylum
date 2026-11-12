/* =========================================================
   Capylum — L'INTÉRIEUR DES BÂTIMENTS
   Quand un événement arrive, on entre vraiment dans le lieu :
   supermarché, cinéma, banque, boulangerie, garage…
   ========================================================= */
const INTERIOR=(()=>{
  const cache={};
  const rr=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
  const PROD=['#E5484D','#F7A23B','#2DB36F','#3F3FD4','#F7C948','#8B5CF6','#22B8CF','#FFFFFF','#E0605F'];
  function basic(c){return new THREE.MeshBasicMaterial({color:c})}
  function tex(fn,w=128,h=128){const t=new THREE.CanvasTexture(KIT.cvs(w,h,fn));t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
  /* ----- La pièce ----- */
  function room(P,o={}){
    const k=KIT,s=new THREE.Scene(),W=o.w||16,D=o.d||11,H=o.h||5.2;
    s.add(new THREE.HemisphereLight(0xffffff,0x998877,o.dark?.25:.8));
    const sun=new THREE.DirectionalLight(0xfff4e0,o.dark?.15:.45);sun.position.set(4,12,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
    Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:1,far:40});s.add(sun);
    // sol
    const fc=o.floor||'#E9E4DA',fs=o.floorAlt||'#DCD5C7';
    const ft=tex((g,w,h)=>{g.fillStyle=fc;g.fillRect(0,0,w,h);if(o.planks){for(let y=0;y<8;y++){g.fillStyle=y%2?fs:fc;g.fillRect(0,y*16,w,15)}}else{g.fillStyle=fs;g.fillRect(0,0,64,64);g.fillRect(64,64,64,64)}});ft.repeat.set(W/3,D/3);
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(W,D+8),new THREE.MeshLambertMaterial({map:ft}));fl.rotation.x=-Math.PI/2;fl.position.z=-D/2+7;fl.receiveShadow=true;s.add(fl);
    // murs
    const wc=o.wall||P.wall||'#F3EEE6';
    const wm=new THREE.MeshLambertMaterial({color:wc});
    const back=new THREE.Mesh(new THREE.BoxGeometry(W,H,.3),wm);back.position.set(0,H/2,-D+3);back.receiveShadow=true;s.add(back);
    [-1,1].forEach(sd=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.3,H,D+8),wm);m.position.set(sd*W/2,H/2,-D/2+7);m.receiveShadow=true;s.add(m)});
    k.box(s,W,.35,.32,o.trim||P.acc||'#8B5CF6',0,0,-D+3.16);// plinthe colorée
    // plafond + lampes
    if(!o.noCeil){const c=new THREE.Mesh(new THREE.PlaneGeometry(W,D+8),new THREE.MeshLambertMaterial({color:o.ceil||'#FAFAFA',side:THREE.DoubleSide}));c.rotation.x=Math.PI/2;c.position.set(0,H,-D/2+7);s.add(c);
      for(let x=-W/2+3;x<W/2-1;x+=4)for(let z=-D+5;z<2;z+=4){const l=new THREE.Mesh(new THREE.BoxGeometry(1.6,.08,.5),basic(o.dark?'#5A5F7A':'#FFFBEA'));l.position.set(x,H-.05,z);s.add(l)}}
    if(!o.dark){const pl=new THREE.PointLight(0xfff0d0,.45,30);pl.position.set(0,H-.6,-1);s.add(pl)}
    // enseigne sur le mur du fond
    if(!o.noSign&&P.sign)k.signPlane(s,`${P.ic} ${P.sign}`,P.acc||'#3F3FD4','#fff',Math.min(6,W*.4),1,0,H-1,-D+3.17);
    const cam=new THREE.PerspectiveCamera(42,1,.3,100);cam.position.set(0,4.4,9.2);cam.lookAt(0,1.9,-2.5);
    return{s,cam,W,D,H,back:-D+3.15};
  }
  /* ----- Mobilier réutilisable ----- */
  const K=()=>KIT;
  function shelf(p,x,z,w,h,ry=0,frame='#C9CED8',items=PROD){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;p.add(g);const k=K();
    k.box(g,w,h,.9,frame,0,0,-.05);for(let y=.35;y<h-.2;y+=.65){k.box(g,w-.1,.05,.95,'#E6E8F0',0,y,0);
      for(let i=-w/2+.25;i<w/2-.2;i+=rr(.28,.4)){const ph=rr(.25,.5),c=pick(items);k.box(g,rr(.18,.3),ph,.35,c,i,y+.05,.25)}}
    return g}
  function counter(p,x,z,w,c='#FFFFFF',top='#6B7080'){const k=K(),g=new THREE.Group();g.position.set(x,0,z);p.add(g);k.box(g,w,1.1,.9,c,0,0,0);k.box(g,w+.1,.08,1,top,0,1.1,0);return g}
  function register(p,x,y,z){const k=K();k.box(p,.5,.3,.4,'#2F3142',x,y,z);const sc=new THREE.Mesh(new THREE.PlaneGeometry(.38,.22),basic('#7FD3FF'));sc.position.set(x,y+.45,z+.05);sc.rotation.x=-.3;p.add(sc);k.box(p,.06,.3,.06,'#2F3142',x,y+.3,z)}
  function chair(p,x,z,c='#E0605F',ry=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;p.add(g);const k=K();k.box(g,.55,.08,.55,c,0,.5,0);k.box(g,.55,.6,.08,c,0,.55,-.25);[[-.22,-.22],[.22,-.22],[-.22,.22],[.22,.22]].forEach(([a,b])=>k.box(g,.06,.5,.06,'#555',a,0,b));return g}
  function table(p,x,z,r=.6,c='#B9875A'){const k=K();k.cyl(p,r,r,.07,c,x,.85,z,20);k.cyl(p,.07,.1,.85,'#555',x,0,z,8)}
  function plant(p,x,z,s=1){const k=K();k.cyl(p,.3*s,.24*s,.5*s,'#E0605F',x,0,z,12);const b=k.ball(p,.5*s,'#4E8F3A',x,.95*s,z,10);b.scale.y=1.2}
  function frame(p,x,y,z,w,h,c){const k=K();k.box(p,w+.12,h+.12,.05,'#B9875A',x,y-h/2-.06,z);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),basic(c));m.position.set(x,y,z+.04);p.add(m);return m}
  function emo(p,e,x,y,z,sz=1){const s=KIT.emojiSprite(e,sz);s.position.set(x,y,z);p.add(s);return s}
  function person(p,x,z,top,ry=0){const h=KIT.hero({skin:pick(['#FBE0C8','#F1C9A5','#D9A47C','#A86B45','#6E4630']),hair:pick(['#2B1D16','#6B4423','#E8C46A','#1F1F1F']),style:pick(['court','long','boucle','chignon']),top});h.g.scale.setScalar(.62);h.g.position.set(x,0,z);h.g.rotation.y=ry;p.add(h.g);return h}

  /* ----- Les décors ----- */
  const DECOR={
   super(P){const r=room(P,{floor:'#F4F5F7',floorAlt:'#E9EBF0',w:18,d:12});const s=r.s,k=K();
     [-5.5,-1.8,1.8].forEach(x=>{shelf(s,x,-3,2.6,2.4,Math.PI/2);shelf(s,x+.95,-3,2.6,2.4,-Math.PI/2)});
     for(let x=-7;x<7;x+=2.2)shelf(s,x,r.back+.6,2.1,2.8);
     const fr=new THREE.Mesh(new THREE.BoxGeometry(2.6,1,1.1),new THREE.MeshPhongMaterial({color:'#BFE3F5',transparent:true,opacity:.75,shininess:90}));fr.position.set(6,.5,-2.5);s.add(fr);k.box(s,2.7,.6,1.2,'#FFFFFF',6,0,-2.5);
     counter(s,5.6,1.2,2.6,'#2DB36F');k.box(s,2,.04,.6,'#2F3142',5.4,1.16,1.2);register(s,6.6,1.18,1);
     [[-6.5,1.6],[-5.6,2]].forEach(([x,z])=>{k.box(s,.8,.55,1,KIT.chrome('#3F3FD4'),x,.35,z);k.box(s,.7,.04,.9,'#999',x,.3,z)});
     for(let i=0;i<6;i++)k.box(s,.5,.25,.03,'#F7C948',-6+i*2.2,1.3,-2.05);
     person(s,4,-1.5,'#F7A23B',.6);return r},
   bakery(P){const r=room(P,{floor:'#F5E6CF',floorAlt:'#EAD5B5',wall:'#FBE8C8'});const s=r.s,k=K();
     const gl=new THREE.Mesh(new THREE.BoxGeometry(6,.9,1.2),new THREE.MeshPhongMaterial({color:'#DFF3FF',transparent:true,opacity:.55}));gl.position.set(0,1.35,-1.5);s.add(gl);k.box(s,6.2,.9,1.3,'#C8863F',0,0,-1.5);
     for(let i=0;i<9;i++){const b=k.ball(s,.22,pick(['#D9A15A','#C8863F','#E8C46A']),-2.6+i*.65,1.1,-1.5,10);b.scale.set(1.6,.7,1)}
     for(let i=0;i<4;i++){k.cyl(s,.3,.3,.3,pick(['#F8B4C8','#FFFFFF','#8E6E5A']),-2+i*1.3,1.05,-1.1,14);k.ball(s,.07,'#E5484D',-2+i*1.3,1.4,-1.1,6)}
     for(let i=0;i<10;i++){const c=k.cyl(s,.08,.08,1.6,'#D9A15A',-3.6+i*.3,1.4,r.back+.6,8);c.rotation.z=.2}
     k.box(s,8,.08,.6,'#8E6E5A',0,1.3,r.back+.5);k.box(s,8,.08,.6,'#8E6E5A',0,2.3,r.back+.5);
     register(s,3.6,1.18,-1.4);person(s,1.5,-2.8,'#FFFFFF',0);return r},
   clothes(P){const r=room(P,{floor:'#F3E9EF',floorAlt:'#EADCE4',planks:1});const s=r.s,k=K();
     [-4.5,0,4.5].forEach((x,j)=>{const g=new THREE.Group();g.position.set(x,0,-3+(j%2)*1.2);s.add(g);k.box(g,2.6,.06,.06,'#9AA0AB',0,1.9,0);[-1.2,1.2].forEach(o=>k.box(g,.06,1.9,.06,'#9AA0AB',o,0,0));
       for(let i=0;i<8;i++)k.box(g,.12,1,.7,pick(PROD),-1+i*.28,.85,0)});
     [[-6.2,-1],[6.2,-1]].forEach(([x,z])=>{k.cyl(s,.25,.3,1.3,pick(PROD),x,.4,z,12);k.ball(s,.25,'#F1E2D0',x,1.95,z,10);k.cyl(s,.05,.05,.4,'#666',x,0,z,6)});
     const mi=new THREE.Mesh(new THREE.PlaneGeometry(1.4,3),KIT.chrome('#D8ECF7'));mi.position.set(-7.8+.02,1.7,-3);mi.rotation.y=Math.PI/2;s.add(mi);
     k.box(s,2,.8,1,'#FFFFFF',2.5,0,.5);for(let i=0;i<4;i++)k.box(s,.5,.12,.5,pick(PROD),2+i*.35,.8+(i%2)*.12,.5);
     counter(s,-4,1.2,2.2,'#D9465E');register(s,-4.4,1.18,1.1);person(s,0,-1,'#8B5CF6',.4);return r},
   tech(P){const r=room(P,{floor:'#E9ECF3',floorAlt:'#DDE2EC',wall:'#E3EAF5'});const s=r.s,k=K();
     for(let i=0;i<4;i++)for(let j=0;j<2;j++){k.box(s,2.2,1.3,.1,'#1E1F2A',-4.5+i*3,1.5+j*1.6,r.back+.15);const m=new THREE.Mesh(new THREE.PlaneGeometry(2,1.1),basic(pick(['#3F3FD4','#22B8CF','#8B5CF6','#2DB36F'])));m.position.set(-4.5+i*3,2.15+j*1.6,r.back+.22);s.add(m)}
     [[-3,-1.5],[3,-1.5],[0,.3]].forEach(([x,z])=>{k.box(s,2.6,.9,1.2,'#FFFFFF',x,0,z);for(let i=0;i<3;i++){k.box(s,.5,.03,.35,'#C9CED8',x-.8+i*.8,.92,z);const sc=k.box(s,.5,.32,.03,'#2F3142',x-.8+i*.8,.93,z-.17);sc.rotation.x=-.25}
       for(let i=0;i<2;i++)k.box(s,.18,.02,.34,'#1E1F2A',x-.4+i*.8,.92,z+.4)});
     person(s,5,-1,'#3F3FD4',-.5);return r},
   furniture(P){const r=room(P,{floor:'#E8DCCB',floorAlt:'#DCCDB8',planks:1,wall:'#F1E9DD'});const s=r.s,k=K();
     k.box(s,3,.5,1.1,'#2DB36F',-3.5,0,-3);k.box(s,3,.8,.3,'#2DB36F',-3.5,.4,-3.45);k.cyl(s,.5,.5,.06,'#B9875A',-3.5,.5,-1.6,18);
     k.box(s,2,.45,2.8,'#8E6E5A',3.5,0,-3.5);k.box(s,1.9,.25,2.6,'#FFFFFF',3.5,.45,-3.5);k.box(s,1.92,.08,1.6,'#E0605F',3.5,.7,-3);
     [[-6,-3.5],[0.5,-4.5]].forEach(([x,z])=>{k.cyl(s,.04,.04,2,'#2F3142',x,0,z,6);k.cone(s,.4,.5,'#FFF3D6',x,1.9,z,12)});
     const rug=new THREE.Mesh(new THREE.CircleGeometry(1.4,32),KIT.M('#B69BE0'));rug.rotation.x=-Math.PI/2;rug.position.set(0,.02,-.5);s.add(rug);
     for(let i=0;i<3;i++)k.box(s,.6,.02,.3,'#F7C948',-4+i*3.5,1.4,-2.3);plant(s,6.5,0);person(s,-.5,-2,'#B07A4A',.3);return r},
   toys(P){const r=room(P,{floor:'#FFF1F7',floorAlt:'#FFE3EF',wall:'#FFE9F3'});const s=r.s,k=K();
     for(let x=-6;x<7;x+=3){shelf(s,x,r.back+.6,2.6,2.6,0,'#F59E0B')}
     for(let i=0;i<6;i++){const c=pick(['#B9875A','#F7A23B','#E0605F','#8B5CF6']);const x=-5+i*2,z=-1.5+(i%2);k.ball(s,.4,c,x,.4,z,12);k.ball(s,.3,c,x,1,z,12)}
     for(let i=0;i<8;i++)k.ball(s,.22,pick(PROD),rr(-6,6),.22,rr(0,2),12);
     for(let i=0;i<6;i++)k.box(s,.4,.4,.4,pick(PROD),3+(i%3)*.42,Math.floor(i/3)*.4,1);person(s,-1,0,'#F59E0B',.2);return r},
   cinema(P){const r=room(P,{dark:1,floor:'#3B2F55',floorAlt:'#33294A',wall:'#2A2140',noSign:1,ceil:'#1E1830',w:18,d:14});const s=r.s,k=K();
     const scr=new THREE.Mesh(new THREE.PlaneGeometry(12,5),new THREE.MeshBasicMaterial({map:tex((g,w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#3F3FD4');gr.addColorStop(.5,'#E2643A');gr.addColorStop(1,'#F7C948');g.fillStyle=gr;g.fillRect(0,0,w,h);g.font='900 40px Nunito, sans-serif';g.fillStyle='rgba(255,255,255,.9)';g.textAlign='center';g.fillText('🎬',w/2,h/2+14)},256,128)}));
     scr.position.set(0,3,r.back+.2);s.add(scr);const sl=new THREE.PointLight(0x9fb4ff,.9,25);sl.position.set(0,3,r.back+4);s.add(sl);
     for(let row=0;row<4;row++)for(let i=-6;i<=6;i++){if(i===0)continue;const g=new THREE.Group();g.position.set(i*1,row*.25,-2.5+row*1.6);s.add(g);k.box(g,.8,.5,.7,'#C8263F',0,.1,0);k.box(g,.8,.8,.15,'#C8263F',0,.4,.3)}
     for(let i=0;i<10;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.07,6,6),basic('#FFE27A'));l.position.set(-8.7,.3,-9+i*1.2);s.add(l)}
     const ex=KIT.signPlane(s,'SORTIE','#24A866','#fff',1,.3,7.5,4,-9);
     r.cam.position.set(0,4,8);r.cam.lookAt(0,2.4,-6);return r},
   fun(P){const r=room(P,{floor:'#2F3142',floorAlt:'#262838',wall:'#3A2F66',dark:1,w:18,d:16});const s=r.s,k=K();
     for(let l=-3;l<=3;l++){k.box(s,1.4,.06,14,'#E8C99A',l*2.2,0,-6);k.box(s,.15,.12,14,'#2F3142',l*2.2+.78,0,-6);
       for(let p=0;p<4;p++)for(let q=0;q<=p;q++)k.cyl(s,.07,.1,.45,'#FFFFFF',l*2.2-p*.12+q*.24,.06,-12.4+p*.3,8)}
     for(let i=0;i<7;i++)k.ball(s,.22,pick(['#E5484D','#3F3FD4','#2DB36F','#F7A23B','#8B5CF6']),-6+i*.5,1.1,2,12);k.box(s,4,1,.6,'#555',-4.5,0,2);
     for(let i=0;i<6;i++){const n=new THREE.Mesh(new THREE.BoxGeometry(2.5,.12,.12),basic(pick(['#FF4FD8','#22E3FF','#FFE27A'])));n.position.set(-6+i*2.4,4.6,-6);s.add(n)}
     const pl=new THREE.PointLight(0xff7fe0,.7,30);pl.position.set(0,4,-2);s.add(pl);r.cam.position.set(0,3.6,6.5);r.cam.lookAt(0,1,-8);return r},
   resto(P){const r=room(P,{floor:'#E8D5BE',floorAlt:'#DCC5A8',planks:1,wall:P.wall||'#FFF4E6'});const s=r.s,k=K();
     [[-4.5,-3],[0,-3.5],[4.5,-3],[-2.5,-.6],[2.5,-.6]].forEach(([x,z])=>{table(s,x,z,.7,'#FFFFFF');chair(s,x-.9,z,P.acc,Math.PI/2);chair(s,x+.9,z,P.acc,-Math.PI/2);
       [-.25,.25].forEach(o=>k.cyl(s,.17,.17,.02,'#F4F5F7',x+o,.93,z,14));const lamp=k.cone(s,.35,.3,P.acc,x,3.9,z,12);k.box(s,.02,1,.02,'#333',x,4.2,z)});
     k.box(s,5,1.1,.9,'#7A5236',0,0,r.back+1.5);k.box(s,5.1,.08,1,'#3A2A20',0,1.1,r.back+1.5);for(let i=0;i<8;i++)k.cyl(s,.08,.08,.35,pick(['#2DB36F','#E5484D','#F7C948','#8B5CF6']),-2+i*.55,2.4,r.back+.3,8);
     k.box(s,5,.06,.4,'#7A5236',0,2.3,r.back+.35);plant(s,-7,1.2);plant(s,7,1.2);person(s,-2.4,-1.6,'#FFFFFF',.2);return r},
   bank(P){const r=room(P,{floor:'#EDE7DA',floorAlt:'#E0D8C6',wall:P.wall||'#F6F1E6'});const s=r.s,k=K();
     for(let i=-1;i<=1;i++){counter(s,i*4,-3.2,3.2,'#FFFFFF',P.acc||'#8B5CF6');const gl=new THREE.Mesh(new THREE.BoxGeometry(3,1.2,.05),new THREE.MeshPhongMaterial({color:'#DFF3FF',transparent:true,opacity:.45}));gl.position.set(i*4,1.75,-3.2);s.add(gl);
       register(s,i*4+.8,1.18,-3.4);person(s,i*4,-4.3,pick(['#3F3FD4','#2F3142','#8B5CF6']),0)}
     for(let i=0;i<5;i++){k.cyl(s,.06,.08,1,'#C9A86A',-3+i*1.5,0,0,8);k.ball(s,.09,'#C9A86A',-3+i*1.5,1,0,8)}for(let i=0;i<4;i++){const rope=k.box(s,1.4,.06,.06,'#C8263F',-2.25+i*1.5,.85,0)}
     for(let i=0;i<3;i++)chair(s,6+(i%2)*.1,-1+i*.8,'#3F6FB5',-Math.PI/2);plant(s,-7,-4);plant(s,7,-4);
     if(P.ic==='🏛️'){[['#2F4FA0',-.4],['#FFFFFF',0],['#D9364D',.4]].forEach(([c,o])=>{const f=new THREE.Mesh(new THREE.PlaneGeometry(.4,1.2),basic(c));f.position.set(-6+o,3.4,r.back+.2);s.add(f)});k.cyl(s,.03,.03,4,'#999',-6.6,0,r.back+.25,6)}
     const coin=k.cyl(s,.6,.6,.12,KIT.chrome('#F5C542'),5,3.2,r.back+.3,24);coin.rotation.x=Math.PI/2;r.spin=coin;return r},
   library(P){const r=room(P,{floor:'#D9C3A5',floorAlt:'#CDB491',planks:1,wall:'#E9D8C4'});const s=r.s,k=K();
     for(let x=-6.5;x<7;x+=2.6)shelf(s,x,r.back+.6,2.4,3.6,0,'#7A5236',['#E0605F','#3F3FD4','#2DB36F','#F7A23B','#8B5CF6','#22B8CF']);
     [-6.6,6.6].forEach((x,j)=>shelf(s,x,-2,3,3.2,j?-Math.PI/2:Math.PI/2,'#7A5236',['#E0605F','#3F3FD4','#2DB36F','#F7A23B']));
     [[-2,-1.5],[2,-1.5]].forEach(([x,z])=>{k.box(s,2.6,.08,1.4,'#B9875A',x,.85,z);[[-1.2,-.6],[1.2,-.6],[-1.2,.6],[1.2,.6]].forEach(([a,b])=>k.box(s,.08,.85,.08,'#7A5236',x+a,0,z+b));chair(s,x-.6,z+1,'#7C4DDB',Math.PI);chair(s,x+.6,z-1,'#7C4DDB');
       k.box(s,.5,.06,.35,'#FFFFFF',x,.93,z);k.cone(s,.2,.25,'#2DB36F',x+.9,1.15,z,10);k.cyl(s,.03,.03,.3,'#555',x+.9,.9,z,6)});
     person(s,3,0,'#7C4DDB',-.4);return r},
   post(P){const r=room(P,{floor:'#F3EFE2',floorAlt:'#E8E2CF',wall:'#FFF6D6'});const s=r.s,k=K();
     counter(s,-2,-3.2,6,'#FFFFFF','#2F7DD8');register(s,-3,1.18,-3.4);person(s,-2,-4.3,'#2F7DD8',0);
     for(let i=0;i<5;i++)for(let j=0;j<4;j++)k.box(s,.7,.55,.1,'#F2C94C',3+i*.75,.8+j*.6,r.back+.2);
     for(let i=0;i<7;i++)k.box(s,rr(.6,1.1),rr(.4,.8),rr(.5,.8),'#C8A16A',rr(-6.5,-4.5),Math.floor(i/3)*.6,rr(-1,1));
     k.box(s,.8,1.4,.6,'#F2C94C',5.5,0,0);k.box(s,.5,.06,.04,'#2F3142',5.5,1.1,.31);return r},
   hospital(P){const r=room(P,{floor:'#F4F8FB',floorAlt:'#E7EFF5',wall:'#F5FAFF'});const s=r.s,k=K();
     const cx=new THREE.Group();cx.position.set(-4.5,3.2,r.back+.2);s.add(cx);k.box(cx,1.2,.4,.06,'#24A866',0,-.2,0);k.box(cx,.4,1.2,.06,'#24A866',0,-.6,0);
     if(P.ic==='💊')for(let x=-2;x<7;x+=2.4)shelf(s,x,r.back+.6,2.2,2.8,0,'#FFFFFF',['#FFFFFF','#E3F6EC','#DDEBFF','#FDE8E8','#24A866']);
     else{k.box(s,1.2,2.4,.1,'#8E6E5A',3,0,r.back+.2);k.signPlane(s,'Dr Martin · Médecin généraliste','#FFFFFF','#2F7DD8',3,.5,0,2.6,r.back+.18)}
     counter(s,-3,-1.5,3,'#FFFFFF','#2F7DD8');register(s,-2.3,1.18,-1.6);person(s,-3,-2.6,'#FFFFFF',0);
     for(let i=0;i<4;i++)chair(s,4+i*.8,0,'#22B8CF',Math.PI);plant(s,7,-3.5);return r},
   office(P){const r=room(P,{floor:'#D8DEE8',floorAlt:'#CCD3DF',wall:'#EEF1F6'});const s=r.s,k=K();
     [[-4,-3],[0,-3],[4,-3],[-2,-.6],[2,-.6]].forEach(([x,z],i)=>{k.box(s,2.2,.08,1.1,'#FFFFFF',x,.85,z);[[-1,-.45],[1,-.45],[-1,.45],[1,.45]].forEach(([a,b])=>k.box(s,.06,.85,.06,'#9AA0AB',x+a,0,z+b));
       k.box(s,.9,.55,.05,'#2F3142',x,.95,z-.3);const sc=new THREE.Mesh(new THREE.PlaneGeometry(.82,.47),basic(pick(['#7FD3FF','#B9F3C8','#FFE27A'])));sc.position.set(x,1.25,z-.27);s.add(sc);chair(s,x,z+.8,'#3F3FD4',Math.PI);if(i%2)person(s,x+.5,z+1.1,pick(PROD),Math.PI)});
     k.box(s,3,1.6,.06,'#FFFFFF',-4,1.2,r.back+.2);k.box(s,1.2,.04,.07,'#E5484D',-4.5,2.3,r.back+.24);k.box(s,1.6,.04,.07,'#3F3FD4',-3.8,1.9,r.back+.24);
     k.cyl(s,.25,.25,1.1,'#FFFFFF',6.5,0,-4,12);k.cyl(s,.2,.2,.5,'#BFE3F5',6.5,1.1,-4,12);plant(s,-7,0);plant(s,7,0);return r},
   garage(P){const r=room(P,{floor:'#B9BEC8',floorAlt:'#AEB3BE',wall:'#E9ECF1',w:18});const s=r.s,k=K();
     k.box(s,4.5,.06,.12,'#F7C948',0,0,-1);k.box(s,4.5,.06,.12,'#F7C948',0,0,-5);
     const car=new THREE.Group();car.position.set(0,1.3,-3);s.add(car);k.box(car,3,.65,1.5,KIT.chrome('#E5484D'),0,.3,0);k.box(car,1.6,.55,1.35,'#CFE3F5',-.2,.95,0);[[-1,.75],[1,.75],[-1,-.75],[1,-.75]].forEach(([a,b])=>{const w=k.cyl(car,.35,.35,.25,'#222',a,.15,b,12);w.rotation.x=Math.PI/2});
     [-1.6,1.6].forEach(x=>k.box(s,.3,1.3,.3,'#E2643A',x,0,-3));k.box(s,3.6,.12,1.8,'#9AA0AB',0,1.2,-3);
     k.box(s,4,2.4,.06,'#8E6E5A',-5,1,r.back+.2);for(let i=0;i<8;i++)k.box(s,.08,rr(.4,.8),.08,'#2F3142',-6.5+i*.4,2,r.back+.25);
     for(let i=0;i<4;i++){const t=k.cyl(s,.45,.45,.3,'#222',6,i*.3,-1.5,16)}person(s,2.5,-1,'#2F7DD8',-.6);return r},
   agency(P){const r=room(P,{floor:'#EDE9E0',floorAlt:'#E2DCCF',planks:1,wall:'#F7F3EA'});const s=r.s,k=K();
     for(let i=0;i<6;i++){const x=-6+i*2.4;frame(s,x,2.7,r.back+.2,1.6,1.1,pick(['#BFE3FF','#D7EBD0','#FFE9D2']));emo(s,pick(['🏡','🏠','🏢','🏘️']),x,2.7,r.back+.3,.8)}
     [[-2.5,-2],[2.5,-2]].forEach(([x,z])=>{k.box(s,2.4,.08,1.1,'#B9875A',x,.85,z);k.box(s,2.3,.85,.08,'#B9875A',x,0,z+.5);chair(s,x,z+1,'#2DB36F',Math.PI);chair(s,x,z-1,'#2F3142');k.box(s,.6,.4,.04,'#2F3142',x+.6,.95,z-.3)});
     k.box(s,1.2,.8,.06,'#8E6E5A',6,1.6,r.back+.2);for(let i=0;i<6;i++)emo(s,'🔑',5.6+(i%3)*.4,2.2-Math.floor(i/3)*.4,r.back+.3,.3);
     person(s,-2.5,-3,'#2DB36F',0);plant(s,7,0);return r},
   school(P){const r=room(P,{floor:'#E8D5BE',floorAlt:'#DCC5A8',planks:1,wall:'#FFF4D6'});const s=r.s,k=K();
     k.box(s,6,2.2,.08,'#2F5D3A',0,1.3,r.back+.2);const t=KIT.signPlane(s,'2 + 2 = 4   ·   10 € − 7 € = 3 €','#2F5D3A','#FFFFFF',5,.6,0,2.4,r.back+.26);
     for(let i=-1;i<=1;i++)for(let j=0;j<2;j++){const x=i*3,z=-2.5+j*2;k.box(s,1.4,.06,.8,'#F2C94C',x,.75,z);[[-.6,-.35],[.6,-.35],[-.6,.35],[.6,.35]].forEach(([a,b])=>k.box(s,.05,.75,.05,'#777',x+a,0,z+b));chair(s,x,z+.7,'#E0605F',Math.PI)}
     k.box(s,2,.9,1,'#B9875A',4.5,0,r.back+2);emo(s,'🍎',4.5,1.15,r.back+2,.5);emo(s,'🌍',-6,1.6,r.back+1,1.2);return r},
   travel(P){const r=room(P,{floor:'#E8F4FB',floorAlt:'#DCEEF8',wall:'#E0F2FF'});const s=r.s,k=K();
     ['🏝️','🗼','🏔️','🗽','🌋'].forEach((e,i)=>{const x=-5.6+i*2.8;frame(s,x,2.7,r.back+.2,2,1.4,pick(['#7EC3F2','#FFE2B8','#B9F3C8']));emo(s,e,x,2.7,r.back+.3,1)});
     const gl=k.ball(s,.8,'#3F8FD8',5.5,1.6,-2,20);r.spin=gl;k.cyl(s,.06,.06,1,'#B9875A',5.5,0,-2,8);
     [[-2.5,-2],[1.5,-2]].forEach(([x,z])=>{k.box(s,2.4,.08,1.1,'#FFFFFF',x,.85,z);k.box(s,2.3,.85,.08,'#22B8CF',x,0,z+.5);chair(s,x,z+1,'#22B8CF',Math.PI);k.box(s,.6,.4,.04,'#2F3142',x,.95,z-.3)});
     person(s,-2.5,-3,'#22B8CF',0);emo(s,'✈️',0,4,r.back+1,1.2);return r},
   tabac(P){const r=room(P,{floor:'#EDE2D3',floorAlt:'#E2D3BF',wall:'#F1E2D0'});const s=r.s,k=K();
     for(let x=-6;x<0;x+=2)shelf(s,x,r.back+.6,1.8,2.4,0,'#8E6E5A',['#FFFFFF','#F4F5F7','#FFE9D2','#DDEBFF']);
     counter(s,3,-2.5,4.5,'#C8463F','#2F3142');register(s,2,1.18,-2.6);person(s,3,-3.6,'#C8463F',0);
     k.box(s,1.4,1.8,.6,'#F7C948',6.5,0,-1);emo(s,'🎰',6.5,2.3,-1,.9);for(let i=0;i<6;i++)k.box(s,.4,.6,.05,'#FFFFFF',-6+i*.5,1.2,-.5);return r},
   home(P){const r=room(P,{floor:'#D9B48A',floorAlt:'#CFA77B',planks:1,wall:'#FFF1DC',noSign:1});const s=r.s,k=K();
     k.box(s,3,.5,1.1,'#E2643A',-3,0,-3.5);k.box(s,3,.8,.3,'#E2643A',-3,.4,-4);k.cyl(s,.6,.6,.06,'#B9875A',-3,.45,-2,18);
     k.box(s,3,.6,.8,'#B9875A',3.5,0,r.back+.6);k.box(s,2.6,1.4,.08,'#1E1F2A',3.5,.65,r.back+.6);const sc=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.25),basic('#3F3FD4'));sc.position.set(3.5,1.35,r.back+.66);s.add(sc);
     frame(s,-3,3,r.back+.2,2.2,1.4,'#BFE3FF');plant(s,6.8,-1);const rug=new THREE.Mesh(new THREE.CircleGeometry(1.5,32),KIT.M('#B69BE0'));rug.rotation.x=-Math.PI/2;rug.position.set(0,.02,-1);s.add(rug);
     emo(s,'📬',-6.5,1.2,-1,.9);return r},
  };
  const ALIAS={pay:'bank',townhall:'bank',cafe:'resto',pharmacy:'hospital'};
  function build(pl){
    if(cache[pl])return cache[pl];const P=PLACES[pl]||PLACES.cafe;
    const fn=DECOR[pl]||DECOR[ALIAS[pl]]||DECOR.clothes;const r=fn(P);
    return cache[pl]=r;
  }
  return{build,has:pl=>pl!=='park'};
})();
