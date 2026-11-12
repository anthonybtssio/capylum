/* =========================================================
   Capylum — TUTO LUDIQUE avec Capy la mascotte
   Des bulles qui montrent les vrais boutons + un petit défi.
   ========================================================= */
const kidT=(kid,other)=>isKid()?kid:other;
const TOURS={
 city:()=>{const f=PAR[0],l=PAR[PAR.length-1],nm=G.char?G.char.name:'';return[
  {e:'👋',t:`Salut ${nm} !`,x:kidT(`Moi c’est Capy ! Ici, tu vas grandir en accéléré : de <b>${f.age}</b> à <b>${l.age} ans</b>. À chaque étape, tu gères ton argent… comme un·e grand·e !`,
     `Moi c’est Capy ! Dans Capylum, tu vis ta vie en accéléré : de <b>${f.age}</b> à <b>${l.age} ans</b>, une étape à la fois. Tes choix d’argent construisent ton avenir.`)},
  {e:'🎯',t:'Le but du jeu',x:`Chaque étape = <b>un mois de ta vie</b>. Tu te promènes dans ta rue, tu entres dans les magasins et tu fais des choix.<div class="tgoals"><span>✅<b>Jamais dans le rouge</b></span><span>🐷<b>Épargner l’objectif</b></span><span>😊<b>Garder le moral</b></span></div>Chaque réussite = 1 ⭐. Vise les 3 !`},
  {sel:'.bub.active',e:'🏢',t:'Les étapes de ta vie',x:'Chaque bâtiment de la ville est une étape. Celui qui <b>clignote</b> est le prochain à jouer.'},
  {sel:'.wallet',e:'💳',t:'Ton argent',x:'Tout ce que tu gagnes reste à toi d’une étape à l’autre. Les bonnes décisions d’aujourd’hui t’aident demain !'},
  {sel:'[data-a="home"]',e:'🏠',t:'Ta maison',x:'Décore ta maison avec l’argent gagné, et utilise ton <b>ordinateur</b> pour investir en bourse (Nestlé, Nvidia, Claude…).'},
  {sel:'#bubDream',e:'🌟',t:'Ton rêve',x:'Ton rêve est construit dans la ville. Chaque euro mis de côté t’en rapproche !'},
  {e:'🧠',t:'Petit défi !',x:'D’après toi, pour gagner les 3 étoiles d’un mois, il faut…',quiz:[kidT('Tout dépenser en bonbons','Tout dépenser pour avoir le moral'),'Éviter le rouge, épargner et garder le moral','Acheter le plus de choses possible'],a:1},
  {e:'🚀',t:'À toi de jouer !',x:'Touche le bâtiment qui clignote pour commencer ta première étape. Je reste là si tu as besoin : bouton ❓ en haut.'},
 ]},
 board:()=>[
  {e:'🏙️',t:'Bienvenue dans ta rue !',x:'Ce mois-ci se passe dans cette rue. <b>Chaque bâtiment est un jour</b> : magasin, banque, cinéma… Tu entres dedans et tu fais des choix.<br>🏅 Chaque bonne réponse te rapporte une <b>prime</b> !'},
  {sel:'.rollbtn',e:'🚶',t:'Avancer',x:'Touche ici : ton perso marche jusqu’au prochain bâtiment. Le bouton te dit <b>où tu vas</b> et quelles factures tu croiseras en chemin.'},
  {sel:'#hud',e:'💳',t:'Tes compteurs',x:'Ton <b>compte</b> (l’argent pour vivre), ta <b>tirelire</b> 🐷 et ton <b>moral</b> 😊.'},
  {sel:'.goal',e:'🎯',t:'L’objectif du mois',x:'Mets cette somme de côté avant la fin du mois pour gagner une étoile.'},
  {sel:'#stprog',e:'🧾',t:'Ton mois en un coup d’œil',x:'Les bâtiments à venir. En face, les <b>panneaux rouges sont tes factures</b> : quand tu passes devant, la facture arrive dans ta boîte aux lettres et l’argent est prélevé. Garde assez d’argent !'},
  {sel:'[data-a="piggy"]',e:'🐷',t:'Ta tirelire',x:'Mets de côté quand tu veux. Astuce de pro : épargne le jour de la paie, avant de dépenser !'},
 ],
 home:()=>[
  {e:'🏠',t:'Bienvenue chez toi !',x:'Touche le sol pour te déplacer. Touche un objet pour l’utiliser : le lit, la télé, le chat…'},
  {sel:'[data-a="hCat"]',e:'📖',t:'Le catalogue',x:'Achète des meubles et de la déco avec l’argent gagné dans ta vie. Mais garde de quoi payer tes factures !'},
  {sel:'[data-a="hEdit"]',e:'✏️',t:'Décorer',x:'Déplace, tourne, range ou revends tes meubles. (Un meuble revendu ne rapporte que la moitié de son prix.)'},
  {sel:'[data-a="pc"]',e:'🖥️',t:'Ton ordinateur',x:'Ton tableau de bord : patrimoine, graphiques, <b>simulateurs</b> (intérêts, crédit…), <b>cours</b> récompensés et la <b>bourse</b> (Nestlé, Nvidia, Claude).'},
 ],
};
let TU=null;
function tour(name,force,cb){
  G.tuto=G.tuto||{};if(G.tuto[name]&&!force){cb&&cb();return}
  TU={name,steps:TOURS[name](),i:0,cb,picked:null};
  TU.steps=TU.steps.filter(s=>!s.sel||visEl(s.sel));
  if(!$('#tuto')){const d=document.createElement('div');d.id='tuto';document.body.appendChild(d)}
  renderTour();
}
function visEl(sel){const el=document.querySelector(sel);if(!el)return null;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight?el:null}
function renderTour(){
  const s=TU.steps[TU.i],el=s.sel&&visEl(s.sel),N=TU.steps.length,last=TU.i===N-1;
  let spot='';let pos='';
  if(el){const r=el.getBoundingClientRect(),p=8;spot=`<div class="tspot" style="left:${r.left-p}px;top:${r.top-p}px;width:${r.width+p*2}px;height:${r.height+p*2}px"></div>`;
    pos=r.top+r.height/2>innerHeight/2?`bottom:${Math.max(12,innerHeight-r.top+18)}px`:`top:${Math.min(innerHeight-260,r.bottom+18)}px`}
  const quiz=s.quiz?`<div class="tquiz">${s.quiz.map((o,i)=>`<button class="obb ${TU.picked==null?'':i===s.a?'right':i===TU.picked?'wrong':''}" data-a="tQuiz" data-v="${i}" ${TU.picked!=null?'disabled':''}>${o}</button>`).join('')}</div>`:'';
  const canNext=!s.quiz||TU.picked!=null;
  $('#tuto').innerHTML=`<div class="tdim ${el?'clear':''}"></div>${spot}<div class="tbub ${el?'':'mid'}" style="${pos}">
    <div class="tcap"><img src="icons/icon-192.png" alt=""><span>${s.e}</span></div>
    <b>${s.t}</b><p>${s.x}</p>${quiz}
    ${s.quiz&&TU.picked!=null?`<p class="tfb ${TU.picked===s.a?'pos':'neg'}">${TU.picked===s.a?'🎉 Exactement ! Tu as tout compris.':'Presque ! Il faut équilibrer : pas de rouge, un peu d’épargne… et du moral 😊'}</p>`:''}
    <div class="tfoot"><span class="tdots">${TU.steps.map((_,i)=>`<i class="${i===TU.i?'on':''}"></i>`).join('')}</span>
      ${last?'':`<button class="tskip" data-a="tSkip">Passer</button>`}<button class="tnext" data-a="tNext" ${canNext?'':'disabled'}>${last?'C’est parti ! 🚀':'Suivant →'}</button></div></div>`;
}
function endTour(){const t=TU;TU=null;G.tuto[t.name]=1;save();const el=$('#tuto');if(el)el.innerHTML='';t.cb&&t.cb()}
Object.assign(A,{
  tNext:()=>{if(!TU)return;beep('tap');if(TU.i<TU.steps.length-1){TU.i++;TU.picked=null;renderTour()}else endTour()},
  tSkip:()=>{if(TU)endTour()},
  tQuiz:v=>{if(!TU)return;const s=TU.steps[TU.i];TU.picked=+v;if(+v===s.a){beep('win');confetti()}else beep('bad');renderTour()},
  help:()=>{if(!$('#board').classList.contains('hidden')&&R)tour('board',true);else tour('city',true)},
});
window.addEventListener('resize',()=>{if(TU)renderTour()});
