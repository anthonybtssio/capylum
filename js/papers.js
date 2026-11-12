/* =========================================================
   Capylum — LES PAPIERS DE LA VRAIE VIE
   Factures, avis d'échéance, fiche de paie, conséquences
   d'un choix (affichées APRÈS), primes pour les bons réflexes.
   ========================================================= */

/* ---------- Conséquences d'un choix : on compare avant / après ---------- */
function snapMoney(){return{m:G.money,s:G.savings,i:G.invest,j:G.joy,a:G.autoSave||0,d:(G.debts||[]).length,b:G.boost}}
function conseqHTML(b){
  const c=[],dm=Math.round(G.money-b.m),ds=Math.round(G.savings-b.s),di=Math.round(G.invest-b.i),dj=Math.round(G.joy-b.j);
  if(dm)c.push([dm>0?'pos':'neg',`💳 ${sign(dm)}`]);
  if(ds)c.push(['sav',`🐷 ${sign(ds)}`]);
  if(di)c.push(['sav',`📈 ${sign(di)}`]);
  if(dj)c.push([dj>0?'joy':'neg',`😊 ${dj>0?'+':''}${dj}`]);
  if((G.autoSave||0)!==b.a)c.push(['sav',`🔁 ${fmt(G.autoSave)}/mois`]);
  if((G.debts||[]).length>b.d){const d=G.debts[G.debts.length-1];c.push(['neg',`💳 ${fmt(d.a)}/mois à rembourser`])}
  if(G.boost!==b.b)c.push(['pos',`📈 Salaire ${G.boost>b.b?'+':''}${Math.round((G.boost/b.b-1)*100)} %`]);
  return`<div class="conseq"><span class="lbl">Conséquences</span><div>${c.length?c.map(([k,t])=>`<span class="chip ${k}">${t}</span>`).join(''):'<span class="chip">Aucun impact sur ton argent</span>'}</div></div>`;
}

/* ---------- Prime pour une bonne réponse / un bon réflexe ---------- */
function rewardAmt(){if(!R)return 0;const k=PAR[R.p].key;if(k==='pocket')return 2;if(k==='summer')return 10;return clamp(Math.round(salary(R.p)*.01/5)*5,10,40)}
function rewardGood(){const a=rewardAmt();if(!a)return 0;tx(a,'🏅 Prime bon réflexe','revenu');R.bonus=(R.bonus||0)+a;beep('coin');return a}

/* ---------- Les factures, comme dans la vraie vie ---------- */
const eurP=n=>Math.abs(n).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
const ISSUERS=[
 [/Dépôt de garantie/i,{co:'Résidence & Gestion',ic:'🔐',col:'#2F86D8',doc:'Reçu – dépôt de garantie',lines:a=>[['Dépôt de garantie (1 mois de loyer hors charges)',a]],tip:'Il te sera rendu à ton départ si l’état des lieux de sortie est identique à celui d’entrée.'}],
 [/^Loyer/i,{co:'Résidence & Gestion',ic:'🏠',col:'#2F86D8',doc:'Avis d’échéance – loyer',lines:a=>[['Loyer hors charges',a*.88],['Provision pour charges (eau, ménage, ascenseur)',a*.12]],tip:'Règle d’or : ton loyer ne devrait pas dépasser un tiers de tes revenus.'}],
 [/Participation/i,{co:'Papa & Maman',ic:'🏡',col:'#E0605F',doc:'Petit mot du frigo',lines:a=>[['Participation aux courses et aux factures de la maison',a]],tip:'Participer aux frais de la maison, c’est apprendre que vivre coûte de l’argent.'}],
 [/Électricité/i,{co:'Énergie Plus',ic:'⚡',col:'#F59E0B',doc:'Facture d’électricité',lines:a=>{const abo=Math.min(a,13.4),k=Math.max(0,Math.round((a-abo)/.25));return[['Abonnement mensuel (puissance 6 kVA)',abo],[`Consommation : ${k} kWh × 0,25 €`,a-abo]]},tip:'Chaque degré de chauffage en moins, c’est environ 7 % d’économie. Et pense à éteindre les veilles !'}],
 [/Internet/i,{co:'NetFibre',ic:'🌐',col:'#22B8CF',doc:'Facture box internet',lines:a=>[['Box Fibre 1 Gb/s',a-5],['Location du décodeur TV',5]],tip:'Les offres « promo 1 an » doublent souvent ensuite : compare chaque année !'}],
 [/Forfait|forfait/,{co:'Mobilo',ic:'📱',col:'#8B5CF6',doc:'Facture mobile',lines:a=>[['Forfait 100 Go, appels illimités',a]],tip:'Changer d’opérateur est simple : ton nouvel opérateur s’occupe de tout avec ton code RIO.'}],
 [/Assurance habitation/i,{co:'Assur’Habitat',ic:'🛡️',col:'#2DB36F',doc:'Échéance mensuelle – assurance',lines:a=>[['Multirisque habitation (incendie, dégât des eaux, vol)',a*.8],['Responsabilité civile',a*.2]],tip:'En cas de sinistre, tu as 5 jours ouvrés pour déclarer (2 jours pour un vol).'}],
 [/Assurance emprunteur/i,{co:'Assur’Prêt',ic:'🛡️',col:'#2DB36F',doc:'Cotisation assurance emprunteur',lines:a=>[['Garantie décès, invalidité, incapacité',a]],tip:'Tu peux changer d’assurance emprunteur à tout moment : compare !'}],
 [/Crédit immobilier/i,{co:'Banque Capylum',ic:'🏦',col:'#8B5CF6',doc:'Échéance de prêt immobilier',lines:a=>[['Capital remboursé (ta part de maison)',a*.55],['Intérêts payés à la banque',a*.45]],tip:'Au début d’un crédit, tu rembourses surtout des intérêts. La part de capital augmente avec le temps.'}],
 [/Taxe foncière/i,{co:'Centre des finances publiques',ic:'🏛️',col:'#3F6FB5',doc:'Taxe foncière – mensualisation',lines:a=>[['Taxe foncière (1/12e)',a]],tip:'Quand on est propriétaire, on paie chaque année la taxe foncière.'}],
 [/APL/i,{co:'Caisse d’allocations familiales',ic:'🤝',col:'#2F7DD8',doc:'Avis de versement – aide au logement',lines:a=>[['Aide personnalisée au logement (APL)',a]],tip:'L’APL dépend de tes revenus et de ton loyer. Pense à déclarer tout changement de situation !'}],
 [/Abonnements/i,{co:'Relevé de tes abonnements',ic:'📺',col:'#E2558F',doc:'Prélèvements du mois',lines:a=>(G.subs&&G.subs.length?G.subs.map(x=>[x.t,x.a]):[['Abonnements',a]]),tip:'Fais le tri une fois par an : une appli inutilisée, c’est de l’argent jeté chaque mois.'}],
 [/Pass|Essence|covoiturage|Scooter|vélo|transport/i,{co:'Mobilité Plus',ic:'🚌',col:'#1E9E86',doc:'Facture transport',lines:a=>[['Transport du mois',a]],tip:'Ton employeur rembourse au moins 50 % de ton abonnement de transports en commun.'}],
 [/Crédit auto|Location auto|Assurance auto|Entretien/i,{co:'Garage & Crédit Auto',ic:'🚗',col:'#E2643A',doc:'Échéance automobile',lines:a=>[['Mensualité',a]],tip:'Une voiture, c’est aussi l’assurance, l’entretien, le contrôle technique… à prévoir dans ton budget.'}],
 [/Prime|Bonus|coups de main/i,{co:'Ton employeur',ic:'🎁',col:'#24A866',doc:'Avis de versement',lines:a=>[['Prime',a]],tip:'Une rentrée d’argent imprévue ? Bon moment pour épargner une partie !'}],
 [/./,{co:'Organisme de crédit',ic:'💳',col:'#E5484D',doc:'Échéance',lines:a=>[['Mensualité',a]],tip:'Additionne tes mensualités : au-delà de 35 % de tes revenus, c’est le surendettement.'}],
];
const issuerOf=f=>ISSUERS.find(([re])=>re.test(f.t))[1];
function invoiceHTML(f,d){
  const I=issuerOf(f),P=PAR[R.p],a=Math.abs(f.a),inc=f.a>0,lines=I.lines(a);
  const num=`${inc?'AV':'FA'}-${P.y}${String(P.m+1).padStart(2,'0')}-${String(Math.abs([...f.t].reduce((h,c)=>h*31+c.charCodeAt(0),7))%9000+1000)}`;
  const city={city:'Grande Ville',town:'Petiteville',country:'Les Prés-sur-Loire'}[(G.persona&&G.persona.place)||'town'];
  const dd=`${String(d).padStart(2,'0')}/${String(P.m+1).padStart(2,'0')}/${P.y}`;
  return`<div class="paper">
    <div class="ph"><div class="plogo" style="background:${I.col}">${I.ic}</div><div class="pco"><b>${I.co}</b><small>Service clients · ${city}</small></div><div class="pdoc"><b>${I.doc}</b><small>N° ${num}</small></div></div>
    <div class="pmid"><div><small>${inc?'Bénéficiaire':'Client·e'}</small><b>${G.char?G.char.name:'Moi'}</b><small>12 rue des Lilas · ${city}</small></div><div style="text-align:right"><small>Date</small><b>${dd}</b><small>Période : ${MOIS[P.m]} ${P.y}</small></div></div>
    <table class="ptab"><tr><th>Désignation</th><th>Montant</th></tr>${lines.map(([l,v])=>`<tr><td>${l}</td><td>${eurP(v)}</td></tr>`).join('')}
      <tr class="ptot"><td>${inc?'Montant versé':'Total à payer'}</td><td>${eurP(a)}</td></tr></table>
    <div class="pfoot"><span>${inc?'💶 Virement reçu sur ton compte':'🏦 Prélèvement automatique sur ton compte'}</span><span class="pstamp ${inc?'in':''}">${inc?'VERSÉ':'PAYÉ'}</span></div>
    <div class="ptip">💡 ${I.tip}</div></div>`;
}
let INV=null;
function showInvoices(list,d){
  return new Promise(res=>{INV={list,d,i:0,res};renderInvoice()});
}
function renderInvoice(){
  const{list,d,i}=INV,f=list[i],P=PAR[R.p],n=list.length;
  modal(`<div class="sh" style="--tc:#5C6278;padding-bottom:12px"><div class="ty"><span>📬 Courrier · ${f.a>0?'tu reçois de l’argent':'une facture arrive'}</span><span>${JOURS[(R.wd0+d-1)%7]} ${d}${n>1?` · ${i+1}/${n}`:''}</span></div></div>
    <div class="sb">${invoiceHTML(f,d)}
    <div class="row"><span>💳 Ton compte maintenant</span><b class="${G.money<0?'neg':''}">${fmt(G.money)}</b></div>
    ${G.money<0?'<p class="neg" style="font-size:13px;margin:4px 0 0">⚠️ Ton compte est dans le rouge ! Reprends un peu d’épargne 🐷 avant la prochaine facture.</p>':''}
    <button class="btn" style="--tc:#3F3FD4" data-a="invNext">${i<n-1?'Courrier suivant →':'J’ai compris ✓'}</button></div>`);
  const pp=document.querySelector('#modal .paper');if(pp){pp.classList.add('drop')}
}
A.invNext=()=>{if(!INV)return;beep('tap');if(INV.i<INV.list.length-1){INV.i++;renderInvoice()}else{const r=INV.res;INV=null;closeModal();r()}};

/* ---------- La fiche de paie ---------- */
function payslipHTML(net){
  const P=PAR[R.p];if(P.key==='pocket')return'';
  const emp=G.job?G.job.n:G.summer?G.summer.n:'Ton employeur',t=net>=1900?.03:net>=1600?.012:0;
  const navi=net/(1-t),brut=navi/.78,co=[['Santé, retraite de base',.069],['Retraite complémentaire',.04],['CSG / CRDS',.092],['Prévoyance, mutuelle',.019]];
  return`<div class="paper slip"><div class="ph"><div class="plogo" style="background:#24A866">📄</div><div class="pco"><b>Bulletin de paie</b><small>${emp}</small></div><div class="pdoc"><b>${MOIS[P.m]} ${P.y}</b><small>${G.char?G.char.name:''}</small></div></div>
    <table class="ptab"><tr><th>Élément</th><th>Montant</th></tr><tr><td><b>Salaire brut</b></td><td><b>${eurP(brut)}</b></td></tr>
    ${co.map(([l,r])=>`<tr><td>− ${l} <small>(${(r*100).toFixed(1).replace('.',',')} %)</small></td><td>−${eurP(brut*r)}</td></tr>`).join('')}
    <tr><td>= Net avant impôt</td><td>${eurP(navi)}</td></tr><tr><td>− Impôt prélevé à la source <small>(${(t*100).toFixed(1).replace('.',',')} %)</small></td><td>−${eurP(navi*t)}</td></tr>
    <tr class="ptot"><td>Net payé sur ton compte</td><td>${eurP(net)}</td></tr></table>
    <div class="ptip">💡 Ton employeur paie aussi environ <b>${fmt(brut*.42)}</b> de cotisations patronales en plus de ton salaire brut. Garde tes fiches de paie toute ta vie : elles prouvent tes droits à la retraite.</div></div>`;
}
