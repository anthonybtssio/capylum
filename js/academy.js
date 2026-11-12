/* =========================================================
   Capylum — L'ORDINATEUR, VERSION PRO
   🏠 Tableau de bord · 📈 Bourse · 🧪 Simulateurs · 🎓 Cours
   ========================================================= */
const _pcBase=computer;
const PCX={tab:'dash',sim:'interets',lesson:null,ans:{},S:{init:1000,mens:100,ans:20,taux:7,crM:15000,crT:4.5,crN:5,rev:1800,etA:1000,etN:60,bud:1600}};
const CAT_N={logement:'🏠 Logement',factures:'🧾 Factures',courses:'🛒 Courses',transport:'🚌 Transport',loisirs:'🎉 Loisirs',achats:'🛍️ Achats',imprevus:'⚡ Imprévus',autre:'📦 Autres'};
const nfmt=n=>Math.round(n).toLocaleString('fr-FR'),kf=v=>(v/1000).toLocaleString('fr-FR',{maximumFractionDigits:1})+'k';

/* ---------- Petits graphiques SVG ---------- */
function lineChart(series,{h=170,labels=null,money=true}={}){
  const W=320,pad={l:42,r:8,t:10,b:labels?22:10},all=series.flatMap(s=>s.pts);const mx=Math.max(1,...all),mn=Math.min(0,...all),rg=mx-mn||1;
  const n=Math.max(...series.map(s=>s.pts.length)),X=i=>pad.l+(n<2?0:i/(n-1))*(W-pad.l-pad.r),Y=v=>pad.t+(1-(v-mn)/rg)*(h-pad.t-pad.b);
  const grid=[0,.25,.5,.75,1].map(k=>{const v=mn+rg*k,y=Y(v);return`<line x1="${pad.l}" x2="${W-pad.r}" y1="${y}" y2="${y}" stroke="#E6E8F0" stroke-width="1"/><text x="${pad.l-4}" y="${y+3}" text-anchor="end" font-size="9" fill="#8A8FA3">${money?(Math.abs(v)>=1000?kf(v):nfmt(v)):nfmt(v)}</text>`}).join('');
  const lines=series.map(s=>{const p=s.pts.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');return(s.fill?`<polygon points="${X(0)},${Y(mn)} ${p} ${X(s.pts.length-1)},${Y(mn)}" fill="${s.c}" opacity=".13"/>`:'')+`<polyline points="${p}" fill="none" stroke="${s.c}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"${s.dash?' stroke-dasharray="5 4"':''}/>`+(s.pts.length===1?`<circle cx="${X(0)}" cy="${Y(s.pts[0])}" r="4" fill="${s.c}"/>`:'')}).join('');
  const lb=labels?labels.map((l,i)=>(labels.length<=8||i%Math.ceil(labels.length/6)===0||i===labels.length-1)?`<text x="${X(i)}" y="${h-6}" text-anchor="middle" font-size="9" fill="#8A8FA3">${l}</text>`:'').join(''):'';
  return`<svg viewBox="0 0 ${W} ${h}" width="100%" style="display:block">${grid}${lines}${lb}</svg>`+(series.length>1?`<div class="leg">${series.map(s=>`<span><i style="background:${s.c}"></i>${s.n}</span>`).join('')}</div>`:'');
}
function stackBars(rows,{h=160,cols=['#3F3FD4','#24A866'],names=[],labels=[]}={}){
  const W=320,pl=42,pb=20,mx=Math.max(1,...rows.map(r=>r.reduce((a,b)=>a+b,0))),bw=(W-pl-6)/rows.length;
  const bars=rows.map((r,i)=>{let y=h-pb;return r.map((v,j)=>{const hh=v/mx*(h-pb-8);y-=hh;return`<rect x="${pl+i*bw+bw*.15}" y="${y}" width="${bw*.7}" height="${Math.max(0,hh)}" rx="2" fill="${cols[j]}"/>`}).join('')}).join('');
  const ax=[0,.5,1].map(k=>`<text x="${pl-4}" y="${h-pb-k*(h-pb-8)+3}" text-anchor="end" font-size="9" fill="#8A8FA3">${mx*k>=1000?kf(mx*k):nfmt(mx*k)}</text>`).join('');
  const lb=labels.map((l,i)=>(labels.length<=10||i%Math.ceil(labels.length/8)===0)?`<text x="${pl+i*bw+bw/2}" y="${h-6}" text-anchor="middle" font-size="9" fill="#8A8FA3">${l}</text>`:'').join('');
  return`<svg viewBox="0 0 ${W} ${h}" width="100%" style="display:block">${ax}${bars}${lb}</svg>${names.length?`<div class="leg">${names.map((n,j)=>`<span><i style="background:${cols[j]}"></i>${n}</span>`).join('')}</div>`:''}`;
}
function donut(parts){
  const tot=parts.reduce((a,p)=>a+Math.max(0,p.v),0)||1;let a0=-Math.PI/2;const R1=52,R0=32,cx=60,cy=60;
  const seg=parts.filter(p=>p.v>0).map(p=>{const a1=a0+p.v/tot*Math.PI*2-.0001,L=a1-a0>Math.PI?1:0;
    const P=(r,a)=>`${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;const d=`M${P(R1,a0)} A${R1},${R1} 0 ${L} 1 ${P(R1,a1)} L${P(R0,a1)} A${R0},${R0} 0 ${L} 0 ${P(R0,a0)}Z`;a0=a1;return`<path d="${d}" fill="${p.c}"/>`}).join('');
  return`<div class="donut"><svg viewBox="0 0 120 120" width="120" height="120">${seg||'<circle cx="60" cy="60" r="42" fill="none" stroke="#E6E8F0" stroke-width="20"/>'}</svg>
    <div>${parts.map(p=>`<div class="dl"><i style="background:${p.c}"></i><span>${p.n}</span><b>${Math.round(Math.max(0,p.v)/tot*100)} %</b></div>`).join('')}</div></div>`;
}
const card=(t,body,cls='')=>`<div class="dcard ${cls}"><div class="dct">${t}</div>${body}</div>`;

/* ---------- Onglets ---------- */
const TABS=[['dash','🏠','Tableau de bord'],['bourse','📈','Bourse'],['sim','🧪','Simulateurs'],['cours','🎓','Cours'],['cat','🛋️','Catalogue']];
function tabsHTML(cur){return`<div class="pctabs">${TABS.map(([k,i,n])=>`<button class="${cur===k?'on':''}" data-a="pcTab" data-v="${k}"><span>${i}</span>${n}</button>`).join('')}</div>`}
function pcShell(cur,body){
  modal(`<div class="pc"><div class="pcbar"><span>🖥️ Mon ordinateur</span><button data-a="pcClose">✕</button></div>${tabsHTML(cur)}<div class="pcbody">${body}</div></div>`);
  const sh=document.querySelector('#modal .sheet');if(sh)sh.classList.add('wide');
}
computer=function(view,k){
  view=view||PCX.tab;if(view==='desk')view='dash';if(view==='aide')view='cours';if(view==='compte')view='dash';
  if(view==='cat'){A.pcClose();return catalogue()}
  if(view==='bourse'||view==='stock'){PCX.tab='bourse';_pcBase(view,k);
    const b=document.querySelector('#modal .pcbody');if(b){b.insertAdjacentHTML('beforebegin',tabsHTML('bourse'));b.querySelectorAll('.bk').forEach(x=>{if(x.dataset.v==='desk')x.style.display='none'})}
    const sh=document.querySelector('#modal .sheet');if(sh)sh.classList.add('wide');return}
  PC.view=view;PCX.tab=view==='lesson'?'cours':view;mkt();mktCatchUp();
  if(view==='dash')pcShell('dash',dashHTML());
  else if(view==='sim')pcShell('sim',simHTML());
  else if(view==='cours')pcShell('cours',coursHTML());
  else if(view==='lesson')pcShell('cours',lessonHTML(k||PCX.lesson));
};

/* =========================================================
   🏠 TABLEAU DE BORD
   ========================================================= */
function dashHTML(){
  const pv=portValue(),cost=Object.values(G.port||{}).reduce((a,p)=>a+(p.q>0?p.c:0),0),w=wealth(),ls=G.lastSpent;
  const spentTot=ls?Object.entries(ls.spent).filter(([c])=>CAT_N[c]).reduce((a,[,v])=>a+v,0):0;
  const cushion=spentTot?G.savings/spentTot:0;
  const kpi=(ic,n,v,sub,cls='')=>`<div class="kpi ${cls}"><small>${ic} ${n}</small><b>${v}</b>${sub?`<span>${sub}</span>`:''}</div>`;
  const nw=(G.nw||[]).slice(-12),pts=[...nw.map(x=>x.w),Math.round(w)],lbl=[...nw.map(x=>x.l.split(' ')[0]),'Auj.'];
  // conseils automatiques
  const tips=[];
  if(G.money<0)tips.push(['bad','Ton compte est dans le rouge : rembourse vite ton découvert, il coûte des agios.']);
  if(spentTot&&cushion<3)tips.push(['warn',`Ton épargne couvre ${cushion.toFixed(1).replace('.',',')} mois de dépenses. Vise 3 mois (≈ ${fmt(spentTot*3)}) d’épargne de précaution.`]);
  else if(spentTot)tips.push(['good',`Bravo : ton épargne couvre ${Math.floor(cushion)} mois de dépenses. Ton coussin de sécurité est solide !`]);
  if(pv>0){const big=STOCKS.map(s=>({s,v:(G.port[s.k]?.q||0)*price(s.k)})).sort((a,b)=>b.v-a.v)[0];if(big.v/pv>.7&&big.s.k!=='NESN')tips.push(['warn',`${Math.round(big.v/pv*100)} % de tes actions sont sur ${big.s.n}, très volatile. Pense à diversifier.`])}
  if(pv>w*.5&&w>0)tips.push(['warn','Plus de la moitié de ton patrimoine est en actions : en cas de krach, ça peut faire mal.']);
  if((G.debts||[]).length)tips.push(['warn',`Tu as ${G.debts.length} crédit(s) en cours : ${fmt(G.debts.reduce((a,d)=>a+d.a,0))} par mois.`]);
  if(!G.autoSave&&G.age>=18)tips.push(['neu','Programme une épargne automatique le jour de la paie : c’est l’habitude n°1 des bons épargnants.']);
  const todo=LESSONS.filter(l=>!(G.lessons||{})[l.id]);if(todo.length)tips.push(['neu',`🎓 Suis le cours « ${todo[0].t} » : +${fmt(LESSON_REWARD)} si tu réussis le quiz !`]);
  const sk=Object.entries(G.skill||{}).filter(([k,v])=>SKN[k]&&v[1]);
  return`<div class="dhead"><div>${avatarSVG(G.char,46)}</div><div><b>Bonjour ${G.char?G.char.name:''} !</b><small>${G.age} ans${G.job?' · '+G.job.n:''} · séance de bourse n°${G.mkt.day}</small></div></div>
  <div class="kpis">${kpi('💰','Patrimoine total',fmt(w),'compte + épargne + placements','big')}${kpi('💳','Compte',fmt(G.money),'',G.money<0?'neg':'')}${kpi('🐷','Épargne',fmt(G.savings))}
    ${kpi('🌍','Placements ETF',fmt(G.invest))}${kpi('📈','Actions',fmt(pv),pv?`${pv-cost>=0?'+':'−'}${fmt(Math.abs(pv-cost))}`:'aucune',pv&&pv<cost?'neg':'')}${kpi('😊','Moral',Math.round(G.joy)+'/100')}</div>
  <div class="dgrid">
    ${card('📊 Où est ton argent ?',donut([{n:'Compte',v:G.money,c:'#3F3FD4'},{n:'Épargne',v:G.savings,c:'#24A866'},{n:'Placements ETF',v:G.invest,c:'#8B5CF6'},{n:'Actions',v:pv,c:'#F59E0B'}]))}
    ${card('📈 Évolution de ton patrimoine',pts.length>1?lineChart([{n:'Patrimoine',c:'#3F3FD4',pts,fill:1}],{labels:lbl}):'<p class="muted">Termine des étapes de vie pour voir ta courbe grandir !</p>')}
    ${card(`🧾 Ton dernier mois${ls?' · '+ls.t:''}`,ls?`<div class="hbars">${Object.entries(ls.spent).filter(([c,v])=>CAT_N[c]&&v>0).sort((a,b)=>b[1]-a[1]).map(([c,v])=>`<div><span>${CAT_N[c]}</span><i><b style="width:${v/Math.max(...Object.values(ls.spent))*100}%"></b></i><em>${fmt(v)}</em></div>`).join('')}</div>
      <div class="row"><span>Dépenses</span><b class="neg">−${fmt(spentTot)}</b></div><div class="row"><span>Revenus</span><b class="pos">+${fmt(ls.earned)}</b></div>`:'<p class="muted">Pas encore de mois terminé.</p>')}
    ${card('📉 Mes actions (30 séances)',STOCKS.map(s=>{const h=G.mkt.px[s.k],c=h[h.length-1]/h[Math.max(0,h.length-31)]-1,q=(G.port[s.k]||{}).q||0;return`<div class="mini"><span>${s.ic} ${s.n}${q?` <small>×${q}</small>`:''}</span><span class="sp">${spark(h,90,28,c>=0?'#24A866':'#E5484D')}</span><b class="${c>=0?'pos':'neg'}">${pct(c)}</b></div>`}).join('')+`<button class="lnk" data-a="pcTab" data-v="bourse">Ouvrir la bourse →</button>`)}
    ${card('🧠 Tes réflexes',sk.length?`<div class="hbars">${sk.map(([k,[a,b]])=>`<div><span>${SKN[k]}</span><i><b style="width:${a/b*100}%;background:${a/b>=.65?'#24A866':'#F59E0B'}"></b></i><em>${a}/${b}</em></div>`).join('')}</div>`:'<p class="muted">Joue des mois de vie pour voir tes réflexes.</p>')}
    ${card('💡 Conseils pour toi',`<div class="tips">${tips.map(([c,t])=>`<div class="tip ${c}">${t}</div>`).join('')||'<div class="tip good">Tout va bien ! Continue comme ça 👌</div>'}</div>`)}
  </div>`;
}

/* =========================================================
   🧪 SIMULATEURS
   ========================================================= */
const SIMS=[['interets','✨','Intérêts composés'],['compare','⚖️','Comparer les placements'],['credit','💳','Simulateur de crédit'],['etsi','🔮','Et si j’avais investi…'],['budget','🧮','Budget 50/30/20']];
const SLD={init:['Versement de départ',0,20000,100,v=>fmt(v)],mens:['Chaque mois',0,1000,10,v=>fmt(v)],ans:['Durée',1,45,1,v=>v+' ans'],taux:['Rendement par an',0,12,.5,v=>String(v).replace('.',',')+' %'],
  crM:['Montant emprunté',500,300000,500,v=>fmt(v)],crT:['Taux (TAEG)',.5,22,.5,v=>String(v).replace('.',',')+' %'],crN:['Durée',1,25,1,v=>v+' ans'],rev:['Tes revenus nets / mois',500,6000,50,v=>fmt(v)],
  etA:['Montant investi',100,10000,100,v=>fmt(v)],etN:['Il y a…',5,100,5,v=>v+' séances'],bud:['Revenus nets / mois',300,6000,50,v=>fmt(v)]};
function slider(k){const[n,a,b,st,f]=SLD[k],v=PCX.S[k];return`<label class="sld"><span>${n}<b id="v_${k}">${f(v)}</b></span><input type="range" min="${a}" max="${b}" step="${st}" value="${v}" oninput="SIMSET('${k}',this.value)"></label>`}
function SIMSET(k,v){PCX.S[k]=+v;const e=document.getElementById('v_'+k);if(e)e.textContent=SLD[k][4](+v);const o=document.getElementById('simOut');if(o)o.innerHTML=simOut()}
function simHTML(){
  const s=PCX.sim,S=PCX.S;let ctrl='';
  if(s==='interets')ctrl=['init','mens','ans','taux'].map(slider).join('')+`<div class="presets">${[['Livret',2],['Fonds euros',2.5],['ETF Monde',7],['Matelas',0]].map(([n,t])=>`<button data-a="simPreset" data-v="${t}">${n} ${String(t).replace('.',',')} %</button>`).join('')}</div>`;
  else if(s==='compare')ctrl=['init','mens','ans'].map(slider).join('');
  else if(s==='credit')ctrl=['crM','crT','crN','rev'].map(slider).join('')+`<div class="presets"><button data-a="simCr" data-v="15000|4.5|5">🚗 Crédit auto</button><button data-a="simCr" data-v="200000|3.6|25">🏠 Prêt immo</button><button data-a="simCr" data-v="3000|19|3">💳 Revolving</button></div>`;
  else if(s==='etsi')ctrl=['etA','etN'].map(slider).join('');
  else ctrl=slider('bud');
  return`<div class="simtabs">${SIMS.map(([k,i,n])=>`<button class="${s===k?'on':''}" data-a="simTab" data-v="${k}">${i} ${n}</button>`).join('')}</div>
    <div class="simgrid"><div class="simctl">${ctrl}</div><div id="simOut" class="simout">${simOut()}</div></div>`;
}
function fv(init,mens,yrs,r){const out=[];let v=init;for(let y=0;y<=yrs;y++){if(y>0)for(let m=0;m<12;m++)v=v*(1+r/12)+mens;out.push(v)}return out}
function simOut(){
  const s=PCX.sim,S=PCX.S;
  if(s==='interets'){const r=S.taux/100,vals=fv(S.init,S.mens,S.ans,r),paid=vals.map((_,y)=>S.init+S.mens*12*y),fin=vals[vals.length-1],put=paid[paid.length-1];
    return`<div class="bignums"><div><small>Tu auras</small><b>${fmt(fin)}</b></div><div><small>Tu as versé</small><b>${fmt(put)}</b></div><div><small>Intérêts gagnés</small><b class="pos">+${fmt(fin-put)}</b></div></div>
      ${stackBars(vals.map((v,y)=>[paid[y],Math.max(0,v-paid[y])]),{cols:['#3F3FD4','#24A866'],names:['Ce que tu as versé','Intérêts (l’argent qui travaille)'],labels:vals.map((_,y)=>y)})}
      <p class="snote">💡 ${fin-put>put?'Les intérêts ont rapporté plus que ce que tu as versé : c’est la magie des intérêts composés !':'Plus la durée est longue, plus les intérêts font boule de neige. Essaie 30 ou 40 ans !'} ${S.taux>4?'⚠️ Un rendement élevé n’est jamais garanti : la bourse peut baisser certaines années.':''}</p>`}
  if(s==='compare'){const L=[['Matelas (réel, inflation 2 %)','#E5484D',-.02],['Livret 2 %','#24A866',.02],['Fonds euros 2,5 %','#22B8CF',.025],['ETF Monde ~7 %','#8B5CF6',.07]];
    const ser=L.map(([n,c,r])=>{const v=r<0?fv(S.init,S.mens,S.ans,0).map((x,y)=>x/Math.pow(1.02,y)):fv(S.init,S.mens,S.ans,r);return{n,c,pts:v}});
    return lineChart(ser,{h:190,labels:ser[0].pts.map((_,y)=>y)})+`<table class="ctab">${ser.map(x=>`<tr><td><i style="background:${x.c}"></i>${x.n}</td><td>${fmt(x.pts[x.pts.length-1])}</td></tr>`).join('')}</table>
      <p class="snote">💡 Le « matelas » est montré en pouvoir d’achat : à cause de l’inflation, l’argent qui dort perd de la valeur. L’ETF rapporte plus en moyenne… mais il peut baisser fortement certaines années.</p>`}
  if(s==='credit'){const P=S.crM,r=S.crT/100/12,n=S.crN*12,m=r?P*r/(1-Math.pow(1+r,-n)):P/n,tot=m*n,end=m/S.rev;let bal=P;const rows=[];
    for(let y=0;y<S.crN;y++){let ci=0,ii=0;for(let k=0;k<12;k++){const i=bal*r,c=m-i;ii+=i;ci+=c;bal-=c}rows.push([ci,ii])}
    return`<div class="bignums"><div><small>Mensualité</small><b>${fmt(m)}</b></div><div><small>Coût du crédit</small><b class="neg">${fmt(tot-P)}</b></div><div><small>Endettement</small><b class="${end>.35?'neg':'pos'}">${Math.round(end*100)} %</b></div></div>
      ${stackBars(rows,{cols:['#3F3FD4','#E5484D'],names:['Capital remboursé','Intérêts payés'],labels:rows.map((_,y)=>'A'+(y+1))})}
      <div class="verdict ${end>.35?'bad':'good'}" style="margin-top:8px"><p>${end>.35?`🏦 Une banque refuserait sûrement : ta mensualité dépasse 35 % de tes revenus.`:`✅ Ta mensualité représente ${Math.round(end*100)} % de tes revenus : sous la limite de 35 %.`} Au total tu rembourses <b>${fmt(tot)}</b> pour <b>${fmt(P)}</b> empruntés.</p></div>
      <p class="snote">💡 Au début, tu paies surtout des intérêts (en rouge). Un taux plus bas ou une durée plus courte fait fondre le coût total.</p>`}
  if(s==='etsi'){mkt();const n=Math.min(S.etN,G.mkt.px.NESN.length-1),A0=S.etA;
    const res=STOCKS.map(st=>{const h=G.mkt.px[st.k];return{n:st.ic+' '+st.n,c:st.col,v:A0*h[h.length-1]/h[h.length-1-n],path:h.slice(-n-1).map(p=>A0*p/h[h.length-1-n])}});
    const mix={n:'🧺 Un peu des trois',c:'#2F3142',path:res[0].path.map((_,i)=>res.reduce((a,x)=>a+x.path[i],0)/3)};mix.v=mix.path[mix.path.length-1];const all=[...res,mix];
    return lineChart(all.map(x=>({n:x.n,c:x.c,pts:x.path,dash:x===mix})),{h:190})+`<table class="ctab">${all.map(x=>`<tr><td><i style="background:${x.c}"></i>${x.n}</td><td>${fmt(x.v)} <small class="${x.v>=A0?'pos':'neg'}">(${pct(x.v/A0-1)})</small></td></tr>`).join('')}</table>
      <p class="snote">💡 Calculé avec les vrais cours du jeu. Regarde la ligne pointillée : en mélangeant, les montagnes russes sont plus douces. C’est ça, <b>diversifier</b>.</p>`}
  const B=S.bud,ls=G.lastSpent;let real='';
  if(ls){const sp=ls.spent,need=['logement','factures','courses','transport'].reduce((a,c)=>a+(sp[c]||0),0),want=['loisirs','achats','autre','imprevus'].reduce((a,c)=>a+(sp[c]||0),0),inc=ls.earned||1;
    real=`<div class="dct" style="margin-top:12px">Ton dernier mois (${ls.t})</div>${stackBars([[need/inc*100,want/inc*100,Math.max(0,100-need/inc*100-want/inc*100)],[50,30,20]],{h:120,cols:['#3F3FD4','#F59E0B','#24A866'],labels:['Toi','Idéal'],names:['Besoins','Envies','Épargne']})}`}
  return`<div class="b503">${[['🏠 Besoins','50 %',.5,'#3F3FD4','Loyer, factures, courses, transport'],['🎉 Envies','30 %',.3,'#F59E0B','Sorties, shopping, abonnements'],['🐷 Épargne','20 %',.2,'#24A866','Livret, projets, investissement']].map(([n,p,k,c,d])=>`<div style="--c:${c}"><small>${n} · ${p}</small><b>${fmt(B*k)}</b><span>${d}</span></div>`).join('')}</div>${real}
    <p class="snote">💡 La règle 50/30/20 est un repère, pas une loi. L’important : épargner un peu chaque mois, dès la paie.</p>`;
}
window.SIMSET=SIMSET;

/* =========================================================
   🎓 COURS (avec quiz récompensé)
   ========================================================= */
const LESSON_REWARD=30;
const LESSONS=[
 {id:'budget',ic:'💶',t:'Faire son budget',col:'#3F3FD4',sec:[
   ['La formule de base','Revenus − dépenses = ce qui reste. Si le résultat est négatif, tu t’endettes. Tout le reste découle de cette règle !'],
   ['Fixe ou variable ?','Les dépenses <b>fixes</b> reviennent chaque mois (loyer, forfait, assurance). Les <b>variables</b> changent (courses, sorties). On commence toujours par les fixes : c’est l’argent qui est déjà « pris ».'],
   ['La règle 50/30/20','<b>50 %</b> pour les besoins, <b>30 %</b> pour les envies, <b>20 %</b> pour l’épargne. Un repère simple pour savoir si ton budget est équilibré.','50 / 30 / 20'],
   ['Les petites fuites','Un café à 3 € par jour de travail = environ <b>660 € par an</b>. Les abonnements oubliés, les frais bancaires… ce sont des fuites qu’on peut boucher.']],
  quiz:[{q:'Dans la règle 50/30/20, les 20 % servent…',o:['Aux loisirs','À l’épargne','Au loyer'],a:1},{q:'Laquelle est une dépense fixe ?',o:['Le loyer','Un restaurant','Un cadeau'],a:0},{q:'Revenus 1 500 €, dépenses 1 650 €. Tu…',o:['Épargnes 150 €','T’endettes de 150 €','Es à l’équilibre'],a:1}]},
 {id:'epargne',ic:'🐷',t:'Épargner malin',col:'#24A866',sec:[
   ['Se payer en premier','On épargne <b>le jour de la paie</b>, pas avec ce qui reste en fin de mois (souvent… rien). Un virement automatique fait le travail pour toi.'],
   ['L’épargne de précaution','Garde <b>3 à 6 mois de dépenses</b> de côté, disponibles tout de suite, pour une panne, une perte d’emploi, une facture imprévue.','3 à 6 mois'],
   ['Les livrets réglementés','Livret A (plafond 22 950 €), LDDS, Livret Jeune (12–25 ans) : <b>sans risque</b>, retirables à tout moment, intérêts non imposés. Parfaits pour l’épargne de précaution.'],
   ['L’ennemi : l’inflation','Si les prix montent de 3 % et que ton livret rapporte 2 %, ton pouvoir d’achat <b>baisse</b> d’environ 1 %. Pour le long terme, on regarde aussi d’autres placements.']],
  quiz:[{q:'Le meilleur moment pour épargner ?',o:['Le jour de la paie','À la fin du mois','Quand on y pense'],a:0},{q:'L’épargne de précaution, c’est environ…',o:['1 semaine de dépenses','3 à 6 mois de dépenses','5 ans de salaire'],a:1},{q:'Le Livret A est…',o:['Risqué','Sans risque et disponible','Bloqué 8 ans'],a:1}]},
 {id:'bourse',ic:'📈',t:'Comprendre la bourse',col:'#8B5CF6',sec:[
   ['Une action, c’est quoi ?','Un tout petit morceau d’entreprise. Si l’entreprise gagne de l’argent et grandit, l’action vaut plus. Elle peut aussi verser un <b>dividende</b>.'],
   ['Risque et volatilité','Personne ne sait prévoir la bourse. Une action « volatile » (comme Nvidia ou Claude dans le jeu) peut faire +10 % ou −10 % en une journée.'],
   ['Diversifier','Ne mets pas tous tes œufs dans le même panier. Un <b>ETF Monde</b> contient des centaines d’entreprises d’un coup : si l’une chute, les autres amortissent.'],
   ['Le temps est ton allié','Sur le long terme (10 ans et plus), les marchés ont toujours fini par remonter… mais vendre en panique pendant une baisse transforme une baisse passagère en vraie perte.','10 ans +']],
  quiz:[{q:'Une action, c’est…',o:['Un prêt à l’État','Un morceau d’entreprise','Un livret bancaire'],a:1},{q:'Diversifier permet de…',o:['Gagner à coup sûr','Réduire le risque','Payer moins d’impôts'],a:1},{q:'Les marchés chutent de 20 %. Le réflexe des investisseurs patients ?',o:['Tout vendre vite','Ne rien faire, voire investir un peu','Emprunter pour acheter'],a:1}]},
 {id:'credit',ic:'💳',t:'Le crédit sans piège',col:'#E5484D',sec:[
   ['Emprunter coûte','Quand tu empruntes, tu rembourses la somme <b>plus des intérêts</b>. Un crédit de 10 000 € à 5 % sur 5 ans coûte environ 1 300 € d’intérêts.'],
   ['Le TAEG','C’est le coût total du crédit, frais compris, en % par an. C’est LE chiffre pour comparer les offres.'],
   ['Attention danger','Crédit renouvelable (« revolving ») et paiements en plusieurs fois : souvent très chers et faciles à empiler. Plus de 15 % par an pour certains !','> 15 %'],
   ['Les règles qui protègent','Les banques limitent tes mensualités à <b>35 %</b> de tes revenus. Et après avoir signé un crédit conso, tu as <b>14 jours</b> pour changer d’avis.']],
  quiz:[{q:'Pour comparer deux crédits, on regarde…',o:['La couleur de la carte','Le TAEG','Le nom de la banque'],a:1},{q:'Mensualités max conseillées :',o:['15 % des revenus','35 % des revenus','70 % des revenus'],a:1},{q:'Le crédit renouvelable est souvent…',o:['Gratuit','Très cher','Obligatoire'],a:1}]},
 {id:'impots',ic:'🧾',t:'Salaire et impôts',col:'#3F6FB5',sec:[
   ['Brut et net','Le salaire <b>brut</b> moins les cotisations (≈ 22 % dans le privé) donne le <b>net</b>. Les cotisations financent la santé, la retraite, le chômage.','≈ −22 %'],
   ['Le prélèvement à la source','L’impôt sur le revenu est retiré directement de ton salaire chaque mois, selon ton taux personnel.'],
   ['L’impôt est progressif','Il fonctionne par tranches : seuls les euros <b>au-dessus</b> d’un seuil sont taxés plus. Une augmentation ne fait donc jamais baisser ton revenu après impôt.'],
   ['Déclarer chaque année','Même sans rien payer, on déclare ses revenus : l’avis d’impôt sert pour les aides (APL, bourses…). Et on garde ses fiches de paie toute sa vie.']],
  quiz:[{q:'Brut 2 000 € dans le privé : net ≈',o:['1 950 €','1 560 €','1 000 €'],a:1},{q:'Passer dans une tranche d’impôt supérieure…',o:['Fait baisser tout ton revenu','Ne taxe plus que les euros au-dessus du seuil','Supprime tes aides'],a:1},{q:'Si tu ne paies pas d’impôt, tu dois…',o:['Quand même déclarer','Ne rien faire','Payer une amende'],a:0}]},
 {id:'logement',ic:'🏠',t:'Se loger',col:'#2F86D8',sec:[
   ['Le bon loyer','Pas plus d’<b>un tiers</b> de tes revenus. Au-delà, il reste trop peu pour vivre et épargner.','≤ 1/3'],
   ['Le dépôt de garantie','Au maximum 1 mois de loyer hors charges (vide), 2 mois (meublé). Il est rendu à ton départ si le logement est en bon état.'],
   ['L’état des lieux','À l’entrée, note et photographie chaque défaut. Sinon, on pourrait te les reprocher en partant et garder ta caution.'],
   ['Les aides et obligations','L’assurance habitation est obligatoire pour un locataire. La CAF peut t’aider avec l’APL selon tes revenus.']],
  quiz:[{q:'Revenus 1 500 €, loyer conseillé max :',o:['500 €','800 €','1 000 €'],a:0},{q:'Dépôt de garantie max pour un logement vide :',o:['1 mois de loyer','3 mois','6 mois'],a:0},{q:'L’assurance habitation d’un locataire est…',o:['Interdite','Obligatoire','Inutile'],a:1}]},
 {id:'arnaques',ic:'🎣',t:'Déjouer les arnaques',col:'#E2643A',sec:[
   ['Le faux SMS','« Votre colis est bloqué, payez 1,99 € » : c’est de l’hameçonnage. On ne clique jamais, on supprime.'],
   ['Le faux conseiller','Une banque ne te demandera <b>jamais</b> un code reçu par SMS ou ton mot de passe. Raccroche et rappelle le numéro officiel.','JAMAIS'],
   ['La promesse trop belle','« Rendement énorme » + « sans risque » = arnaque. Plus on te promet, plus il faut fuir.'],
   ['Si ça arrive','Fais opposition sur ta carte immédiatement, préviens ta banque, porte plainte. En cas de fraude, la banque doit souvent rembourser.']],
  quiz:[{q:'Ta « banque » te demande le code reçu par SMS :',o:['Je le donne','Je raccroche et j’appelle ma banque','Je le note'],a:1},{q:'« ×10 en un mois, garanti ! » c’est…',o:['Une bonne affaire','Une arnaque probable','Un Livret A'],a:1},{q:'Carte volée : premier réflexe ?',o:['Attendre','Faire opposition','Changer de téléphone'],a:1}]},
 {id:'assurances',ic:'🛡️',t:'Les assurances',col:'#2DB36F',sec:[
   ['Le principe','Beaucoup de gens paient un peu chaque mois pour aider ceux qui ont un gros problème. C’est la <b>mutualisation</b>.'],
   ['La franchise','C’est la partie que tu paies toi-même lors d’un sinistre. Franchise basse = cotisation plus chère, et inversement.'],
   ['Les obligatoires','Responsabilité civile auto si tu as une voiture, assurance habitation si tu es locataire. Une mutuelle santé est très conseillée.'],
   ['Ne pas sur-assurer','L’extension de garantie d’un magasin est souvent inutile : la garantie légale couvre déjà <b>2 ans</b> tout produit neuf.','2 ans']],
  quiz:[{q:'La franchise, c’est…',o:['Ce que l’assurance te rembourse','Ce qui reste à ta charge','Une remise'],a:1},{q:'La garantie légale d’un produit neuf dure…',o:['6 mois','2 ans','10 ans'],a:1},{q:'Pour un locataire, l’assurance habitation est…',o:['Obligatoire','Optionnelle','Payée par l’État'],a:0}]},
];
function coursHTML(){
  const done=G.lessons||{},n=LESSONS.filter(l=>done[l.id]).length;
  return`<div class="chead"><b>🎓 L’école de l’argent</b><small>${n}/${LESSONS.length} cours réussis · chaque quiz réussi rapporte <b>+${fmt(LESSON_REWARD)}</b> (une fois)</small><div class="gb" style="margin-top:6px"><i style="width:${n/LESSONS.length*100}%"></i></div></div>
    <div class="lgrid">${LESSONS.map(l=>`<button class="lcard" style="--c:${l.col}" data-a="pcLesson" data-v="${l.id}"><span>${l.ic}</span><b>${l.t}</b><small>${done[l.id]?'✅ Réussi':`4 fiches · quiz +${LESSON_REWARD} €`}</small></button>`).join('')}</div>`;
}
function lessonHTML(id){
  const l=LESSONS.find(x=>x.id===id);PCX.lesson=id;const an=PCX.ans[id]||(PCX.ans[id]={}),nA=Object.keys(an).length,good=l.quiz.filter((q,i)=>an[i]===q.a).length,done=(G.lessons||{})[id];
  return`<button class="lnk" data-a="pcTab" data-v="cours">← Tous les cours</button>
    <div class="lhero" style="--c:${l.col}"><span>${l.ic}</span><div><b>${l.t}</b><small>${done?'✅ Cours réussi':'Lis les 4 fiches puis réponds au quiz'}</small></div></div>
    <div class="lsecs">${l.sec.map(([t,x,fig],i)=>`<div class="lsec"><div class="ln">${i+1}</div><div><b>${t}</b><p>${x}</p></div>${fig?`<div class="lfig" style="--c:${l.col}">${fig}</div>`:''}</div>`).join('')}</div>
    <div class="dct" style="margin:14px 0 6px">🧠 Quiz du cours</div>
    ${l.quiz.map((q,i)=>`<div class="lq"><p><b>${i+1}.</b> ${q.q}</p><div class="lqo">${q.o.map((o,j)=>`<button class="${an[i]==null?'':j===q.a?'right':j===an[i]?'wrong':''}" data-a="pcAns" data-v="${i}|${j}" ${an[i]!=null?'disabled':''}>${o}</button>`).join('')}</div></div>`).join('')}
    ${nA===l.quiz.length?`<div class="verdict ${good>=2?'good':'bad'}"><b>${good}/${l.quiz.length} ${good>=2?'— Cours réussi ! 🎉':'— Presque !'}</b><p>${good>=2?(done&&!PCX.justWon?'Tu avais déjà gagné la récompense de ce cours.':`🏅 +${fmt(LESSON_REWARD)} sur ton compte !`):'Relis les fiches et retente ta chance.'}</p></div>${good<2?`<button class="btn" data-a="pcRetry">↺ Recommencer le quiz</button>`:''}`:''}`;
}
Object.assign(A,{
  pc:()=>computer(PCX.tab||'dash'),
  pcTab:v=>computer(v),
  simTab:v=>{PCX.sim=v;computer('sim')},
  simPreset:v=>{PCX.S.taux=+v;computer('sim')},
  simCr:v=>{const[a,b,c]=v.split('|').map(Number);Object.assign(PCX.S,{crM:a,crT:b,crN:c});computer('sim')},
  pcLesson:v=>{PCX.justWon=0;computer('lesson',v);const b=document.querySelector('#modal .sheet');if(b)b.scrollTop=0},
  pcAns:v=>{const[i,j]=v.split('|').map(Number),id=PCX.lesson,l=LESSONS.find(x=>x.id===id),an=PCX.ans[id]||(PCX.ans[id]={});if(an[i]!=null)return;an[i]=j;beep(j===l.quiz[i].a?'ok':'bad');
    if(Object.keys(an).length===l.quiz.length){const good=l.quiz.filter((q,k)=>an[k]===q.a).length;G.lessons=G.lessons||{};
      if(good>=2&&!G.lessons[id]){G.lessons[id]=1;PCX.justWon=1;if(R)tx(LESSON_REWARD,'🎓 Prime cours réussi','revenu');else G.money+=LESSON_REWARD;beep('win');confetti();if(typeof homeHud==='function')homeHud()}save()}
    const sh=document.querySelector('#modal .sheet'),y=sh?sh.scrollTop:0;computer('lesson',id);const s2=document.querySelector('#modal .sheet');if(s2)s2.scrollTop=y},
  pcRetry:()=>{PCX.ans[PCX.lesson]={};computer('lesson',PCX.lesson)},
});
