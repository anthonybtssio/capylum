/* =========================================================
   Capylum — L'ORDINATEUR : la bourse (3 actions simulées)
   Cours semi-aléatoires : tendance + volatilité + actualités.
   1 séance de bourse = 1 minute réelle (max 15 rattrapées),
   et 30 séances passent à chaque mois de vie terminé.
   ========================================================= */
const STOCKS=[
 {k:'NESN',n:'Nestlé',ic:'🍫',col:'#2F7DD8',p0:88,mu:.00025,vol:.009,beta:.5,div:.003,
  d:'Chocolat, café, eau, céréales… On achète ses produits même en temps de crise : une action « tranquille » qui verse un dividende.',
  news:[['Le prix du cacao s’envole : les marges baissent',-.05],['Nestlé augmente son dividende',.03],['Nouvelle gamme de café : énorme succès',.04],['Rappel de produits dans plusieurs pays',-.06],['Les ventes résistent malgré la crise',.025]]},
 {k:'NVDA',n:'Nvidia',ic:'🎮',col:'#2DB36F',p0:120,mu:.0009,vol:.026,beta:1.4,div:0,
  d:'Cartes graphiques pour les jeux vidéo et puces pour l’intelligence artificielle. Elle peut monter très vite… et chuter aussi vite.',
  news:[['Nouvelle carte graphique record',.08],['Les géants de l’IA commandent des milliers de puces',.12],['Restrictions sur les exportations de puces',-.1],['Résultats moins bons que prévu',-.09],['Un concurrent présente une puce plus rapide',-.07]]},
 {k:'CLDE',n:'Claude',ic:'🤖',col:'#E2643A',p0:50,mu:.0011,vol:.036,beta:1.6,div:0,fict:1,
  d:'Intelligence artificielle. ⚠️ Action imaginaire pour le jeu (Anthropic, l’entreprise qui crée Claude, n’est pas cotée en bourse). Très risquée !',
  news:[['Le nouveau modèle d’IA impressionne tout le monde',.15],['Un énorme contrat avec une grande entreprise',.1],['Panne géante des serveurs pendant 6 heures',-.09],['La concurrence sort un modèle moins cher',-.12],['Les investisseurs s’inquiètent d’une « bulle de l’IA »',-.14]]},
];
const MKT_NEWS=[['📉 Krach : les marchés plongent partout dans le monde',-.07],['🏦 Les taux d’intérêt baissent : la bourse s’envole',.04],['😨 Peur d’une récession',-.04],['🚀 Excellente journée sur les marchés',.03]];
const gauss=()=>{let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
function mkt(){
  if(!G.mkt){G.mkt={day:0,last:Date.now(),px:{},news:[]};STOCKS.forEach(s=>{G.mkt.px[s.k]=[s.p0]});
    // un peu d'historique pour que les graphiques ne soient pas vides
    for(let i=0;i<40;i++)stepDay(true)}
  G.port=G.port||{};return G.mkt;
}
function price(k){const h=mkt().px[k];return h[h.length-1]}
function stepDay(silent){
  const M=G.mkt;M.day++;let m=.0035*gauss();let mn=null;
  if(Math.random()<.012){mn=MKT_NEWS[Math.floor(Math.random()*MKT_NEWS.length)];m+=mn[1];M.news.unshift({day:M.day,t:mn[0],m:mn[1]})}
  STOCKS.forEach(s=>{const h=M.px[s.k];let r=s.mu+s.vol*gauss()*.85+m*s.beta;
    if(Math.random()<(s.k==='NESN'?.02:.035)){const n=s.news[Math.floor(Math.random()*s.news.length)];const shock=n[1]*(.7+Math.random()*.6);r+=shock;M.news.unshift({day:M.day,k:s.k,t:`${s.ic} ${s.n} : ${n[0]}`,m:shock})}
    h.push(Math.max(1,+(h[h.length-1]*(1+r)).toFixed(2)));if(h.length>120)h.shift()});
  M.news=M.news.slice(0,12);
}
function mktCatchUp(){
  const M=mkt(),now=Date.now();let n=Math.floor((now-M.last)/60000);if(n<=0)return 0;
  const steps=Math.min(15,n);for(let i=0;i<steps;i++)stepDay();M.last=steps<n?now:M.last+steps*60000;save();return steps;
}
function portValue(){if(!G.port)return 0;return Object.entries(G.port).reduce((a,[k,p])=>a+(p.q>0&&G.mkt?p.q*price(k):0),0)}
/* Fin d'un mois de vie : 30 séances + dividendes Nestlé */
function mktMonth(){
  mkt();let div=0;for(let i=0;i<30;i++)stepDay();
  STOCKS.forEach(s=>{const p=G.port[s.k];if(s.div&&p&&p.q>0)div+=p.q*price(s.k)*s.div});
  div=Math.round(div*100)/100;if(div>=.5){G.money+=div;setTimeout(()=>toast(`🍫 Dividende Nestlé : +${div.toLocaleString('fr-FR')} € sur ton compte`,'pos'),4200)}
}
const pct=x=>(x>=0?'+':'−')+Math.abs(x*100).toFixed(1).replace('.',',')+' %';
const eur2=n=>n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
function spark(h,w,ht,col,fill){
  const a=h.slice(-60),mn=Math.min(...a),mx=Math.max(...a),r=mx-mn||1;
  const pts=a.map((v,i)=>`${(i/(a.length-1)*w).toFixed(1)},${(ht-4-(v-mn)/r*(ht-8)).toFixed(1)}`).join(' ');
  return`<svg viewBox="0 0 ${w} ${ht}" width="100%" height="${ht}" preserveAspectRatio="none" style="display:block">${fill?`<polygon points="0,${ht} ${pts} ${w},${ht}" fill="${col}" opacity=".12"/>`:''}<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="${fill?2.5:2}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
}
let PC={view:'desk',k:null,q:1,timer:null};
function blockedTrade(){return G.run?'⏸️ Termine ton mois en cours avant d’acheter ou de vendre.':null}
function computer(view,k){
  PC.view=view||'desk';if(k)PC.k=k;mktCatchUp();
  clearInterval(PC.timer);PC.timer=setInterval(()=>{if(!document.querySelector('#modal .pc')){clearInterval(PC.timer);return}if(mktCatchUp())computer(PC.view,PC.k);else{const c=$('#pcClock');if(c)c.textContent=nextIn()}},1000);
  const v=PC.view;let body='';
  if(v==='desk'){
    body=`<div class="pcdesk">
      <button class="app" data-a="pcOpen" data-v="bourse"><span style="background:#2DB36F">📈</span>Bourse</button>
      <button class="app" data-a="hCat"><span style="background:#F59E0B">🛋️</span>Catalogue</button>
      <button class="app" data-a="pcOpen" data-v="compte"><span style="background:#3F3FD4">🏦</span>Mes comptes</button>
      <button class="app" data-a="pcOpen" data-v="aide"><span style="background:#8B5CF6">💡</span>La bourse, c’est quoi ?</button></div>`;
  }else if(v==='bourse'){
    const tv=portValue(),cost=Object.values(G.port).reduce((a,p)=>a+(p.q>0?p.c:0),0);
    body=`<div class="pchead"><button class="bk" data-a="pcOpen" data-v="desk">←</button><b>📈 Bourse Capylum</b><small>Séance n°${G.mkt.day} · prochaine dans <span id="pcClock">${nextIn()}</span></small></div>
      <div class="pfol"><div><small>Mon portefeuille</small><b>${eur2(tv)}</b></div><div style="text-align:right"><small>Plus / moins-value</small><b class="${tv-cost>=0?'pos':'neg'}">${tv?(tv-cost>=0?'+':'−')+eur2(Math.abs(tv-cost)):'—'}</b></div></div>
      ${STOCKS.map(s=>{const h=G.mkt.px[s.k],p=h[h.length-1],ch=p/h[h.length-2]-1,c30=p/h[Math.max(0,h.length-31)]-1,pos=G.port[s.k];
        return`<button class="stk" data-a="pcOpen" data-v="stock|${s.k}"><span class="si">${s.ic}</span><span class="sn"><b>${s.n}</b><small>${s.k}${s.fict?' · fictive':''}${pos&&pos.q?` · ${pos.q} action${pos.q>1?'s':''}`:''}</small></span>
          <span class="sp">${spark(h,90,34,c30>=0?'#24A866':'#E5484D')}</span><span class="sv"><b>${eur2(p)}</b><small class="${ch>=0?'pos':'neg'}">${pct(ch)}</small></span></button>`}).join('')}
      <div class="lbl" style="margin:12px 0 4px">📰 Actualités</div>
      <div class="news">${G.mkt.news.slice(0,4).map(n=>`<div><span>${n.t}</span><b class="${n.m>=0?'pos':'neg'}">${pct(n.m)}</b></div>`).join('')||'<div class="muted">Calme plat sur les marchés…</div>'}</div>`;
  }else if(v==='stock'){
    const s=STOCKS.find(x=>x.k===PC.k),h=G.mkt.px[s.k],p=h[h.length-1],c30=p/h[Math.max(0,h.length-31)]-1,pos=G.port[s.k]||{q:0,c:0},bl=blockedTrade();
    const maxQ=Math.max(0,Math.floor((G.money-1)/p)),q=PC.q;
    body=`<div class="pchead"><button class="bk" data-a="pcOpen" data-v="bourse">←</button><b>${s.ic} ${s.n}</b><small>${s.k}${s.fict?' · action fictive':''}</small></div>
      <div class="sbig"><b>${eur2(p)}</b><span class="${c30>=0?'pos':'neg'}">${pct(c30)} sur 30 séances</span></div>
      <div class="chart">${spark(h,300,120,c30>=0?"#24A866":"#E5484D",true)}</div>
      <p class="sdesc">${s.d}</p>
      <div class="row"><span>Tu possèdes</span><b>${pos.q} action${pos.q>1?'s':''}${pos.q?` · ${eur2(pos.q*p)}`:''}</b></div>
      ${pos.q?`<div class="row"><span>Prix d’achat moyen</span><b>${eur2(pos.c/pos.q)} <small class="${p*pos.q-pos.c>=0?'pos':'neg'}">(${pct(p*pos.q/pos.c-1)})</small></b></div>`:''}
      <div class="row"><span>💳 Sur ton compte</span><b>${fmt(G.money)}</b></div>
      ${bl?`<div class="verdict neu" style="margin-top:10px"><p>${bl}</p></div>`:`
      <div class="lbl" style="margin-top:10px">Quantité</div>
      <div class="amts">${[1,5,10].map(n=>`<button class="${q===n?'on':''}" data-a="pcQ" data-v="${n}">${n}</button>`).join('')}<button class="${q==='max'?'on':''}" data-a="pcQ" data-v="max">Max</button></div>
      <div style="display:flex;gap:8px"><button class="btn" style="--tc:#24A866" data-a="pcBuy" ${maxQ<1?'disabled':''}>Acheter ${q==='max'?maxQ:Math.min(q,maxQ)||q}</button><button class="btn" style="--tc:#E5484D" data-a="pcSell" ${pos.q<1?'disabled':''}>Vendre ${q==='max'?pos.q:Math.min(q,pos.q)||q}</button></div>
      <p class="muted" style="font-size:12.5px;margin:8px 0 0">Frais : 1 € par ordre (comme chez un vrai courtier). ${s.div?'🍫 Dividende versé à chaque fin de mois de vie.':''}</p>`}
      <div class="lbl" style="margin:12px 0 4px">📰 Actualités ${s.n}</div><div class="news">${G.mkt.news.filter(n=>n.k===s.k||!n.k).slice(0,3).map(n=>`<div><span>${n.t}</span><b class="${n.m>=0?'pos':'neg'}">${pct(n.m)}</b></div>`).join('')||'<div class="muted">Pas de nouvelles…</div>'}</div>`;
  }else if(v==='compte'){
    body=`<div class="pchead"><button class="bk" data-a="pcOpen" data-v="desk">←</button><b>🏦 Mes comptes</b><small>Tout ce que tu possèdes</small></div>
      <div class="row"><span>💳 Compte courant</span><b class="${G.money<0?'neg':''}">${fmt(G.money)}</b></div><div class="row"><span>🐷 Épargne (livret)</span><b>${fmt(G.savings)}</b></div>
      <div class="row"><span>🌍 Placements (ETF du parcours)</span><b>${fmt(G.invest)}</b></div><div class="row"><span>📈 Actions</span><b>${fmt(portValue())}</b></div>
      <div class="row"><span>🛋️ Mobilier (valeur de revente)</span><b>${fmt(homeValue())}</b></div>
      <div class="row"><b>Total (hors mobilier)</b><b>${fmt(wealth())}</b></div>
      <div class="verdict neu" style="margin-top:12px"><p>💡 L’argent du <b>compte courant</b> sert à vivre et à acheter. L’<b>épargne</b> est ton coussin de sécurité. Les <b>actions</b> peuvent rapporter plus… ou faire perdre.</p></div>`;
  }else if(v==='aide'){
    body=`<div class="pchead"><button class="bk" data-a="pcOpen" data-v="desk">←</button><b>💡 La bourse, c’est quoi ?</b><small>En 5 points</small></div>
      <ol class="steps"><li>Une <b>action</b>, c’est un tout petit morceau d’une entreprise.</li><li>Si l’entreprise marche bien, le prix monte. Sinon, il baisse. <b>Personne</b> ne peut prévoir l’avenir.</li>
      <li>Nvidia et Claude sont <b>volatiles</b> : elles bougent beaucoup. Nestlé est plus calme et verse un <b>dividende</b> (une part des bénéfices).</li>
      <li>Ne mets <b>jamais</b> l’argent dont tu as besoin pour vivre. Et ne mets pas tous tes œufs dans le même panier : <b>diversifie</b> !</li>
      <li>Vendre en panique quand ça baisse, c’est souvent transformer une baisse passagère en vraie perte.</li></ol>
      <p class="muted" style="font-size:12.5px">Les cours de ce jeu sont <b>simulés</b> : ce ne sont pas les vrais prix.</p>`;
  }
  modal(`<div class="pc"><div class="pcbar"><span>🖥️ Mon ordinateur</span><button data-a="pcClose">✕</button></div><div class="pcbody">${body}</div></div>`);
}
function nextIn(){const s=Math.max(0,60-Math.floor((Date.now()-G.mkt.last)/1000));return`0:${String(s).padStart(2,'0')}`}
function trade(buy){
  const bl=blockedTrade();if(bl)return toast(bl,'neg');
  const s=STOCKS.find(x=>x.k===PC.k),p=price(s.k),pos=G.port[s.k]||(G.port[s.k]={q:0,c:0});
  if(buy){const maxQ=Math.floor((G.money-1)/p),q=PC.q==='max'?maxQ:Math.min(PC.q,maxQ);if(q<1)return toast('Pas assez sur ton compte','neg');
    G.money-=q*p+1;pos.q+=q;pos.c+=q*p+1;beep('coin');toast(`✅ Achat de ${q} ${s.n} à ${eur2(p)}`,'pos');
    if(s.k!=='NESN'&&q*p>Math.max(300,wealth()*.4))setTimeout(()=>toast('💡 Attention : beaucoup d’argent sur une seule action très risquée !'),1400)}
  else{const q=PC.q==='max'?pos.q:Math.min(PC.q,pos.q);if(q<1)return;const avg=pos.c/pos.q;G.money+=q*p-1;pos.c-=avg*q;pos.q-=q;if(!pos.q)pos.c=0;
    const gain=(p-avg)*q-1;beep(gain>=0?'coin':'bad');toast(`${gain>=0?'💰':'📉'} Vente de ${q} ${s.n} : ${gain>=0?'+':'−'}${eur2(Math.abs(gain))}`,gain>=0?'pos':'neg')}
  G.money=Math.round(G.money*100)/100;save();computer('stock');if(typeof homeHud==='function')homeHud();
}
Object.assign(A,{
  pc:()=>computer('desk'),
  pcOpen:v=>{const[a,b]=String(v).split('|');if(a==='stock')PC.q=PC.q||1;computer(a,b)},
  pcQ:v=>{PC.q=v==='max'?'max':+v;computer('stock')},
  pcBuy:()=>trade(true),pcSell:()=>trade(false),
  pcClose:()=>{clearInterval(PC.timer);closeModal()},
});
