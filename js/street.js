/* =========================================================
   Capylum — LE MOIS EN 3D : on marche dans une rue,
   chaque bâtiment est un jour du mois et on entre dedans.
   (remplace l'ancien plateau calendrier + dé)
   ========================================================= */
const PLACES={
 home:{n:'Chez moi',ic:'🏠',k:'house',wall:'#FFF1DC',acc:'#E0605F'},
 pay:{n:'Banque · jour de paie',ic:'💶',k:'bank',wall:'#F6F1E6',acc:'#24A866',sign:'BANQUE'},
 bank:{n:'Banque',ic:'🏦',k:'bank',wall:'#F6F1E6',acc:'#8B5CF6',sign:'BANQUE'},
 townhall:{n:'Mairie & impôts',ic:'🏛️',k:'bank',wall:'#EEF1F6',acc:'#3F6FB5',sign:'MAIRIE'},
 super:{n:'Supermarché',ic:'🛒',wall:'#EAF5E1',acc:'#2DB36F',sign:'SUPERMARCHÉ',w:7},
 bakery:{n:'Boulangerie',ic:'🥖',wall:'#FBE8C8',acc:'#C8863F',sign:'BOULANGERIE'},
 clothes:{n:'Boutique de mode',ic:'👕',wall:'#FCE4EC',acc:'#D9465E',sign:'MODE'},
 tech:{n:'Magasin high-tech',ic:'📱',wall:'#E3EAF5',acc:'#3F3FD4',sign:'HIGH-TECH'},
 furniture:{n:'Magasin de meubles',ic:'🛋️',wall:'#F1E9DD',acc:'#B07A4A',sign:'MEUBLES'},
 cinema:{n:'Cinéma',ic:'🎬',wall:'#463A66',acc:'#E5484D',sign:'CINÉMA',deco:'marquee'},
 resto:{n:'Restaurant',ic:'🍽️',wall:'#FFF4E6',acc:'#E2643A',sign:'RESTAURANT'},
 cafe:{n:'Café',ic:'☕',wall:'#EADBC8',acc:'#7A5236',sign:'CAFÉ'},
 fun:{n:'Salle de loisirs',ic:'🎳',wall:'#E7E4FF',acc:'#8B5CF6',sign:'LOISIRS',deco:'marquee'},
 office:{n:'Bureau',ic:'💼',k:'tower',wall:'#5B86DE',acc:'#3F3FD4',sign:'BUREAU'},
 garage:{n:'Garage',ic:'🔧',wall:'#E9ECF1',acc:'#E2643A',sign:'GARAGE',deco:'bigdoor'},
 hospital:{n:'Cabinet médical',ic:'🩺',wall:'#F5FAFF',acc:'#2F7DD8',sign:'MÉDECIN',deco:'cross'},
 pharmacy:{n:'Pharmacie',ic:'💊',wall:'#F3FBF5',acc:'#24A866',sign:'PHARMACIE',deco:'cross'},
 post:{n:'Bureau de poste',ic:'📬',wall:'#FFF6D6',acc:'#2F7DD8',sign:'POSTE',deco:'mailbox'},
 library:{n:'Bibliothèque',ic:'📚',k:'bank',wall:'#E9D8C4',acc:'#7C4DDB',sign:'BIBLIOTHÈQUE'},
 school:{n:'École',ic:'🏫',wall:'#F2C94C',acc:'#B9433E',sign:'ÉCOLE'},
 park:{n:'Parc',ic:'🌳',k:'park'},
 agency:{n:'Agence immobilière',ic:'🔑',wall:'#F7F3EA',acc:'#2DB36F',sign:'AGENCE IMMO'},
 toys:{n:'Magasin de jouets',ic:'🧸',wall:'#FFE9F3',acc:'#F59E0B',sign:'JOUETS'},
 tabac:{n:'Tabac-presse',ic:'🎰',wall:'#F1E2D0',acc:'#C8463F',sign:'PRESSE'},
 travel:{n:'Agence de voyages',ic:'✈️',wall:'#E0F2FF',acc:'#22B8CF',sign:'VOYAGES'},
};
const EMO_PL={'🛒':'super','⚖️':'super','🥫':'super','🗑️':'home','🍕':'home','📱':'tech','💻':'tech','🎧':'tech','📺':'tech','🎮':'tech','🍿':'tech',
 '🏦':'bank','🐷':'bank','📊':'bank','💳':'bank','📉':'bank','🌍':'bank','🪙':'bank','🧓':'bank','📆':'bank','💼':'bank','🔁':'bank','🌱':'bank',
 '👟':'clothes','👕':'clothes','🧥':'clothes','🕶️':'clothes','⌚':'clothes','👖':'home','🎬':'cinema','🍔':'resto','🍽️':'resto','🍱':'resto','🍻':'cafe','☕':'cafe',
 '🎳':'fun','🎤':'fun','🎡':'fun','🎢':'fun','🏖️':'travel','✈️':'travel','🚗':'garage','🔧':'garage','🛞':'garage','🚲':'garage','🛵':'garage',
 '🤒':'pharmacy','🦷':'hospital','🏥':'hospital','👓':'pharmacy','📝':'office','⏰':'office','📄':'post','📬':'post','💌':'post','📦':'post','💧':'post','🎣':'post',
 '🏛️':'townhall','🧾':'townhall','🛋️':'furniture','🛏️':'furniture','🪴':'furniture','🍳':'furniture','📋':'agency','🔑':'agency','🔎':'agency','🔨':'agency','🔥':'home',
 '🌡️':'home','🔊':'home','☀️':'agency','🎰':'tabac','📚':'library','🧸':'toys','⚽':'toys','🃏':'toys','🍬':'bakery','🍦':'park','🎁':'toys','🎄':'toys','🎂':'resto',
 '📸':'park','🚨':'park','🧽':'home','🏆':'school','😢':'school','🤝':'school','🧹':'home','💰':'bank','🛡️':'tech','🤝':'cafe','🎟️':'fun'};
function placeOf(type,card){
  if(card&&card.pl)return card.pl;
  if(card&&/voiture|auto|contr[ôo]le technique/i.test(card.t||''))return'garage';
  if(card&&EMO_PL[card.e]){const p=EMO_PL[card.e];return p==='school'&&!isKid()?'park':p}
  if(type==='quiz')return isKid()?'school':'library';
  return{choice:'cafe',shop:'clothes',event:'pharmacy',luck:'park',mail:'post',sortie:'fun'}[type]||'cafe';
}
const CARD_T=['choice','quiz','shop','event','luck','mail','sortie'];
const SP=4,dayX=d=>R&&R.xd?R.xd[clamp(d,1,R.xd.length)-1]:(d-1)*SP;
const dayAt=x=>{if(!(R&&R.xd))return Math.floor((x+.01)/SP)+1;let d=1;R.xd.forEach((v,i)=>{if(v<=x+.01)d=i+1});return d};
/* Position de chaque jour dans la rue : les bâtiments ne se chevauchent jamais */
function layoutDays(){const xd=[];const st=R.stops;xd[0]=0;
  for(let k=0;k<st.length-1;k++){const a=st[k],b=st[k+1],x0=xd[a.d-1],gap=Math.max(9,(b.d-a.d)*SP);for(let d=a.d+1;d<=b.d;d++)xd[d-1]=x0+(d-a.d)/(b.d-a.d)*gap}
  R.xd=xd}

/* ---------- Génération des étapes du mois (remplace le dé) ---------- */
buildBoard=function(){
  const P=PAR[R.p];R.fixed=P.fixed();R.v2=1;R.sid=R.sid||Date.now();
  const forced=R.fixed.filter(f=>f.groc).map(f=>f.d).sort((a,b)=>a-b);
  const W=weights(),tot=Object.values(W).reduce((a,b)=>a+b,0);
  const stops=[{d:1,type:'start',pl:'home',wd:R.wd0}];let d=1;
  while(d<R.days){
    let nd=Math.min(R.days,d+2+Math.floor(Math.random()*3));
    const f=forced.find(x=>x>d&&x<=nd);if(f)nd=f;else if(R.days-nd<2)nd=R.days;
    const wd=(R.wd0+nd-1)%7;let type;
    if(nd===R.days)type='pay';else if(forced.includes(nd))type='groc';else if(wd===6)type='rest';else if(wd===5)type='sortie';
    else{let r=Math.random()*tot;type='choice';for(const[k,w]of Object.entries(W)){r-=w;if(r<=0){type=k;break}}}
    const s={d:nd,type,wd};
    if(CARD_T.includes(type)){s.idx=drawCard(type);s.pl=placeOf(type,cardsOf(type)[s.idx])}else s.pl={pay:'pay',groc:'super',rest:'park'}[type];
    stops.push(s);d=nd;
  }
  R.stops=stops;R.si=0;R.pos=1;layoutDays();
};
const nextStop=()=>R&&R.stops&&R.stops[R.si+1];

/* ---------- Avancer jusqu'au prochain bâtiment ---------- */
async function advance(){
  if(!R||R.busy||R.phase!=='play'||R.pending)return;
  const nx=nextStop();if(!nx)return payday();
  R.busy=true;renderControls();beep('step');
  // on s'arrête devant chaque facture du chemin : elle arrive comme dans la vraie vie
  const halts=[...new Set(R.fixed.filter(f=>f.d>R.pos&&f.d<nx.d&&!f.groc).map(f=>f.d))].sort((a,b)=>a-b).concat(nx.d);
  for(const t of halts){
    await STREET.walkTo(t,d=>{if(d>R.pos){R.pos=d;updateHud();updateProg()}});
    R.pos=t;const b=processFixed(t);updateHud();updateProg();
    if(b.length){STREET.sit();await showInvoices(b,t)}
  }
  R.si++;R.pos=nx.d;R.busy=false;save();renderBoard();arrive();
}
function arrive(){
  const s=R.stops[R.si];if(!s)return;
  if(s.type==='pay')return STREET.enter(()=>payday());
  if(s.type==='rest'){G.joy=clamp(G.joy+3,0,100);toast('🌳 Dimanche au parc : repos ! +3 😊','pos');beep('coin');STREET.sit();save();renderBoard();return}
  if(s.type==='groc'){R.pending={groc:1,d:s.d};save();return STREET.enter(()=>openGroceries())}
  const L=cardsOf(s.type);let idx=s.idx;if(!L[idx]||(L[idx].cond&&!L[idx].cond(G))){idx=drawCard(s.type);s.idx=idx}
  const card=L[idx];R.pending={type:s.type,idx};save();
  if(card.pre&&!R.pending.preDone){apply(card.pre);R.pending.preDone=true}
  STREET.enter(()=>showCard(card,{...TYPES[s.type],place:PLACES[s.pl]},s));
}

/* ---------- Rendu de l'écran du mois ---------- */
function progHTML(){
  const n=R.days,pct=d=>((d-1)/(n-1)*100).toFixed(2);
  return`<div class="prog" data-a="month"><i style="width:${pct(R.pos)}%"></i>${R.stops.slice(1).map((s,i)=>`<span class="${i+1<=R.si?'done':''}" style="left:${pct(s.d)}%">${PLACES[s.pl].ic}</span>`).join('')}<b style="left:${pct(R.pos)}%">${avatarSVG(G.char,24)}</b></div>`;
}
function updateProg(){const p=$('#stprog');if(p&&R&&R.stops)p.innerHTML=progHTML();const d=$('#stday');if(d&&R)d.textContent=`${JOURS[(R.wd0+R.pos-1)%7]} ${R.pos} ${MOIS[PAR[R.p].m]} ${PAR[R.p].y}`}
renderBoard=function(){
  if(!R)return;const P=PAR[R.p],saved=G.savings+G.invest-R.start.savings,b=$('#board');
  if(!R.stops&&R.phase!=='intro')buildBoard();
  if(!b.querySelector('#street')){b.innerHTML=`<div id="street"></div><div id="stfb" class="hidden"></div><div class="sthead" id="sthead"></div><div class="controls" id="stctrl"><div class="in" id="ctrl"></div></div>`;STREET.mount($('#street'))}
  b.style.setProperty('--pc',P.col);
  const day=R.stops?R.stops[R.si]||{d:1,wd:R.wd0}:{d:1,wd:R.wd0};
  $('#sthead').innerHTML=`<div class="bhead" style="--pc:${P.col}"><div class="bh1"><button class="bback" data-a="toCity">← Ville</button>
      <div class="btitle"><b>${P.ic} ${P.t}</b><small><span id="stday">${JOURS[(R.wd0+R.pos-1)%7]} ${R.pos} ${MOIS[P.m]} ${P.y}</span> · ${P.age} ans${G.job?` · ${G.job.n}`:G.summer?` · ${G.summer.n}`:''}</small></div><div class="bav">${avatarSVG(G.char,46)}</div></div>
      <div id="hud">${hudHTML()}</div></div>
    <div class="goal">🎯 Mets <b>${fmt(goalOf(P))}</b> de côté ce mois-ci <span class="muted">(${sign(saved)})</span><div class="gb"><i style="width:${clamp(saved/goalOf(P)*100,0,100)}%"></i></div></div>
    ${R.stops?`<div id="stprog">${progHTML()}</div>`:''}`;
  $('#stctrl').style.setProperty('--pc',P.col);
  renderControls();
  if(R.stops)STREET.show(R);
};
renderControls=function(){
  const c=$('#ctrl');if(!c||!R)return;
  const done=R.phase==='pay'||R.phase==='bilan',nx=nextStop();
  let main;
  if(done)main=`<button class="rollbtn" data-a="bilan">📊 Voir mon bilan</button>`;
  else if(!R.stops||R.phase==='intro')main=`<button class="rollbtn" disabled>…</button>`;
  else{const pl=PLACES[nx?nx.pl:'pay'];const bills=nx?R.fixed.filter(f=>f.d>R.pos&&f.d<=nx.d&&!f.groc):[];
    main=`<button class="rollbtn walk" data-a="roll" ${R.busy||R.pending?'disabled':''}><span>${R.busy?'🚶 En route…':'🚶 Avancer'}</span><small>${nx?`${pl.ic} ${pl.n} · ${JOURS[nx.wd].slice(0,3)}. ${nx.d}`:''}${bills.length?` · 🧾 ${bills.map(f=>`${f.ic} ${sign(f.a)}`).join(' ')}`:''}</small></button>`}
  c.innerHTML=`<button class="sqbtn" data-a="piggy"><span>🐷</span>Épargne</button>${main}<button class="sqbtn" data-a="month"><span>📅</span>Mon mois</button>`;
};

/* ---------- Le mois en un coup d'œil (calendrier + relevé) ---------- */
function monthModal(tab){
  tab=tab||'cal';const P=PAR[R.p];
  const stopAt=d=>R.stops&&R.stops.find(s=>s.d===d);
  const lead=Array.from({length:R.wd0},()=>'<div class="tile empty"></div>').join('');
  const tiles=Array.from({length:R.days},(_,i)=>{const d=i+1,s=stopAt(d),fx=R.fixed.filter(f=>f.d===d);
    const ic=s?PLACES[s.pl].ic:fx.length?fx[0].ic:'',amt=fx.reduce((a,f)=>a+f.a,0);const c=s?TYPES[s.type]?TYPES[s.type].c:'#E7E8FB':fx.length?'#FFEBD6':'#F3F4F8';
    return`<button class="tile ${d<R.pos?'past':''} ${d===R.pos?'now':''}" style="--tc:${c}" data-a="dayInfo" data-v="${d}"><span class="n">${d}</span>${ic}${amt&&!(s&&s.type==='groc')?`<span class="amt">${sign(amt).replace(' €','€')}</span>`:''}</button>`}).join('');
  const log=R.log.length?R.log.slice().reverse().map(l=>`<div class="r"><span><span class="d">${l.d} ${MC[P.m]}</span>${l.t}</span><b class="${l.cat==='epargne'?'sav':l.a<0?'neg':'pos'}">${l.a?sign(l.a):'✓'}</b></div>`).join(''):'<div class="r muted">Rien pour l’instant. Avance dans la rue !</div>';
  modal(`<div class="sh"><div class="ty"><span>📅 ${MOIS[P.m]} ${P.y}</span><span>jour ${R.pos} / ${R.days}</span></div><h3 style="margin-top:6px">Mon mois</h3></div><div class="sb">
    <div class="tabs2"><button class="${tab==='cal'?'on':''}" data-a="month" data-v="cal">🗓️ Calendrier</button><button class="${tab==='log'?'on':''}" data-a="month" data-v="log">🧾 Relevé de compte</button></div>
    ${tab==='cal'?`<div class="cal"><div class="wk">${['L','M','M','J','V','S','D'].map(x=>`<div>${x}</div>`).join('')}</div><div class="grid">${lead}${tiles}</div></div>
      <p style="font-size:13px;color:var(--muted);margin:10px 0 0">💡 Les cases avec un montant sont tes factures : elles partent toutes seules quand tu passes devant. Touche une case pour le détail.</p>`
      :`<div class="stmt" style="box-shadow:none;padding:0">${log}</div>`}
    <button class="btn" data-a="close">Fermer</button></div>`,P.col);
}
function dayInfo(d){d=+d;const s=R.stops&&R.stops.find(x=>x.d===d),fx=R.fixed.filter(f=>f.d===d&&!f.groc);
  const parts=[];if(s)parts.push(`${PLACES[s.pl].ic} ${PLACES[s.pl].n}`);fx.forEach(f=>parts.push(`${f.ic} ${f.t} ${sign(f.a)}`));if(s&&s.type==='pay')parts.push(`+${fmt(salary(R.p))}`);
  toast(`Le ${d} : ${parts.join(' · ')||'journée tranquille'}`)}

/* Les courses ne sont plus prélevées automatiquement : on les fait au supermarché */
processFixed=function(d){
  if(R.fdone[d])return[];R.fdone[d]=true;const L=R.fixed.filter(f=>f.d===d&&!f.groc);
  L.forEach(f=>{tx(f.a,`${f.ic} ${f.t}`,f.cat);beep(f.a<0?'step':'coin');STREET.billDone(d)});return L;
};

/* Anciennes sauvegardes (plateau calendrier) : on recommence le mois proprement */
function migrateRun(){
  if(G.run)G.run.busy=false;
  if(G.run&&!G.run.v2&&G.run.phase!=='intro'){const keep={char:G.char,sound:G.sound,stars:G.stars,done:G.done,persona:G.persona};
    try{G={...fresh(),...JSON.parse(G.run.snap),...keep}}catch(e){}G.run=null;G.screen='city';R=null;save()}
}

/* =========================================================
   LA RUE 3D
   ========================================================= */
const STREET=(()=>{
  let host=null,r=null,scene=null,cam=null,hero=null,key=null,raf=0,on=false,clock=null;
  let inside=null,insPl=null,ins=0,hx=0,hz=-4.2,walk=null,mode='out',enterCb=null,doorT=0,curStop=null,bills={},sitT=0,camX=0,stopG={};
  const K=()=>KIT;
  function mount(el){host=el;r=KIT.attach(el);if(!r){$('#stfb').classList.remove('hidden');return}
    window.addEventListener('resize',()=>{if(on&&host){r.setSize(host.clientWidth,host.clientHeight,false);fitCam()}})}
  function fitCam(){if(!cam||!host)return;cam.aspect=host.clientWidth/Math.max(1,host.clientHeight);cam.updateProjectionMatrix()}

  /* ----- Construction d'un bâtiment ----- */
  function building(pl,x,dayLbl){
    const k=K(),g=new THREE.Group();g.position.set(x,0,0);const P=PLACES[pl];const kind=P.k||'shop';
    const W=P.w||6,front=-5.4;let door=null,h=4,dw=1.3;
    if(kind==='park'){k.flat(g,7,6,'#8CC56C',0,.03,-8.4);k.tree(g,-2.4,-9.5,1.1,true);k.tree(g,2.6,-10,1.2);k.tree(g,1.5,-7.2,.8,true);
      k.box(g,1.6,.18,.5,'#B5835A',-.6,.45,-6.6);k.box(g,1.6,.5,.12,'#B5835A',-.6,.62,-6.85);[-1.2,0].forEach(o=>k.box(g,.1,.45,.4,'#555',o,0,-6.6));
      k.cyl(g,.9,1,.4,'#C9CED8',2.2,0,-7.5);k.flat(g,1.5,1.5,'#7FC2EE',2.2,.42,-7.5).geometry=new THREE.CircleGeometry(.75,20);
      const gate=new THREE.Group();g.add(gate);[-2.8,2.8].forEach(o=>k.box(gate,.25,1.5,.25,'#6B7080',o,0,front+.2));
      k.signPlane(g,'🌳 PARC','#2DB36F','#fff',2.2,.6,0,2.1,front+.25);k.box(g,6,.08,.08,'#6B7080',0,1.6,front+.2);h=3}
    else if(kind==='house'){const d=5;k.box(g,5,3,d,P.wall,0,0,front-d/2);k.roof(g,4,2,P.acc,0,3,front-d/2).scale.set(.9,1,.75);
      k.box(g,.7,1,.08,'#BFE3F2',-1.5,1.2,front+.02);k.box(g,.7,1,.08,'#BFE3F2',1.5,1.2,front+.02);
      k.signPlane(g,'🏠 CHEZ MOI','#fff','#E0605F',1.9,.45,0,2.65,front+.03);h=5;dw=1}
    else if(kind==='bank'){const d=5;k.box(g,W+.6,.5,d+.6,'#E7DEC9',0,0,front-d/2);k.box(g,W,3.2,d,P.wall,0,.5,front-d/2-.3);
      for(let c=-W/2+.6;c<=W/2-.5;c+=1.2)if(Math.abs(c)>.9)k.cyl(g,.2,.2,3.2,'#FFFFFF',c,.5,front+.15,10);
      k.box(g,W+.4,.4,d+.4,'#EFE7D3',0,3.7,front-d/2);const ped=new THREE.Mesh(new THREE.CylinderGeometry(1,1,W+.4,3),k.M('#FFFFFF'));ped.rotation.z=Math.PI/2;ped.rotation.x=-Math.PI/2;ped.scale.set(1,1,.5);ped.position.set(0,4.35,front-.2);g.add(ped);
      k.signPlane(g,P.sign,P.acc,'#fff',3,.5,0,3.5,front+.32);h=5.4}
    else if(kind==='tower'){const d=5;k.box(g,W-.6,9,d,k.chrome(P.wall),0,0,front-d/2);for(let y=1.4;y<9;y+=1.5)k.box(g,W-.4,.12,d+.1,'#E9EEF6',0,y,front-d/2);
      k.signPlane(g,P.sign,P.acc,'#fff',2.6,.6,0,3.1,front+.04);h=9.3}
    else{const d=5,H=P.k==='big'?4.2:3.6;h=H+.8;
      k.box(g,W,H,d,P.wall,0,0,front-d/2);k.box(g,W+.2,.3,d+.2,'#FFFFFF',0,H,front-d/2);
      // vitrines
      const wx=W/2-1.4;[-wx,wx].forEach(o=>{k.box(g,1.8,1.5,.08,k.glass(),o,.7,front+.03);k.box(g,1.9,.1,.12,'#fff',o,.65,front+.05)});
      // auvent rayé
      const n=Math.round(W/.6);for(let i=0;i<n;i++){const m=k.box(g,W/n,.12,1.1,i%2?'#FFFFFF':P.acc,-W/2+W/n*(i+.5),2.55,front+.5);m.rotation.x=.35}
      k.signPlane(g,`${P.ic} ${P.sign}`,P.acc,'#fff',Math.min(W-.6,4.4),.75,0,3.05,front+.04);
      if(P.deco==='cross'){const c=new THREE.Group();c.position.set(W/2-.1,3.2,front+.4);g.add(c);k.box(c,.9,.3,.1,'#2DB36F',0,-.15,0);k.box(c,.3,.9,.1,'#2DB36F',0,-.45,0)}
      if(P.deco==='marquee'){for(let i=0;i<9;i++)k.ball(g,.08,'#FFE27A',-2.2+i*.55,3.62,front+.06,6)}
      if(P.deco==='mailbox'){k.box(g,.5,.8,.4,'#F2C94C',W/2+.6,0,front+.8);k.box(g,.08,.5,.08,'#555',W/2+.6,-.0,front+.8)}
      if(P.deco==='bigdoor'){k.box(g,2.4,2.1,.06,'#B9BEC8',-wx,0,front+.05);for(let y=.3;y<2.1;y+=.35)k.box(g,2.4,.04,.08,'#9AA0AB',-wx,y,front+.06)}
      if(pl==='super')[[-W/2-.6,'#3F3FD4'],[-W/2-1.2,'#F7A23B']].forEach(([o,c])=>{k.box(g,.55,.5,.8,k.chrome(c),o,.25,front+1.2);k.box(g,.5,.05,.7,'#999',o,.2,front+1.2)});
    }
    if(kind!=='park'){
      const dg=new THREE.Group();dg.position.set(-dw/2,0,front+.04);g.add(dg);k.box(dg,dw,2.1,.08,kind==='tower'?k.glass():'#8E6E5A',dw/2,0,0);k.ball(dg,.06,'#F5C542',dw-.15,1.05,.08,6);door=dg;
      k.box(g,dw+.3,.15,.1,'#fff',0,2.1,front+.06);
      // halo de la porte
      const mat=new THREE.MeshBasicMaterial({color:'#FFE9A8',transparent:true,opacity:.0,depthWrite:false});const glow=new THREE.Mesh(new THREE.PlaneGeometry(dw,2.1),mat);glow.position.set(0,1.05,front+.02);g.add(glow);g.userData.glow=glow;
    }
    if(dayLbl){const s=KIT.label(dayLbl,{bg:'#FFFFFF',fg:'#2F3142',scale:.55});s.position.set(0,h+.9,front);g.add(s);g.userData.tag=s}
    g.userData.door=door;g.userData.h=h;scene.add(g);return g;
  }
  function filler(x){const k=K(),g=new THREE.Group();g.position.set(x,0,0);scene.add(g);
    const cols=['#F4E2C6','#DDE6F0','#F6D8D3','#E2EDD6','#EFE4CF'],rc=['#C8463F','#8E6E5A','#3F6FB5','#D98B3A'];const c=cols[Math.floor(Math.random()*5)];
    if(Math.random()<.5){k.box(g,3,2.4,3,c,0,0,-7.4);k.roof(g,2.4,1.4,rc[Math.floor(Math.random()*4)],0,2.4,-7.4);k.box(g,.6,.6,.06,'#BFE3F2',.7,1,-5.88)}
    else{k.tree(g,-1,-7,1.1,Math.random()<.5);k.tree(g,1.2,-8,1.3,Math.random()<.5)}}

  /* ----- Toute la rue pour ce mois ----- */
  function build(run){
    const k=K();scene=new THREE.Scene();stopG={};bills={};
    cam=new THREE.PerspectiveCamera(40,1,.5,400);fitCam();
    scene.add(new THREE.HemisphereLight(0xffffff,0x7a9a5c,.85));
    const sun=new THREE.DirectionalLight(0xfff3e0,.7);sun.position.set(-20,40,30);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
    Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:120});sun.shadow.bias=-.0006;scene.add(sun);scene.add(sun.target);scene.userData.sun=sun;
    if(!run.xd)layoutDays();const L=dayX(run.days)+40;
    k.flat(scene,L+60,80,'#8DB36B',L/2-30,0,0);
    k.flat(scene,L+60,6,'#7B8090',L/2-30,.01,0);
    k.flat(scene,L+60,2.2,'#D9D4C7',L/2-30,.02,-4.1);k.flat(scene,L+60,2.2,'#D9D4C7',L/2-30,.02,4.1);
    k.flat(scene,L+60,.2,'#B9B3A5',L/2-30,.03,-3.05);k.flat(scene,L+60,.2,'#B9B3A5',L/2-30,.03,3.05);
    {const geo=new THREE.PlaneGeometry(1.4,.16);geo.rotateX(-Math.PI/2);const n=Math.ceil((L+60)/3);const im=new THREE.InstancedMesh(geo,k.M('#F2F2F2'),n);const o=new THREE.Object3D();
     for(let i=0;i<n;i++){o.position.set(-30+i*3,.03,0);o.updateMatrix();im.setMatrixAt(i,o.matrix)}scene.add(im)}
    // fond : collines et immeubles lointains
    for(let x=-30;x<L+30;x+=7){const hh=4+Math.random()*9;k.box(scene,5,hh,4,['#C9D3E6','#D8DDE8','#BFCADF','#E1D9E8'][Math.floor(Math.random()*4)],x+Math.random()*2,0,-22-Math.random()*6)}
    for(let x=-30;x<L+30;x+=24){const m=new THREE.Mesh(new THREE.SphereGeometry(14,16,10),k.M('#7FA65E'));m.position.set(x,-6,-40);m.scale.y=.7;scene.add(m)}
    // trottoir d'en face : arbres + panneaux de factures
    for(let x=-20;x<L;x+=5.5+Math.random()*3)k.tree(scene,x,6.6+Math.random()*1.5,.9+Math.random()*.4,Math.random()<.5);
    // bâtiments
    const used=new Set();
    run.stops.forEach((s,i)=>{const x=dayX(s.d);used.add(s.d);stopG[i]=building(s.pl,x,i===0?null:`${JOURS[s.wd].slice(0,3)}. ${s.d}`)});
    for(let i=0;i<run.stops.length-1;i++){const a=dayX(run.stops[i].d),b=dayX(run.stops[i+1].d);if(b-a>=13)filler((a+b)/2)}
    filler(-9);filler(dayX(run.days)+9);
    // factures sur le trottoir d'en face
    const byDay={};run.fixed.filter(f=>!f.groc).forEach(f=>{(byDay[f.d]=byDay[f.d]||[]).push(f)});
    Object.entries(byDay).forEach(([d,fs])=>{d=+d;const x=dayX(d);const g=new THREE.Group();g.position.set(x,0,3.7);scene.add(g);
      k.cyl(g,.06,.06,1.6,'#6B7080',0,0,0,6);
      const tot=fs.reduce((a,f)=>a+f.a,0);const s=KIT.label(`${fs[0].ic} ${fs.length>1?fs.length+' factures':fs[0].t} ${sign(tot)}`,{bg:tot<0?'#FFE6E6':'#E2F7EC',fg:tot<0?'#B3262B':'#17734A',scale:.6,border:tot<0?'#E5484D':'#24A866'});
      s.position.set(0,2.1,0);g.add(s);bills[d]={g,s};if(run.fdone[d])done(d)});
    // nuages
    for(let i=0;i<8;i++)k.cloud(scene,-20+Math.random()*(L+20),16+Math.random()*6,-30-Math.random()*20,1.3);
    // héros
    hero=KIT.hero(G.char);hero.g.scale.setScalar(.75);scene.add(hero.g);
    hx=dayX(run.pos);hz=-4.2;hero.g.position.set(hx,0,hz);hero.g.rotation.y=Math.PI/2;camX=hx;mode='out';
    clock=new THREE.Clock();
  }
  function done(d){const b=bills[d];if(!b)return;b.s.material.opacity=.35;b.g.position.y=-.3}
  function show(run){
    if(!r){fbRender(run);return}
    if(key!==run.sid||!scene){key=run.sid;build(run);leaveIn()}
    const cur=run.stops[run.si];
    if(!inside&&cur&&((run.pending&&!run.pending.res&&!run.pending.intro)||run.phase==='pay'||run.phase==='bilan')&&INTERIOR.has(cur.pl))goIn(cur.pl);
    else if(!walk&&mode==='out'){hx=dayX(run.pos)}
    curStop=run.stops[run.si];
    // si la carte en cours est ouverte (reprise), on reste « à l'intérieur »
    on=true;KIT.attach(host);fitCam();if(!raf)loop();
  }
  function hide(){on=false}
  function fbRender(run){const el=$('#stfb');if(!el)return;el.classList.remove('hidden');
    el.innerHTML=`<div class="fbst">${run.stops.map((s,i)=>`<div class="${i<run.si?'past':i===run.si?'now':''}"><span>${PLACES[s.pl].ic}</span><small>${s.d}</small></div>`).join('')}</div>`;
    const now=el.querySelector('.now');if(now)now.scrollIntoView({inline:'center',block:'nearest'})}

  /* ----- Marche ----- */
  function walkTo(d,onDay){
    if(!r||!scene){return(async()=>{for(let x=R.pos+1;x<=d;x++){onDay(x);await sleep(220)}})()}
    return new Promise(res=>{walk={tx:dayX(d),onDay,res,last:dayAt(hx)};mode='out';hz=-4.2;hero.g.rotation.y=Math.PI/2});
  }
  function enter(cb){
    const key=R.stops[R.si].pl;
    if(!r||!scene){wipe(PAR[R.p].col,'🚪',cb);return}
    if(!INTERIOR.has(key)){sitT=1.2;setTimeout(cb,500);return}
    const g=stopG[R.si];mode='entering';doorT=0;enterCb=()=>{const pl=PLACES[key];wipe(pl.acc||PAR[R.p].col,pl.ic,()=>{goIn(key);setTimeout(cb,350)})};
    if(g&&g.userData.glow)g.userData.glow.material.opacity=.0;
  }
  function goIn(pl){
    try{inside=INTERIOR.build(pl)}catch(e){console.warn(e);inside=null;return}
    insPl=pl;scene.remove(hero.g);inside.s.add(hero.g);hero.g.position.set(0,0,.6);hero.g.rotation.y=.35;document.body.classList.add('inroom');fitIn();
  }
  function leaveIn(){
    document.body.classList.remove('inroom');if(!inside)return;inside.s.remove(hero.g);scene.add(hero.g);inside=null;insPl=null;hz=-5.3;
    const g=stopG[R&&R.si];if(g&&g.userData.door)g.userData.door.rotation.y=-1.4;
  }
  function fitIn(){if(!inside||!host)return;const w=host.clientWidth,h=Math.max(1,host.clientHeight),c=inside.cam;c.aspect=w/h;
    if(c.aspect<.9){c.fov=96;c.setViewOffset(w,h*2,0,h*.74,w,h)}else{c.fov=42;c.clearViewOffset()}c.updateProjectionMatrix()}
  function exit(){if(!scene)return;if(inside){const pl=PLACES[insPl];wipe('#8DB36B','🚶',()=>{leaveIn();mode='exiting';doorT=0});return}mode='exiting';doorT=0}
  function sit(){sitT=2.5}

  /* ----- Boucle ----- */
  let tagPulse=0;
  function loop(){
    raf=requestAnimationFrame(loop);
    if(!on||document.hidden||!scene||$('#board').classList.contains('hidden'))return;
    const dt=Math.min(.05,clock.getDelta()),t=clock.elapsedTime;
    if(inside){hero.idle(t);if(t%6<1.4)hero.wave(t);hero.g.position.set(0,0,.6);
      const c=inside.cam,bx=inside.camX0??(inside.camX0=c.position.x);c.position.x=bx+Math.sin(t*.25)*.5;if(!inside.look){inside.look=new THREE.Vector3();c.getWorldDirection(inside.look);inside.look.multiplyScalar(10).add(c.position.clone().setX(bx))}c.lookAt(inside.look);
      if(inside.spin)inside.spin.rotation.y=t*1.2;r.render(inside.s,c);return}
    if(walk){const dir=Math.sign(walk.tx-hx);hx+=dir*7*dt;const day=dayAt(hx);
      while(walk&&walk.last<day&&walk.last<dayAt(walk.tx)){walk.last++;walk.onDay(walk.last)}
      if((dir>0&&hx>=walk.tx)||(dir<0&&hx<=walk.tx)||dir===0){hx=walk.tx;const w=walk;walk=null;w.res()}
      hero.walk(t,1)}
    else if(mode==='entering'){doorT+=dt;const g=stopG[R.si];
      hero.g.rotation.y+=(Math.PI-hero.g.rotation.y)*Math.min(1,dt*10);
      if(doorT>.15&&hz>-5.3){hz=Math.max(-5.3,hz-dt*2.6);hero.walk(t,1)}else hero.idle(t)
      if(g&&g.userData.door)g.userData.door.rotation.y=-Math.min(1.4,doorT*3);
      if(g&&g.userData.glow)g.userData.glow.material.opacity=Math.min(.8,doorT*2);
      if(doorT>.75&&enterCb){const cb=enterCb;enterCb=null;cb()}}
    else if(mode==='exiting'){doorT+=dt;const g=stopG[R.si];hz=Math.min(-4.2,hz+dt*3);hero.walk(t,hz<-4.25?1:0);
      if(hz>=-4.2){hero.g.rotation.y+=(Math.PI/2-hero.g.rotation.y)*Math.min(1,dt*8)}
      if(g&&g.userData.door)g.userData.door.rotation.y=-Math.max(0,1.4-doorT*3);
      if(g&&g.userData.glow)g.userData.glow.material.opacity=Math.max(0,.8-doorT*2);
      if(doorT>.8){mode='out';hz=-4.2;hero.g.rotation.y=Math.PI/2}}
    else{if(sitT>0){sitT-=dt;hero.g.rotation.y+=(0-hero.g.rotation.y)*Math.min(1,dt*6);hero.wave(t)}else{hero.idle(t);hero.g.rotation.y+=(Math.PI/2-hero.g.rotation.y)*Math.min(1,dt*6)}}
    hero.g.position.set(hx,walk?Math.abs(Math.sin(t*11))*.06:0,hz);
    // prochain bâtiment : il « respire »
    const nx=R&&R.stops&&R.stops[R.si+1];
    Object.entries(stopG).forEach(([i,g])=>{const tg=g.userData.tag;if(!tg)return;const act=nx&&+i===R.si+1;const s=act?.62+Math.sin(t*4)*.05:.5;tg.scale.set(s*4,s,1);tg.material.opacity=+i<=R.si?.5:1;
      if(g.userData.glow&&mode==='out'&&+i!==R.si)g.userData.glow.material.opacity=act?.25+Math.sin(t*4)*.15:0});
    // caméra qui suit
    camX+=(hx-camX)*Math.min(1,dt*3);
    ins+=((mode==='entering'?1:0)-ins)*Math.min(1,dt*2.5);const a=cam.aspect,port=a<.9,iK=ins;
    const dist=(port?33:17)*(1-iK*.35),hgt=(port?13:8.2)*(1-iK*.3);
    cam.position.set(camX+(port?3:-3.5)*(1-iK),hgt,dist-4);cam.lookAt(camX+(port?3:2.5)*(1-iK),(port?2.6:1.6)-iK*.3,-4.5);
    const sun=scene.userData.sun;sun.position.set(camX-20,40,30);sun.target.position.set(camX,0,-4);
    r.render(scene,cam);
  }
  window.addEventListener('resize',fitIn);
  return{mount,show,hide,walkTo,enter,exit,sit,out:leaveIn,billDone:d=>{if(scene)done(d)},ok:()=>!!r};
})();

/* Sortir du bâtiment quand on ferme la carte */
const _contStreet=cont;
cont=function(){const wasIntro=R&&R.pending&&R.pending.intro;_contStreet();if(R&&!wasIntro)STREET.exit();
  if(wasIntro&&R){const b=R.fixed.filter(f=>f.d===1&&!f.groc);(b.length?showInvoices(b,1):Promise.resolve()).then(()=>setTimeout(()=>tour('board'),400))}};
const _showCityS=showCity;showCity=function(){STREET.out();_showCityS()};

Object.assign(A,{roll:advance,cont,month:v=>monthModal(v),dayInfo});
