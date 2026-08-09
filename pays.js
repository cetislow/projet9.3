const	sortie	=	document.querySelector("#sortie");
const	etatVide	=	document.querySelector("#etat-vide");
let	tousLesPays	=	[];
//	---	Affiche	des	squelettes	pendant	le	chargement	--
function	afficherSquelettes(nombre	=	8)	{
sortie.innerHTML	=	Array.from({	length:	nombre	},	()	=>	`<div	class="squelette"></div>`).join("");
}
//	---	Récupération	initiale	--
async	function	chargerPays()	{
afficherSquelettes();
try	{
const	champs	=	"name,capital,population,region,languages,flags";
const	reponseAPI	=	await	fetch(`https://restcountries.com/v3.1/all?fields=${champs}`);
if	(!reponseAPI.ok)	throw	new	Error("Statut	HTTP	"	+	reponseAPI.status);
tousLesPays	=	await	reponseAPI.json();
afficherPays(tousLesPays);
}	catch	(erreur)	{
console.error("Erreur	API	pays	:",	erreur);
sortie.innerHTML	=	`<p	class="etat-vide">Erreur	de	chargement.	Réessayez	plus	tard.</p>`;
}
}
//	---	Carte	d'un	pays	--
function	cartePays(pays)	{
const	langues	=	pays.languages	?	Object.values(pays.languages).join(",	")	:	"N/D";
return	`
<article	class="carte-pays">
<img	class="drapeau"	src="${pays.flags.png}"	alt="Drapeau	de	${pays.name.common}"	loading="lazy">
<div	class="contenu-carte">
<h3>${pays.name.common}</h3>
<p>Capitale	:	${pays.capital	?	pays.capital[0]	:	"N/D"}</p>
<p>Population	:	${pays.population.toLocaleString()}</p>
<p>Région	:	${pays.region}</p>
<p>Langues	:	${langues}</p>
</div>
</article>
`;
}
function	afficherPays(liste)	{
etatVide.hidden	=	liste.length	>	0;
sortie.innerHTML	=	liste.map(cartePays).join("");
}
//	---	Recherche	+	filtre	continent	+	tri,	combinés	--
function	appliquerFiltres()	{
const	motCle	=	document.querySelector("#champ-recherche").value.toLowerCase();
const	continent	=	document.querySelector("#select-continent").value;
const	critereTri	=	document.querySelector("#select-tri").value;
let	resultat	=	tousLesPays.filter(p	=>	p.name.common.toLowerCase().includes(motCle));
if	(continent	!==	"tous")	{
resultat	=	resultat.filter(p	=>	p.region	===	continent);
}
resultat	=	[...resultat].sort((a,	b)	=>
critereTri	===	"population"
?	b.population	-	a.population
:	a.name.common.localeCompare(b.name.common)
);
afficherPays(resultat);
}
document.querySelector("#champ-recherche").addEventListener("input",	appliquerFiltres);
document.querySelector("#select-continent").addEventListener("change",	appliquerFiltres);
document.querySelector("#select-tri").addEventListener("change",	appliquerFiltres);
chargerPays();