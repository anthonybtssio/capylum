/* =========================================================
   Capylum — LE SUPERMARCHÉ : on remplit son panier,
   on voit les prix (et le prix au kilo), on passe en caisse.
   ========================================================= */
const MM='Marque magasin',GM='Grande marque';
const RAYONS=[
 {k:'fec',n:'Féculents',ic:'🍝',need:3,items:[
  {e:'🍝',n:'Pâtes',q:'1 kg',kg:1,v:[[1.10,MM],[2.30,GM]]},
  {e:'🍝',n:'Pâtes (petit paquet)',q:'500 g',kg:.5,v:[[.85,MM]]},
  {e:'🍚',n:'Riz',q:'1 kg',kg:1,v:[[1.70,MM],[3.40,GM]]},
  {e:'🍞',n:'Pain de mie',q:'500 g',kg:.5,v:[[1.25,MM],[2.60,GM]]},
  {e:'🥔',n:'Pommes de terre',q:'2,5 kg',kg:2.5,v:[[2.90,'Filet'],[4.40,'Bio']]},
  {e:'🥖',n:'Baguette',q:'250 g',kg:.25,v:[[1.10,'Boulangerie']]},
 ]},
 {k:'veg',n:'Fruits & légumes',ic:'🥦',need:4,items:[
  {e:'🍎',n:'Pommes',q:'1 kg',kg:1,v:[[2.20,'Vrac'],[3.60,'Bio']]},
  {e:'🍌',n:'Bananes',q:'1 kg',kg:1,v:[[1.90,'Vrac'],[2.90,'Bio']]},
  {e:'🥕',n:'Carottes',q:'1 kg',kg:1,v:[[1.30,'Vrac'],[2.20,'Bio']]},
  {e:'🍅',n:'Tomates',q:'1 kg',kg:1,v:[[2.90,'Vrac']]},
  {e:'🥬',n:'Salade',q:'1 pièce',v:[[.99,'Vrac']]},
  {e:'🥦',n:'Légumes surgelés',q:'1 kg',kg:1,v:[[2.40,MM],[3.90,GM]]},
  {e:'🍓',n:'Fraises (hors saison)',q:'250 g',kg:.25,v:[[3.90,'Importées']]},
 ]},
 {k:'pro',n:'Protéines',ic:'🍗',need:3,items:[
  {e:'🥚',n:'Œufs',q:'×12',v:[[3.20,MM],[4.60,'Plein air bio']]},
  {e:'🍗',n:'Filets de poulet',q:'500 g',kg:.5,v:[[5.40,MM],[7.20,'Label rouge']]},
  {e:'🍔',n:'Steaks hachés',q:'×4',v:[[5.90,MM],[8.40,GM]]},
  {e:'🫘',n:'Lentilles',q:'500 g',kg:.5,v:[[1.40,MM],[2.60,GM]]},
  {e:'🐟',n:'Thon en boîte',q:'×3',v:[[4.20,MM],[6.90,GM]]},
  {e:'🥓',n:'Jambon',q:'×4 tranches',v:[[2.30,MM],[3.90,GM]]},
 ]},
 {k:'lait',n:'Laitages & petit-déj',ic:'🥛',need:2,items:[
  {e:'🥛',n:'Lait',q:'6 × 1 L',v:[[5.40,MM],[7.80,GM]]},
  {e:'🍦',n:'Yaourts',q:'×8',v:[[1.90,MM],[3.60,GM]]},
  {e:'🧀',n:'Fromage',q:'250 g',kg:.25,v:[[2.10,MM],[3.40,GM]]},
  {e:'🥣',n:'Céréales',q:'500 g',kg:.5,v:[[2.10,MM],[4.40,GM]]},
  {e:'☕',n:'Café',q:'250 g',kg:.25,v:[[2.90,MM],[5.90,GM]]},
 ]},
 {k:'fun',n:'Petits plaisirs',ic:'🍫',need:0,items:[
  {e:'🍫',n:'Tablette de chocolat',q:'100 g',kg:.1,v:[[1.20,MM],[2.90,GM]]},
  {e:'🥔',n:'Chips',q:'150 g',kg:.15,v:[[1.10,MM],[2.40,GM]]},
  {e:'🥤',n:'Soda',q:'1,5 L',v:[[.95,MM],[2.20,GM]]},
  {e:'🍕',n:'Pizza surgelée',q:'400 g',kg:.4,v:[[2.50,MM],[4.90,GM]]},
  {e:'🍨',n:'Glace',q:'500 mL',v:[[2.80,MM],[5.50,GM]]},
  {e:'🍪',n:'Cookies',q:'200 g',kg:.2,v:[[1.40,MM],[2.90,GM]]},
 ]},
 {k:'mai',n:'Maison & hygiène',ic:'🧴',need:2,first:1,items:[
  {e:'🧺',n:'Lessive',q:'30 lavages',v:[[4.50,MM],[9.90,GM]]},
  {e:'🧻',n:'Papier toilette',q:'×12',v:[[3.90,MM],[6.90,GM]]},
  {e:'🪥',n:'Dentifrice',q:'75 mL',v:[[1.20,MM],[2.90,GM]]},
  {e:'🧴',n:'Gel douche',q:'250 mL',v:[[1.30,MM],[3.20,GM]]},
  {e:'🧽',n:'Éponges',q:'×3',v:[[.90,MM]]},
 ]},
];
const GI=[];RAYONS.forEach(r=>r.items.forEach((it,i)=>{it.r=r.k;it.id=r.k+i;GI.push(it)}));
const gItem=id=>GI.find(x=>x.id===id);
const eur=n=>n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
let GS=null;
function gBudget(){const f=R.fixed.find(x=>x.groc&&x.d===R.pending.d);return f?Math.abs(f.a):55}
function gNeeds(){const first=R.fixed.filter(x=>x.groc).sort((a,b)=>a.d-b.d)[0];const isFirst=first&&first.d===R.pending.d;
  return RAYONS.filter(r=>r.need&&(!r.first||isFirst)).map(r=>({k:r.k,ic:r.ic,n:r.n,need:r.need,have:Object.entries(GS.cart).filter(([id])=>id.split('|')[0].startsWith(r.k)).reduce((a,[,q])=>a+q,0)}))}
function gTotal(){return Object.entries(GS.cart).reduce((a,[key,q])=>{const[id,vi]=key.split('|');return a+gItem(id).v[+vi][0]*q},0)}
function openGroceries(){
  if(!R.pending||!R.pending.groc)return;
  GS=R.pending.gs||(R.pending.gs={tab:'fec',cart:{}});save();renderGroc();
}
function renderGroc(){
  const P=PAR[R.p],budget=gBudget(),tot=gTotal(),needs=gNeeds(),ray=RAYONS.find(r=>r.k===GS.tab);
  const pct=clamp(tot/budget*100,0,100),over=tot>budget;
  const items=ray.items.map(it=>{const cnt=vi=>GS.cart[it.id+'|'+vi]||0;
    return`<div class="gi"><div class="ge">${it.e}</div><div class="gn"><b>${it.n}</b><small>${it.q}</small></div><div class="gv">${it.v.map(([p,l],vi)=>`<button class="gb ${cnt(vi)?'on':''}" data-a="gAdd" data-v="${it.id}|${vi}"><b>${eur(p)}</b><small>${l}${it.kg?` · ${eur(p/it.kg)}/kg`:''}</small>${cnt(vi)?`<i>${cnt(vi)}</i>`:''}</button>`).join('')}</div></div>`}).join('');
  const cart=Object.entries(GS.cart).filter(([,q])=>q>0).map(([key,q])=>{const[id,vi]=key.split('|'),it=gItem(id);return`<button class="gc" data-a="gSub" data-v="${key}">${it.e}${q>1?`×${q}`:''}<span>−</span></button>`}).join('');
  modal(`<div class="sh" style="padding-bottom:12px"><div class="ty"><span>🛒 Supermarché · Courses de la semaine</span><span>${JOURS[R.stops[R.si].wd]} ${R.pending.d}</span></div>
    <div class="gbud"><div><small>Ton panier</small><b class="${over?'neg2':''}">${eur(tot)}</b></div><div style="text-align:right"><small>Budget courses</small><b>${eur(budget)}</b></div></div>
    <div class="gbar"><i style="width:${pct}%;background:${over?'#FFB4B4':'#FFE36E'}"></i></div></div>
  <div class="sb" style="padding-top:12px">
    <div class="lbl" style="margin-bottom:6px">📝 Ta liste pour bien manger cette semaine</div>
    <div class="gneeds">${needs.map(n=>`<span class="${n.have>=n.need?'ok':''}">${n.ic} ${Math.min(n.have,n.need)}/${n.need} ${n.n}</span>`).join('')}</div>
    <div class="gtabs">${RAYONS.map(r=>`<button class="${r.k===GS.tab?'on':''}" data-a="gTab" data-v="${r.k}">${r.ic} ${r.n}</button>`).join('')}</div>
    <div class="glist">${items}</div>
    <div class="gcart">${cart||'<span class="muted">🧺 Ton panier est vide. Touche un prix pour ajouter un article.</span>'}</div>
    <p style="font-size:12.5px;color:var(--muted);margin:8px 0 0">💡 Compare le <b>prix au kilo</b> : le petit paquet n’est pas toujours le moins cher !</p>
    <button class="btn" data-a="gPay">💳 Passer en caisse · ${eur(tot)}</button></div>`,'#2DB36F');
  const sb=document.querySelector('#modal .sheet');if(sb&&GS.scroll)sb.scrollTop=GS.scroll;
}
function gRemember(){const sb=document.querySelector('#modal .sheet');GS.scroll=sb?sb.scrollTop:0}
function gPay(){
  const tot=Math.round(gTotal()*100)/100,budget=gBudget(),needs=gNeeds(),miss=needs.filter(n=>n.have<n.need);
  if(tot===0&&!GS.confirmEmpty){GS.confirmEmpty=1;toast('Ton panier est vide ! Touche encore « Passer en caisse » pour sortir sans rien acheter.','neg');return}
  // Ce que le même panier aurait coûté en marques magasin
  let cheap=0,gm=0;Object.entries(GS.cart).forEach(([key,q])=>{const[id,vi]=key.split('|'),it=gItem(id);cheap+=it.v[0][0]*q;if(+vi>0)gm+=q});
  const treats=Object.entries(GS.cart).filter(([k])=>k.startsWith('fun')).reduce((a,[,q])=>a+q,0);
  const joy=Math.min(6,treats*2)-(miss.length?3+miss.length*2:0);
  const ok=!miss.length&&tot<=budget?1:0;
  if(tot>0)tx(-Math.round(tot),'🛒 Courses de la semaine','courses');
  if(joy)G.joy=clamp(G.joy+joy,0,100);
  track('groc',ok);const bonus=ok?rewardGood():0;R.pending.res=true;beep(ok?'ok':'bad');save();updateHud();
  const lines=[];
  if(!miss.length&&tot<=budget)lines.push(`Liste complète et <b>${eur(budget-tot)}</b> de moins que ton budget 🎉`);
  if(tot>budget)lines.push(`Tu as dépassé ton budget de <b>${eur(tot-budget)}</b>.`);
  if(miss.length)lines.push(`Il te manque : ${miss.map(n=>`${n.ic} ${n.n}`).join(', ')}. Mal manger, ça fatigue (−${3+miss.length*2} 😊).`);
  if(gm&&cheap<tot-.5)lines.push(`En marques magasin, le même panier aurait coûté <b>${eur(cheap)}</b> (−${eur(tot-cheap)}). Souvent, c’est la même qualité !`);
  if(bonus)lines.push(`🏅 Prime « courses malines » : <b>+${fmt(bonus)}</b>`);
  if(treats)lines.push(`Tes petits plaisirs te remontent le moral (+${Math.min(6,treats*2)} 😊).`);
  modal(`<div class="sh"><div class="ty"><span>🛒 Supermarché</span></div><div class="em">🧾</div><h3>Ton ticket de caisse</h3></div><div class="sb">
    <div class="verdict ${ok?'good':'bad'}"><b>${ok?'Courses réussies ! 👍':'Peut mieux faire 😬'}</b><p>${lines.join('<br>')}</p></div>
    <div class="ticket">${Object.entries(GS.cart).filter(([,q])=>q>0).map(([key,q])=>{const[id,vi]=key.split('|'),it=gItem(id),p=it.v[+vi][0];return`<div><span>${it.e} ${it.n} ${it.v.length>1?`<small>(${it.v[+vi][1]})</small>`:''}${q>1?` ×${q}`:''}</span><b>${eur(p*q)}</b></div>`}).join('')||'<div><span>Rien acheté</span><b>0,00 €</b></div>'}
      <div class="tt"><span>TOTAL</span><b>${eur(tot)}</b></div></div>
    <div class="row"><span>💳 Compte</span><b class="${G.money<0?'neg':''}">${fmt(G.money)}</b></div>
    <button class="btn" style="--tc:#2DB36F" data-a="cont">Sortir du magasin</button></div>`,'#2DB36F');
}
Object.assign(A,{
  gTab:v=>{GS.tab=v;GS.scroll=0;renderGroc()},
  gAdd:v=>{gRemember();GS.cart[v]=(GS.cart[v]||0)+1;GS.confirmEmpty=0;beep('tap');save();renderGroc()},
  gSub:v=>{gRemember();GS.cart[v]=Math.max(0,(GS.cart[v]||0)-1);if(!GS.cart[v])delete GS.cart[v];save();renderGroc()},
  gPay,
});
