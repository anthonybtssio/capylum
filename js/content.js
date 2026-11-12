/* =========================================================
   Capylum — contenu : métiers, nouvelles cartes, quiz,
   personnalisation (âge, profil, rêve, réponses du joueur)
   ========================================================= */
const parOf=k=>BASE.find(p=>p.key===k)||EXTRA[k];
const isKid=()=>G.persona&&G.persona.age==='kid';

/* ---------- MÉTIERS (premier emploi à 18 ans) ---------- */
const FIELDS={tech:['💻','La tech & le numérique'],care:['🩺','La santé & les autres'],shop:['🛍️','Le commerce & la vente'],craft:['🔧','L’artisanat & le bâtiment'],
  art:['🎨','La création & l’art'],nature:['🌾','La nature & les animaux'],food:['🍽️','La cuisine & la restauration'],sport:['🏅','Le sport & l’action']};
const JOBS=[
 {f:'shop',n:'Vendeur·se en boulangerie',ic:'🥖',sal:1450,g:1,joy:-3,s:'réveil à 5 h 😴',fb:'Bon salaire pour débuter, mais il faudra se lever tôt !'},
 {f:'shop',n:'Hôte·sse de caisse',ic:'🏪',sal:1380,g:1,joy:-1,s:'horaires fixes, peu d’évolution',fb:'Un job stable pour commencer. Pour évoluer, pense aux formations proposées par l’enseigne.'},
 {f:'shop',n:'Préparateur·rice de commandes',ic:'📦',sal:1520,g:.97,joy:-4,s:'physique, mais bien payé au début',ok:0,fb:'Bien payé au départ, mais très peu d’évolution sans formation : ton salaire va stagner.'},
 {f:'sport',n:'Vendeur·se en magasin de sport',ic:'👟',sal:1400,g:1,joy:1,s:'travail le samedi',fb:'Un job dynamique, avec des réductions sur le matériel !'},
 {f:'sport',n:'Livreur·se à vélo (auto-entrepreneur)',ic:'🚴',sal:1250,g:.95,joy:1,s:'libre, mais ni congés payés ni chômage',ok:0,fb:'Libre… mais en auto-entrepreneur, pas de congés payés, pas de chômage, et tu paies tes cotisations toi-même !'},
 {f:'sport',n:'Engagé·e dans l’armée',ic:'🎖️',sal:1600,g:1.06,joy:0,s:'logé·e, nourri·e, formé·e',fb:'Un salaire correct, logement et formation inclus. Mais c’est un engagement de plusieurs années.'},
 {f:'tech',n:'Alternance dans un studio de jeux vidéo',ic:'🎮',sal:1050,g:1.15,joy:4,s:'tu apprends un métier',ok:1,fb:'Moins payé aujourd’hui… mais ton salaire grimpera plus vite ensuite. C’est un investissement sur toi-même !'},
 {f:'tech',n:'Alternance développeur·se web',ic:'💻',sal:1100,g:1.2,joy:3,s:'diplôme payé par l’entreprise',ok:1,fb:'Un diplôme payé par l’entreprise ET un salaire : l’alternance, c’est gagnant-gagnant.'},
 {f:'tech',n:'Technicien·ne en réparation de téléphones',ic:'📱',sal:1420,g:1.04,joy:2,s:'minutieux·se et patient·e',fb:'Un métier utile et anti-gaspillage, de plus en plus demandé ♻️'},
 {f:'care',n:'Aide-soignant·e (en apprentissage)',ic:'🩺',sal:1150,g:1.12,joy:4,s:'un métier qui a du sens',ok:1,fb:'Un métier qui recrute partout en France, et qui aide les autres ❤️'},
 {f:'care',n:'Animateur·rice périscolaire',ic:'🧸',sal:1050,g:1.03,joy:5,s:'horaires coupés',fb:'Tu adores les enfants ? Le BAFA t’aidera à évoluer.'},
 {f:'craft',n:'Apprenti·e électricien·ne',ic:'⚡',sal:1000,g:1.2,joy:2,s:'CAP en alternance',ok:1,fb:'Les artisans qualifiés sont très recherchés : ton salaire grimpera vite !'},
 {f:'craft',n:'Apprenti·e menuisier·ère',ic:'🪚',sal:980,g:1.18,joy:4,s:'tu fabriques avec tes mains',ok:1,fb:'Un savoir-faire précieux : certains artisans finissent par créer leur propre atelier.'},
 {f:'art',n:'Alternance graphiste',ic:'🎨',sal:1000,g:1.13,joy:5,s:'portfolio à construire',ok:1,fb:'Créer ET apprendre : chaque projet enrichit ton portfolio.'},
 {f:'art',n:'Vendeur·se en librairie',ic:'📚',sal:1400,g:1,joy:3,s:'entouré·e de livres',fb:'Un métier passion, avec un salaire qui évolue lentement.'},
 {f:'nature',n:'Ouvrier·ère agricole',ic:'🚜',sal:1420,g:1,joy:1,s:'en plein air, saisonnier',fb:'Du grand air… mais attention, les contrats saisonniers s’arrêtent en fin de saison.'},
 {f:'nature',n:'Apprenti·e paysagiste',ic:'🌳',sal:1000,g:1.12,joy:4,s:'jardins et espaces verts',ok:1,fb:'Un métier en plein air qui recrute, avec un vrai diplôme à la clé.'},
 {f:'nature',n:'Auxiliaire en clinique vétérinaire',ic:'🐶',sal:1400,g:1.03,joy:5,s:'soigner les animaux',fb:'Un métier passion ! Il faudra une formation pour évoluer.'},
 {f:'food',n:'Commis de cuisine',ic:'👨‍🍳',sal:1450,g:1.06,joy:0,s:'service du soir et week-end',fb:'Dur, mais avec de l’expérience on peut devenir chef·fe de partie.'},
 {f:'food',n:'Serveur·se en restaurant',ic:'🍽️',sal:1420,g:.98,joy:-1,s:'+ pourboires, horaires décalés',fb:'Les pourboires aident, mais les horaires sont fatigants.'},
 {f:'any',n:'Service civique (10 mois)',ic:'🤝',sal:650,g:1.1,joy:7,s:'mission d’intérêt général',fb:'Peu payé, mais une expérience géniale à mettre sur ton CV.'},
];
const SUMMER_JOBS=[
 {n:'Animateur·rice en centre de loisirs',sal:650,joy:4,s:'tu adores les enfants',fb:'Un job qui a du sens… et qui prépare au BAFA !'},
 {n:'Serveur·se au snack de la plage',sal:750,joy:0,s:'rythme intense',fb:'Bien payé, et parfois des pourboires !'},
 {n:'Cueillette des fruits',sal:700,joy:-2,s:'dur mais en plein air',fb:'Physique… mais tu vas être en super forme.'},
 {n:'Équipier·ère en fast-food',sal:720,joy:-1,s:'horaires variables',fb:'Un classique du premier job : on y apprend vite à travailler en équipe.'},
 {n:'Aide au camping',sal:680,joy:3,s:'piscine et touristes',fb:'Ambiance vacances… même en travaillant !'},
 {n:'Vendeur·se de glaces',sal:700,joy:2,s:'sous le soleil',fb:'Le job le plus rafraîchissant de l’été 🍦'},
 {n:'Baby-sitting',sal:420,joy:4,s:'quelques heures par jour',fb:'Moins d’heures, donc moins payé, mais tu gardes du temps pour toi.'},
];
function jobOption(j){return{t:`${j.ic} ${j.n}`,s:`${fmt(j.sal)}/mois · ${j.s}`,fx:{job:{n:j.n,sal:j.sal,f:j.g},joy:j.joy||undefined},ok:j.ok??null,f:j.fb}}
function pickJobs(){
  const P=G.persona||{},field=P.field,place=P.place;
  const pool=JOBS.filter(j=>place==='city'?j.f!=='nature'||j.n.includes('vétérinaire'):true);
  const mine=shuffle(pool.filter(j=>j.f===field)).slice(0,2);
  const rest=shuffle(pool.filter(j=>!mine.includes(j)&&(place!=='country'||Math.random()<.8))).slice(0,4-mine.length);
  return[...mine,...rest].map(j=>JOBS.indexOf(j));
}
function jobIntro(){
  if(!R.jobOpts)R.jobOpts=pickJobs();const fl=G.persona&&FIELDS[G.persona.field];
  return{e:'💼',t:'Ton premier emploi',q:`Tu as 18 ans et tu vis encore chez tes parents. Tu as 300 € de côté grâce à ton job d’été. Voici les offres près de chez toi${fl?` (les premières correspondent à ton intérêt pour ${fl[1].toLowerCase()} ${fl[0]})`:''}. Compare bien : salaire d’aujourd’hui… et de demain !`,
    o:R.jobOpts.map(i=>jobOption(JOBS[i]))};
}
function summerIntro(){
  if(!R.jobOpts)R.jobOpts=shuffle(SUMMER_JOBS.map((_,i)=>i)).slice(0,3);
  return{e:'☀️',t:'Ton premier job d’été',q:`Tu as ${PAR[R.p].age} ans et c’est l’été. Plusieurs jobs te sont proposés. Lequel choisis-tu ?`,
    o:R.jobOpts.map(i=>{const j=SUMMER_JOBS[i];return{t:j.n,s:`${fmt(j.sal)} · ${j.s}`,fx:{summer:{n:j.n,sal:j.sal},joy:j.joy||undefined},ok:null,f:j.fb}})};
}
function pocketIntro(){
  return{e:'🪙',t:'Ton argent de poche',q:`Tu as ${PAR[R.p].age} ans. Tes parents te proposent un marché pour ton argent de poche. Que choisis-tu ?`,o:[
   {t:'20 € par mois, à gérer tout·e seul·e',ok:1,f:'Gérer un budget pour tout le mois, c’est apprendre à prévoir !'},
   {t:'20 € + 5 € si j’aide à la maison',s:'Vaisselle, poubelles, ranger…',fx:{pocketBonus:5},ok:1,f:'Gagner de l’argent grâce à ses efforts : bravo ! Tu toucheras 5 € de plus le 15.'}]};
}

/* ---------- Démarrage de la vie selon l'âge réel ---------- */
const AGE_BRACKET=n=>n<=13?'kid':n<=17?'teen':n<=25?'young':'adult';
function startKit(P){
  // Premier parcours d'un joueur qui commence directement plus tard dans la vie
  const yrs=Math.max(0,P.age-18);
  if(!G.job){const pool=JOBS.filter(j=>j.f===((G.persona&&G.persona.field)||'shop')&&!/Alternance|Apprenti|civique/.test(j.n));const j=pool[0]||JOBS[0];G.job={n:j.n,sal:j.sal,f:j.g}}
  G.rent=Math.round(560*PM().rent/10)*10;
  G.money=Math.max(1300,G.rent+700);G.savings=600+yrs*450;
}

/* ---------- Nouvelles cartes : vie de tous les jours ---------- */
COMMON.choice.push(
 {e:'📞',t:'Le faux conseiller',pl:'bank',q:'« Bonjour, service fraude de votre banque. Un paiement suspect de 890 € est en cours. Pour l’annuler, donnez-moi le code que vous allez recevoir par SMS. »',o:[
   {t:'Je raccroche et j’appelle ma banque au numéro officiel',ok:1,f:'Une banque ne demande JAMAIS un code reçu par SMS. Raccrocher et rappeler soi-même : le réflexe qui sauve.'},
   {t:'Je donne le code pour bloquer la fraude',fx:{money:-890,cat:'imprevus',joy:-8},ok:0,f:'C’était l’arnaque au faux conseiller : le code servait à VALIDER le paiement de 890 €.'}]},
 {e:'🧾',t:'La peur de « changer de tranche »',pl:'townhall',cond:G=>G.age>=19,q:'Un collègue panique : « Si on m’augmente de 100 €, je passe dans la tranche d’impôt du dessus et je vais gagner MOINS ! »',o:[
   {t:'Faux : seule la partie au-dessus du seuil est taxée plus',ok:1,f:'L’impôt est progressif : chaque tranche ne taxe que les euros qui la dépassent. Une augmentation ne fait jamais baisser ton revenu après impôt.'},
   {t:'C’est vrai, mieux vaut refuser l’augmentation',ok:0,f:'C’est un mythe très répandu ! Passer dans la tranche supérieure ne s’applique qu’aux euros en plus.'}]},
 {e:'🛍️',t:'Le retour en boutique',pl:'clothes',q:'Tu as acheté un pull à 45 € en boutique. 3 jours après, il ne te plaît plus. Le vendeur refuse de le reprendre.',o:[
   {t:'« C’est la loi, j’ai 14 jours pour changer d’avis ! »',fx:{joy:-2},ok:0,f:'Faux ! Les 14 jours de rétractation concernent les achats à distance (internet, téléphone). En magasin, reprendre un article est un geste commercial, pas une obligation.'},
   {t:'Je demande poliment un avoir',fx:{joy:2},ok:1,f:'Bien joué : en magasin, tout dépend de la politique du vendeur. Pour les achats en ligne, en revanche, tu as 14 jours.'}]},
 {e:'💸',t:'Prêter à un ami',pl:'cafe',q:'Ton meilleur ami te demande 300 € « jusqu’à la fin du mois ».',o:[
   {t:'Je prête ce que je peux me permettre de perdre (100 €)',fx:G=>{if(Math.random()<.7){G._note='Il te rembourse à la date prévue 👍';return{joy:3}}G._note='Il a oublié… tu ne reverras pas ces 100 €.';return{money:-100,cat:'autre',joy:-2}},ok:1,f:'Règle d’or : ne prête que ce que tu accepterais de ne jamais revoir, et fixe une date de remboursement.'},
   {t:'Je prête les 300 €',fx:G=>{if(Math.random()<.5){G._note='Il te rembourse, avec un peu de retard.';return{joy:2}}G._note='Il n’a pas pu rembourser… et ça a jeté un froid.';return{money:-300,cat:'autre',joy:-6}},ok:null,f:'Généreux ! Mais l’argent peut abîmer une amitié : écrivez la date de remboursement.'},
   {t:'Je refuse gentiment',fx:{joy:-1},ok:null,f:'Tu as le droit de dire non, surtout si ton budget est serré.'}]},
 {e:'🔋',t:'La facture qui grimpe',pl:'home',cond:G=>G.age>=20,q:'Ta facture d’électricité augmente. Box, console et télé restent en veille toute la nuit.',o:[
   {t:'Une multiprise à interrupteur (12 €)',fx:{money:-12,cat:'achats'},ok:1,f:'Les veilles peuvent peser jusqu’à 10 % de la facture d’électricité. Un clic le soir et c’est réglé !'},
   {t:'Je laisse comme ça',fx:{money:-8,cat:'factures'},ok:0,f:'Des petits watts qui coûtent des dizaines d’euros par an.'}]},
 {e:'📉',t:'Le découvert',pl:'bank',cond:G=>G.age>=18,q:'Il te manque 80 € avant la paie. Ta banque te « dépanne » avec un découvert.',o:[
   {t:'Je le limite au maximum et je rembourse dès la paie',fx:{money:-8,cat:'factures'},ok:1,f:'Le découvert coûte des agios (des intérêts, souvent plus de 15 % par an) + parfois des frais. À utiliser en dernier recours.'},
   {t:'C’est pratique, je reste dans le rouge',fx:{money:-25,cat:'factures',joy:-2},ok:0,f:'Agios + frais d’incident : être dans le rouge coûte vite cher !'}]},
 {e:'🧮',t:'Payer en 10 fois',pl:'tech',q:'Une console à 500 €. Le site propose : « Payez en 10 × 55 € ! »',o:[
   {t:'Je calcule : 10 × 55 = 550 €',ok:1,f:'50 € de plus que le prix affiché ! Toujours calculer le coût TOTAL d’un paiement en plusieurs fois.'},
   {t:'55 €, c’est rien, je prends !',fx:{money:-55,cat:'achats',joy:4,debt:{t:'Console en 10 fois',a:55}},ok:0,f:'Le paiement fractionné rend les achats indolores… jusqu’à ce qu’ils s’empilent.'}]},
 {e:'🏷️',t:'Le prix barré',pl:'tech',q:'Un aspirateur « 299 € → 149 € » ! Mais sur un comparateur, il est vendu 155 € partout depuis 6 mois.',o:[
   {t:'Je compare le prix réel avant d’acheter',ok:1,f:'Le prix barré est souvent gonflé. Ce qui compte, c’est le prix payé, comparé ailleurs.'},
   {t:'−50 %, je fonce !',fx:{money:-149,cat:'achats',joy:2},ok:0,f:'La « réduction » était surtout du marketing : le vrai prix était déjà autour de 155 €.'}]},
 {e:'🍿',t:'L’essai gratuit',pl:'tech',q:'« 1 mois offert ! » Il faut juste entrer ta carte bancaire.',o:[
   {t:'J’accepte et je mets un rappel pour résilier',ok:1,f:'Bonne technique : l’essai gratuit compte sur ton oubli pour te facturer ensuite.'},
   {t:'J’accepte, je verrai bien',fx:{money:-13,cat:'factures'},ok:0,f:'Oublié… tu as été prélevé·e de 12,99 € le mois suivant.'},
   {t:'Non merci',ok:null,f:'Zéro risque !'}]},
 {e:'🧑‍💼',t:'Demander une augmentation',pl:'office',cond:G=>G.job&&G.age>=21,q:'Ça fait 2 ans que tu fais du bon travail. Ton entretien annuel arrive.',o:[
   {t:'Je prépare mes réussites et je demande +5 %',fx:G=>{if(Math.random()<.65){G._note='Accordé ! Ton salaire augmente de 5 %.';return{boost:1.05,joy:5}}G._note='Pas cette année… mais ton manager a noté ta motivation.';return{joy:-1}},ok:1,f:'Arriver avec des exemples concrets multiplie tes chances. Ça ne coûte rien de demander !'},
   {t:'Je n’ose pas',ok:0,f:'Ton salaire ne bougera pas tout seul : il faut souvent le demander.'}]},
 {e:'📨',t:'Une offre d’emploi',pl:'office',cond:G=>G.age>=22,q:G=>`Une autre entreprise veut t’embaucher. Aujourd’hui, tu gagnes environ ${fmt(R?salary(R.p):2000)} par mois.`,o:[
   {t:'Poste payé 12 % de plus, mais 1 h de trajet',fx:{boost:1.12,joy:-5},ok:null,f:'Compare toujours le salaire ET les coûts cachés : temps, transport, fatigue.'},
   {t:'Même salaire, 2 jours de télétravail',fx:{money:30,joy:6},ok:1,f:'Moins de trajets = moins de dépenses et plus de temps libre. Le salaire n’est pas le seul critère !'},
   {t:'Je reste où je suis',ok:null,f:'La stabilité a aussi de la valeur.'}]},
 {e:'🏋️',t:'L’abonnement « sans engagement »',pl:'fun',cond:G=>G.age>=18,q:'Salle de sport : 19,99 €/mois sans engagement, ou 14,99 €/mois avec un engagement d’un an.',o:[
   {t:'Sans engagement : je teste d’abord',fx:{money:-20,cat:'loisirs',joy:3},ok:1,f:'Malin : beaucoup d’abonnés arrêtent après 2 mois. L’engagement n’est rentable que si tu y vas vraiment toute l’année.'},
   {t:'Engagement d’un an, c’est moins cher',fx:{money:-15,cat:'loisirs',joy:2,debt:{t:'Salle de sport (engagement)',a:15}},ok:null,f:'Moins cher par mois… à condition d’y aller pendant 12 mois !'}]},
);
COMMON.event.push(
 {e:'🚰',t:'Dégât des eaux',pl:'home',cond:G=>G.age>=20,q:'Une fuite chez ton voisin du dessus abîme ton plafond.',o:[
   {t:'Je déclare à mon assurance habitation sous 5 jours',fx:{money:-150,cat:'imprevus'},ok:1,f:'Tu paies seulement la franchise : l’assurance couvre le reste. Le délai pour déclarer : 5 jours ouvrés.'},
   {t:'Je répare moi-même sans rien dire',fx:{money:-600,cat:'imprevus',joy:-3},ok:0,f:'Sans déclaration, pas de remboursement : tu paies tout !'}]},
 {e:'💳',t:'Carte bancaire volée',pl:'bank',cond:G=>G.age>=16,q:'Ton portefeuille a disparu dans le bus ! Ta carte bancaire était dedans.',o:[
   {t:'Je fais opposition immédiatement',fx:{joy:-2},ok:1,f:'L’opposition bloque la carte tout de suite. En cas de fraude, la banque doit te rembourser (sauf négligence grave, comme noter ton code sur la carte).'},
   {t:'J’attends de voir si quelqu’un la rapporte',fx:{money:-250,cat:'imprevus',joy:-6},ok:0,f:'Le voleur a eu le temps de faire des achats sans contact…'}]},
 {e:'🦷',t:'Rage de dents',pl:'hospital',cond:G=>G.age>=18,q:'Le dentiste annonce une couronne : 500 €. La Sécu et ta mutuelle en remboursent une partie.',o:[
   {t:'Je demande un devis et je vérifie ma mutuelle',fx:{pay:120,cat:'imprevus'},ok:1,f:'Avec la Sécu et une bonne mutuelle, le reste à charge peut fondre. Lis tes garanties !'},
   {t:'Je n’ai pas pris de mutuelle : je paie presque tout',fx:{pay:430,cat:'imprevus',joy:-3},ok:0,f:'Une mutuelle coûte quelques euros par mois mais évite ces gros restes à charge.'}]},
);
COMMON.luck.push(
 {e:'💰',t:'La prime d’activité',pl:'townhall',cond:G=>G.age>=18&&G.age<32&&G.job,q:'En faisant une simulation sur le site de la CAF, tu découvres que tu as droit à une aide : la prime d’activité !',o:[
   {t:'Je fais la demande',fx:{money:120},ok:1,f:'La prime d’activité complète les petits salaires dès 18 ans. Beaucoup de gens y ont droit sans le savoir !'}]},
 {e:'🔁',t:'Trop payé, remboursé',pl:'post',cond:G=>G.age>=20,q:'Ton fournisseur d’électricité te rembourse 45 € : tes mensualités étaient trop élevées toute l’année.',o:[
   {t:'Je mets ça de côté',fx:{money:45,toSavings:45},ok:1,f:'Une rentrée imprévue ? Direction la tirelire 🐷'},{t:'Petit plaisir !',fx:{money:45,joy:2},ok:null,f:'Profite ! Tu aurais aussi pu l’épargner.'}]},
);
COMMON.mail.push(
 {e:'📄',t:'Brut ou net ?',pl:'post',cond:G=>G.age>=18&&G.job,q:'Sur ta fiche de paie : salaire brut 1 800 €… mais tu ne touches que 1 400 €.',o:[
   {t:'Normal : les cotisations financent santé, chômage et retraite',ok:1,f:'Dans le privé, environ 22 % du brut part en cotisations. C’est ta protection sociale.'},
   {t:'Mon patron m’a volé 400 € !',fx:{joy:-3},ok:0,f:'Pas de panique : brut − cotisations = net. Personne ne t’a volé·e 😉'}]},
 {e:'🏛️',t:'Courrier des impôts',pl:'townhall',cond:G=>G.age>=19,q:'Tu gagnes peu et tu ne paies pas d’impôt. Un ami dit : « Pas la peine de déclarer tes revenus alors ! »',o:[
   {t:'Je déclare quand même chaque année',ok:1,f:'La déclaration est obligatoire même sans impôt à payer, et l’avis de non-imposition sert pour les aides (APL, bourses…).'},
   {t:'Il a raison',fx:{money:-50,cat:'factures',joy:-2},ok:0,f:'Oubli de déclaration = pénalités, et tu risques de perdre des aides !'}]},
 {e:'📦',t:'Le colis fantôme',pl:'post',q:'Ta commande en ligne (60 €) n’est jamais arrivée. Le vendeur ne répond plus.',o:[
   {t:'Réclamation écrite, puis je contacte ma banque',fx:{joy:-1},ok:1,f:'Le vendeur est responsable jusqu’à la livraison. Une réclamation écrite (et ta banque en dernier recours) permet souvent d’être remboursé·e.'},
   {t:'Tant pis, je laisse tomber',fx:{money:-60,cat:'achats',joy:-3},ok:0,f:'Ne lâche pas : 60 €, c’est 60 € !'}]},
);
COMMON.sortie.push(
 {e:'🍽️',t:'L’addition',pl:'resto',q:'Resto entre amis : 4 personnes, 120 €. Toi, tu as juste pris une salade à 14 €.',o:[
   {t:'On partage en 4 (30 € chacun)',fx:{money:-30,cat:'loisirs',joy:4},ok:null,f:'Simple et convivial… mais tu paies 16 € pour les autres.'},
   {t:'Chacun paie ce qu’il a pris (14 €)',fx:{money:-14,cat:'loisirs',joy:3},ok:1,f:'Les applis de partage de dépenses rendent ça facile et sans malaise.'}]},
 {e:'🎢',t:'Parc d’attractions',pl:'fun',q:'Billet sur place : 62 €. Le même billet en ligne, 2 semaines avant : 45 €.',o:[
   {t:'J’achète en ligne à l’avance',fx:{money:-45,cat:'loisirs',joy:8},ok:1,f:'Anticiper = 17 € d’économies pour le même plaisir.'},
   {t:'J’y vais sur un coup de tête',fx:{money:-62,cat:'loisirs',joy:8},ok:null,f:'Spontané… et plus cher.'}]},
 {e:'🎲',t:'Soirée jeux',pl:'home',q:'Les copains proposent une soirée jeux de société chez toi.',o:[
   {t:'Chacun ramène un truc à grignoter',fx:{money:-5,cat:'courses',joy:6},ok:1,f:'Les meilleures soirées ne coûtent presque rien 🎲'},
   {t:'Je commande des sushis pour tout le monde',fx:{money:-70,cat:'loisirs',joy:7},ok:0,f:'Généreux, mais 70 € pour une soirée…'}]},
);

/* ---------- Quiz : questions plus concrètes, sans réponses « blague » ---------- */
COMMON.quiz=[
 {lvl:1,q:'Vrai ou faux : le paiement sans contact est limité à 50 € par achat.',o:['Vrai','Faux'],a:0,f:'Vrai ! Au-delà, il faut taper son code. Et après plusieurs paiements sans contact d’affilée, la carte redemande le code.'},
 {lvl:1,q:'« Shrinkflation », c’est quand…',o:['Le paquet rétrécit mais le prix reste le même','Le prix baisse pendant les soldes','Le magasin réduit ses horaires'],a:0,f:'Ton paquet de biscuits passe de 200 g à 180 g au même prix : c’est une hausse cachée. Regarde le prix au kilo !'},
 {q:'Tu achètes un jean sur internet. Combien de temps as-tu pour changer d’avis ?',o:['48 heures','14 jours','1 mois'],a:1,f:'14 jours de rétractation pour les achats à distance. En magasin, ce n’est PAS obligatoire !'},
 {q:'Café au bar : 3,50 €. Fait maison : 0,40 €. Sur 220 jours de travail, la différence est d’environ…',o:['70 €','300 €','680 €'],a:2,f:'(3,50 − 0,40) × 220 ≈ 680 € par an ! Les petites habitudes font les grosses sommes.'},
 {q:'Le Livret A, c’est…',o:['Sans risque et disponible à tout moment','Bloqué pendant 8 ans','Réservé aux plus de 25 ans'],a:0,f:'Il est garanti par l’État et tu peux retirer ton argent quand tu veux. Plafond : 22 950 €.'},
 {q:'La meilleure épargne de précaution, c’est…',o:['3 à 6 mois de dépenses sur un livret','Tout placé en bourse','Une carte de crédit avec un gros plafond'],a:0,f:'De quoi encaisser une panne ou une perte d’emploi sans crédit et sans stress.'},
 {q:'Vrai ou faux : il faut garder ses fiches de paie jusqu’à la retraite.',o:['Vrai','Faux'],a:0,f:'Vrai ! Elles prouvent tes droits à la retraite. Un coffre-fort numérique, c’est pratique.'},
 {cond:G=>G.age>=18,q:'Ton salaire brut est de 2 000 €. Dans le privé, ton net est d’environ…',o:['1 950 €','1 560 €','1 200 €'],a:1,f:'Environ 22 % de cotisations : 2 000 × 0,78 ≈ 1 560 €.'},
 {cond:G=>G.age>=18,q:'Logement vide à 600 €/mois. Le dépôt de garantie maximum que le propriétaire peut demander :',o:['600 €','1 200 €','1 800 €'],a:0,f:'1 mois de loyer hors charges pour un logement vide, 2 mois pour un meublé.'},
 {lvl:3,q:'100 € investis chaque mois pendant 30 ans, à 6 % par an. Tu auras environ…',o:['36 000 €','60 000 €','100 000 €'],a:2,f:'Tu as versé 36 000 €… les intérêts composés font monter le total à ~100 000 € !'},
 {lvl:3,q:'Un crédit renouvelable (« revolving ») coûte souvent…',o:['0 %','Environ 3 % par an','Plus de 15 % par an'],a:2,f:'C’est l’un des crédits les plus chers. À éviter !'},
 {lvl:3,q:'Inflation : 3 %. Ton livret rapporte 2 %. Ton pouvoir d’achat…',o:['Augmente','Baisse d’environ 1 %','Ne bouge pas'],a:1,f:'Rendement réel = rendement − inflation ≈ −1 %.'},
];
const QUIZ={
 work:[
  {q:'Sur ta fiche de paie, le montant viré sur ton compte s’appelle…',o:['Le salaire brut','Le net payé','Le salaire de base'],a:1,f:'Brut − cotisations − impôt prélevé à la source = net payé, ce qui arrive sur ton compte.'},
  {q:'Pendant ta période d’essai…',o:['Toi et ton employeur pouvez arrêter le contrat facilement','Ton employeur peut te payer moins que prévu','Tu n’as pas droit aux pauses'],a:0,f:'Pendant la période d’essai, chacun peut rompre le contrat simplement, avec un court délai de prévenance.'},
  {q:'Ton employeur rembourse ton abonnement de transports en commun à hauteur de…',o:['0 %','50 % minimum','100 % toujours'],a:1,f:'C’est la loi : au moins la moitié de ton pass transport. Pense à le demander !'},
  {q:'Tu gagnes 1 450 € net et tu épargnes 10 %. Ça fait…',o:['14,50 €','145 €','290 €'],a:1,f:'10 % de 1 450 € = 145 €. Programme-le le jour de la paie !'},
  {q:'Vrai ou faux : les heures supplémentaires sont payées plus cher.',o:['Vrai','Faux'],a:0,f:'Vrai : en général +25 % pour les 8 premières heures sup de la semaine (au moins +10 % selon les accords).'},
 ],
 home:[
  {q:'Si l’état des lieux de sortie est identique à l’entrée, le propriétaire doit te rendre ta caution en…',o:['1 mois','6 mois','1 an'],a:0,f:'1 mois si tout est en ordre, 2 mois s’il y a des différences.'},
  {q:'L’APL (aide au logement) est versée par…',o:['La CAF','Ton employeur','Ta banque'],a:0,f:'La CAF calcule l’aide selon tes revenus et ton loyer. Fais la simulation dès ton emménagement !'},
  {q:'Ton loyer ne devrait pas dépasser… de tes revenus.',o:['Un tiers','La moitié','Les deux tiers'],a:0,f:'Au-delà d’un tiers, il ne reste plus assez pour vivre et épargner.'},
  {q:'Quand on est locataire, l’assurance habitation est…',o:['Obligatoire','Seulement conseillée','Payée par le propriétaire'],a:0,f:'Le propriétaire peut te demander l’attestation chaque année. Elle te protège (dégât des eaux, incendie…).'},
  {q:'Tu quittes un logement meublé. Ton préavis est de…',o:['1 mois','3 mois','6 mois'],a:0,f:'1 mois pour un meublé (et pour un logement vide en zone tendue), sinon 3 mois.'},
 ],
 daily:[
  {q:'Une dépense « fixe », c’est…',o:['Une dépense qui revient chaque mois (loyer, forfait…)','Une dépense qu’on ne peut jamais réduire','Une dépense payée en espèces'],a:0,f:'On la connaît à l’avance : c’est la base du budget. Et on peut souvent la renégocier !'},
  {q:'Règle 50/30/20 : les 20 % servent…',o:['Aux loisirs','À l’épargne','Au loyer'],a:1,f:'50 % besoins, 30 % envies, 20 % épargne.'},
  {q:'Paquet A : 400 g pour 2,40 €. Paquet B : 1 kg pour 4,50 €. Le moins cher au kilo ?',o:['Le paquet A','Le paquet B','C’est pareil'],a:1,f:'A = 6 €/kg, B = 4,50 €/kg. Le prix au kilo est écrit en petit sur l’étiquette !'},
  {q:'Dans un supermarché, les produits les plus rentables pour le magasin sont souvent…',o:['À hauteur des yeux','Tout en bas','Dans la réserve'],a:0,f:'Regarde en haut et en bas des rayons : les produits moins chers y sont souvent !'},
 ],
 big:[
  {q:'Une voiture neuve perd environ… de sa valeur la 1re année.',o:['5 %','20 %','50 %'],a:1,f:'C’est la « décote ». Une occasion récente évite cette grosse perte.'},
  {q:'Le TAEG d’un crédit, c’est…',o:['Le coût total du crédit, frais compris, en % par an','Le taux fixé par la Banque centrale','Le montant de la mensualité'],a:0,f:'Plus il est élevé, plus le crédit coûte cher. Compare-le toujours !'},
  {q:'La garantie légale sur un produit neuf dure…',o:['6 mois','2 ans','5 ans'],a:1,f:'2 ans, gratuitement, pour tous les produits neufs achetés en France.'},
  {q:'Après avoir signé un crédit à la consommation, tu peux changer d’avis pendant…',o:['Aucun délai','14 jours','2 mois'],a:1,f:'14 jours de rétractation : pratique si tu as signé trop vite !'},
  {q:'Pour financer un gros achat, le plus économique est…',o:['Un crédit à la consommation','L’épargne mise de côté avant','Le paiement en 4 fois'],a:1,f:'Épargner avant, c’est zéro intérêt et zéro stress.'},
 ],
 future:[
  {q:'L’assurance-vie, c’est surtout…',o:['Un placement pour épargner et transmettre','Une assurance décès obligatoire','Un crédit pour les retraités'],a:0,f:'Malgré son nom, c’est une enveloppe d’épargne très utilisée en France, avantageuse après 8 ans.'},
  {q:'Les intérêts composés, c’est…',o:['Gagner des intérêts sur tes intérêts','Des intérêts payés en plusieurs fois','Un taux fixé par l’État'],a:0,f:'L’effet boule de neige : plus tu attends, plus ça grossit ☃️'},
  {q:'Diversifier, c’est…',o:['Acheter beaucoup d’actions d’une même entreprise','Répartir son argent sur plusieurs placements','Changer de banque souvent'],a:1,f:'Si un placement baisse, les autres compensent.'},
  {q:'À 7 % par an, ton argent double en environ…',o:['3 ans','10 ans','25 ans'],a:1,f:'La règle de 72 : 72 ÷ 7 ≈ 10 ans.'},
  {q:'Un ETF « Monde » contient…',o:['Une seule grande entreprise','Des centaines d’entreprises de nombreux pays','Uniquement des obligations d’État'],a:1,f:'C’est la diversification en un seul clic, avec très peu de frais.'},
  {q:'« Rendement énorme » + « sans risque », c’est…',o:['Une arnaque probable','Un bon plan rare','Un Livret A'],a:0,f:'Plus on te promet de gagner, plus le risque est grand. Toujours.'},
 ],
 house:[
  {q:'Dans l’ancien, les frais de notaire représentent environ…',o:['2 % du prix','8 % du prix','20 % du prix'],a:1,f:'Environ 7 à 8 % : il faut les prévoir en plus du prix !'},
  {q:'Les banques prêtent si tes mensualités ne dépassent pas…',o:['15 % de tes revenus','35 % de tes revenus','60 % de tes revenus'],a:1,f:'C’est la règle des 35 % pour éviter le surendettement.'},
  {q:'Le PTZ, c’est…',o:['Un prêt à taux zéro pour un premier achat','Une taxe sur les propriétaires','Une assurance pour le crédit'],a:0,f:'Sous conditions de revenus, l’État aide les primo-accédants.'},
  {q:'Emprunter 200 000 € sur 25 ans à 3,6 % coûte en intérêts environ…',o:['10 000 €','100 000 €','200 000 €'],a:1,f:'Environ 103 000 € d’intérêts ! D’où l’intérêt de négocier le taux et la durée.'},
 ],
 pocket:[
  {q:'Tu as 20 € et tu dépenses 12 €. Il te reste…',o:['6 €','8 €','12 €'],a:1,f:'20 − 12 = 8 €.'},
  {q:'Dans un jeu, 1 000 gemmes coûtent 10 €. Un skin à 500 gemmes coûte en vrai…',o:['5 €','50 €','500 €'],a:0,f:'Les monnaies virtuelles cachent le vrai prix : convertis toujours en euros !'},
  {q:'Lequel est un BESOIN ?',o:['Un manteau en hiver','Le dernier jeu vidéo','Des cartes rares'],a:0,f:'Un besoin, c’est ce dont on ne peut pas se passer.'},
  {q:'Tu mets 2 € de côté chaque semaine. Après 10 semaines, tu as…',o:['12 €','20 €','30 €'],a:1,f:'10 × 2 = 20 € ! Les petites sommes deviennent grandes.'},
  {q:'Une pub dit « Tout le monde l’a déjà ! ». Elle veut surtout…',o:['Te donner envie d’acheter vite','T’informer gentiment','Te faire économiser'],a:0,f:'Les pubs jouent sur l’envie de faire comme les autres. Prends le temps de réfléchir !'},
  {q:'Sachet de 10 bonbons à 2 €, ou bonbon à 0,30 € pièce. Le moins cher par bonbon ?',o:['Le sachet','Le bonbon à l’unité','C’est pareil'],a:0,f:'2 € ÷ 10 = 0,20 € le bonbon. Le sachet gagne… si tu les manges tous !'},
 ],
 summer:[
  {q:'À 16 ans, tu peux travailler…',o:['Pendant les vacances, avec l’accord de tes parents','Seulement après 18 ans','Seulement le week-end'],a:0,f:'Dès 14 ans pendant les vacances, avec des règles pour protéger les jeunes.'},
  {q:'Le SMIC, c’est…',o:['Le salaire minimum légal','Une prime de vacances','Une aide de l’État pour les jeunes'],a:0,f:'Aucun employeur ne peut payer moins (avec un abattement possible pour les moins de 18 ans).'},
  {q:'Tu gagnes 700 € et tu en épargnes la moitié. Ça fait…',o:['70 €','350 €','500 €'],a:1,f:'700 ÷ 2 = 350 €.'},
  {q:'Le Livret Jeune est ouvert aux…',o:['12 – 25 ans','18 – 30 ans','Plus de 25 ans'],a:0,f:'Il rapporte au moins autant que le Livret A, sans risque.'},
  {q:'Une publicité d’influenceur doit être signalée par la mention…',o:['« Collaboration commerciale »','« Avis personnel »','Rien du tout'],a:0,f:'C’est obligatoire en France : un placement de produit, c’est de la pub.'},
 ],
};
Object.entries(QUIZ).forEach(([k,q])=>{const P=parOf(k);if(P)P.deck.quiz=q});

/* ---------- Cartes en plus pour les enfants et les ados ---------- */
EXTRA.pocket.deck.choice.push(
 {e:'📺',t:'La pub à la télé',pl:'toys',q:'Une pub montre un drone jouet « qui vole tout seul » à 30 €.',o:[
   {t:'Je regarde des avis et des vidéos de vrais enfants',ok:1,f:'Les pubs montrent les jouets sous leur meilleur jour. Les avis disent souvent la vérité !'},
   {t:'Je le veux tout de suite !',fx:{joy:-2},ok:0,f:'Dans la vraie vie, il vole… 10 secondes. Déception !'}]},
 {e:'🐶',t:'Le chien de la voisine',pl:'home',q:'Ta voisine part en week-end et cherche quelqu’un pour promener son chien.',o:[
   {t:'Je propose de le faire pour 8 €',fx:{money:8,joy:4},ok:1,f:'Rendre service ET gagner de l’argent : ton premier petit job 🐕'},
   {t:'Je le fais gratuitement',fx:{joy:5},ok:null,f:'Très gentil ! Ta voisine t’offre des gâteaux en retour 🍪'}]},
 {e:'🎁',t:'Cadeau surprise',pl:'toys',q:'C’est bientôt l’anniversaire de ta maman.',o:[
   {t:'Je fabrique un cadeau moi-même',fx:{money:-2,cat:'achats',joy:6},ok:1,f:'Un cadeau fait main vaut de l’or pour celui qui le reçoit ❤️'},
   {t:'J’achète un bouquet à 15 €',fx:{money:-15,cat:'achats',joy:5},ok:null,f:'Joli, mais ça fait une grosse partie de ton argent de poche.'}]},
);
EXTRA.summer.deck.choice.push(
 {e:'📲',t:'Le code promo de l’influenceur',pl:'clothes',q:'Ton influenceur préféré fait la promo d’une crème « miracle » à 39 € avec un code promo.',o:[
   {t:'Je me rappelle qu’il est payé pour en parler',ok:1,f:'Un placement de produit, c’est de la pub : la mention « collaboration commerciale » est obligatoire.'},
   {t:'J’achète avec son code',fx:{money:-35,cat:'achats',joy:1},ok:0,f:'Le code fait surtout gagner de l’argent à l’influenceur…'}]},
 {e:'💰',t:'Les pourboires',pl:'resto',q:'Tu as gagné 60 € de pourboires cette semaine !',o:[
   {t:'Je les mets sur mon Livret Jeune',fx:{money:60,toSavings:60},ok:1,f:'Petit à petit, l’oiseau fait son nid 🐦'},
   {t:'Je les dépense ce week-end',fx:{money:60,joy:3},ok:null,f:'Bien mérité ! Mais pense à en garder un peu.'}]},
 {e:'🛵',t:'Le permis scooter',pl:'garage',q:'Avec ta paie, tu pourrais passer le permis AM (scooter) : 350 €.',o:[
   {t:'Je le passe, ça m’aidera à bouger',fx:{money:-350,cat:'transport',joy:5},ok:null,f:'Utile si tu habites loin de tout. Mais ensuite : assurance, essence, entretien…'},
   {t:'Je garde le vélo pour l’instant',ok:1,f:'Le vélo reste imbattable côté budget 🚲'}]},
);

/* ---------- Cartes liées au RÊVE du joueur ---------- */
const DREAM_CARDS={
 travel:{e:'✈️',t:'Ton rêve : voyager',pl:'travel',cond:G=>G.age>=16,q:'Un vol vers ta destination de rêve est à −40 % si tu réserves maintenant pour dans 6 mois : 320 €.',o:[
   {t:'Je réserve avec ma cagnotte voyage',need:320,fx:{pay:320,cat:'loisirs',joy:8},ok:1,f:'Réserver tôt coûte souvent beaucoup moins cher. Et tu l’avais épargné : zéro stress !'},
   {t:'Je crée une cagnotte « voyage » de 50 €',fx:{toSavings:50,joy:2},ok:1,f:'Une épargne avec un objectif précis, c’est bien plus motivant !'},
   {t:'Je paie avec ma carte, même à découvert',fx:{money:-320,cat:'loisirs',joy:6},ok:0,f:'Voyager à découvert, c’est payer tes vacances avec des agios…'}]},
 house:{e:'🏡',t:'Ton rêve : ta maison',pl:'agency',cond:G=>G.age>=18,q:'Ton banquier : « Pour acheter un jour, montrez que vous savez épargner chaque mois. »',o:[
   {t:'J’automatise 80 € par mois sur un livret',fx:G=>({autoSave:Math.max(G.autoSave||0,80),joy:2}),ok:1,f:'Une épargne régulière rassure la banque… et construit ton apport mois après mois.'},
   {t:'Je verrai quand j’aurai plus d’argent',ok:0,f:'« Plus tard » arrive rarement tout seul. Même 30 € par mois, c’est un début !'}]},
 car:{e:'🏎️',t:'Ton rêve : une super voiture',pl:'garage',cond:G=>G.age>=18,q:'Un salon auto te propose d’essayer ta voiture de rêve. Le vendeur : « Avec un crédit, elle est à vous demain ! »',o:[
   {t:'Je fais l’essai… et je garde mon plan d’épargne',fx:{joy:5},ok:1,f:'Rêver, oui ! S’endetter pour une voiture qui perd 20 % par an, non.'},
   {t:'Je signe le crédit',fx:{money:-450,cat:'transport',joy:6,debt:{t:'Crédit voiture de rêve',a:450}},ok:0,f:'450 € par mois pendant des années… pour une voiture qui perd de la valeur chaque jour.'}]},
 help:{e:'💝',t:'Ton rêve : aider les autres',pl:'post',cond:G=>G.age>=16,q:'Une association qui te tient à cœur lance un appel aux dons.',o:[
   {t:'Je donne 20 €',fx:{money:-20,cat:'autre',joy:6},ok:1,f:'Bon à savoir : 66 % d’un don à une association d’intérêt général est déductible de l’impôt sur le revenu (si tu en paies).'},
   {t:'Je donne 2 heures de bénévolat',fx:{joy:7},ok:1,f:'Ton temps, c’est aussi un super cadeau !'}]},
 business:{e:'🚀',t:'Ton rêve : créer ton entreprise',pl:'office',cond:G=>G.age>=16,q:'Tu as une idée : vendre tes créations en ligne. Lancer une petite boutique coûte 40 €.',o:[
   {t:'Je teste petit, avec 40 €',fx:G=>{if(Math.random()<.55){G._note='Tes premières ventes rapportent 120 € !';return{money:80,joy:6}}G._note='Pas encore de ventes… mais tu as beaucoup appris.';return{money:-40,cat:'autre',joy:2}},ok:1,f:'Tester petit avant d’investir gros : c’est la méthode des entrepreneurs malins.'},
   {t:'J’investis 2 000 € d’un coup dans du stock',fx:{pay:2000,cat:'autre',joy:-4},ok:0,f:'Sans avoir testé ton idée, c’est très risqué : le stock dort dans ton salon…'}]},
};
const kidDreamCard=()=>{const d=DREAMS[G.persona.dream];return{e:d.ic,t:'Ta tirelire à rêve',pl:'bank',cond:G=>G.age<16,q:`Pour « ${d.n.toLowerCase()} » un jour, tu peux commencer tout petit. Tu ouvres une tirelire spéciale rêve ?`,o:[
  {t:'Oui ! J’y mets 3 € tout de suite',fx:{toSavings:3,joy:3},ok:1,f:'Chaque euro rangé pour ton rêve est un pas vers lui 🌟'},
  {t:'Non, je préfère tout dépenser',ok:0,f:'Les rêves ont besoin d’un petit coup de pouce régulier !'}]}};

/* ---------- Les cartes d'un parcours (avec le rêve) ---------- */
cardsOf=function(type){
  const P=PAR[R.p],lv=LV();
  let L=[...(P.deck[type]||[]),...(P.noCommon?[]:(COMMON[type]||[]))];
  if(type==='choice'&&G.persona&&G.persona.dream){const dc=DREAM_CARDS[G.persona.dream];if(dc)L.push(dc);L.push(kidDreamCard())}
  return L.filter(c=>!c.lvl||(c.lvl===1?lv<=2:lv>=c.lvl));
};
/* Tirage : on préfère les cartes jamais vues */
drawCard=function(type){
  const L=cardsOf(type);G.seen=G.seen||{};
  const key=c=>(c.t||c.q||'').slice(0,40);
  for(let pass=0;pass<2;pass++){
    if(!R.decks[type]||!R.decks[type].length){const idx=shuffle(L.map((_,i)=>i));idx.sort((a,b)=>(G.seen[key(L[a])]?1:0)-(G.seen[key(L[b])]?1:0));R.decks[type]=idx.reverse()}
    while(R.decks[type].length){const i=R.decks[type].pop();if(L[i]&&(!L[i].cond||L[i].cond(G))){G.seen[key(L[i])]=1;return i}}
  }
  return 0;
};

/* ---------- Suivi des réponses → le jeu s'adapte ---------- */
const SKN={choice:'🤔 Décisions',quiz:'🧠 Quiz',shop:'🛍️ Envies d’achat',event:'⚡ Imprévus',mail:'📬 Courrier',sortie:'🎉 Sorties',luck:'🍀 Bonnes surprises',groc:'🛒 Courses',intro:'📖 Grands choix'};
function track(type,ok){
  if(ok==null||!R)return;G.skill=G.skill||{};const s=G.skill[type]||(G.skill[type]=[0,0]);s[1]++;if(ok===1)s[0]++;
  R.okT=(R.okT||0)+1;if(ok===1)R.okN=(R.okN||0)+1;
}
function weakSpot(){const sk=G.skill||{};let w=null;Object.entries(sk).forEach(([k,[a,b]])=>{if(b>=3&&SKN[k]){const r=a/b;if(r<.65&&(!w||r<w.r))w={k,r,a,b}}});return w}
function weights(){
  const lv=LV(),P=G.persona||{};const W={...WEIGHTS,event:WEIGHTS.event*[.7,1,1.4][lv-1],luck:WEIGHTS.luck*[1.4,1,.8][lv-1]};
  if(P.style==='spender')W.shop*=1.5;
  if(P.style==='saver'){W.choice*=1.2;W.luck*=.8}
  const sk=G.skill||{};Object.keys(W).forEach(k=>{const s=sk[k];if(s&&s[1]>=3&&s[0]/s[1]<.6)W[k]*=1.4});
  return W;
}
function adaptAfterRun(stats,stars,practice){
  if(!G.persona||practice||stats.tot<4)return;const r=stats.ok/stats.tot,P=G.persona;
  if(r>=.8&&stars===3&&P.level<3){P.level++;setTimeout(()=>toast(`🧠 Le jeu s’adapte : tu passes au niveau ${LVN[P.level]} !`,'pos'),3200)}
  else if(r<.45&&P.level>1){P.level--;setTimeout(()=>toast(`🧠 Le jeu s’adapte : niveau ${LVN[P.level]}, pour mieux apprendre.`),3200)}
}
