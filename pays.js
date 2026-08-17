// ========================================
// CONFIGURATION
// ========================================

const API_URL ="https://api.restcountries.com/countries/v5/codes.alpha_2/CA?pretty=1";

const API_KEY = "Bearer rc_live_demo";


// ========================================
// ÉLÉMENTS HTML
// ========================================

const grillePays = document.querySelector("#pays");

const recherche = document.querySelector("#recherche");

const continent = document.querySelector("#continent");

const tri = document.querySelector("#tri");

const chargement = document.querySelector("#chargement");

const etatVide = document.querySelector("#etat-vide");

const erreur = document.querySelector("#erreur");

const nombrePays = document.querySelector("#nombre-pays");


// ========================================
// DONNÉES
// ========================================

let pays = [];


// ========================================
// RÉCUPÉRER LES PAYS
// ========================================

async function recupererPays() {

    try {

        // Afficher le chargement
        chargement.hidden = false;

        erreur.hidden = true;

        etatVide.hidden = true;

        grillePays.innerHTML = "";


        // Requête API
        const response = await fetch(API_URL, {

            headers: {
                "Authorization": `Bearer ${API_KEY}`
            }

        });


        // Vérifier la réponse
        if (!response.ok) {

            throw new Error(
                `Erreur HTTP : ${response.status}`
            );

        }


        // Convertir en JSON
        const data = await response.json();


        console.log("Réponse API :", data);


        // La v5 place les résultats dans data.objects
        pays = data.data.objects;


        console.log("Pays :", pays);


        // Afficher les pays
        afficherPays(pays);


    } catch (error) {

        console.error(
            "Erreur lors de la récupération :",
            error
        );


        // Cacher le chargement
        chargement.hidden = true;


        // Afficher l'erreur
        erreur.hidden = false;


        nombrePays.textContent =
            "Impossible de charger les pays.";

    }

}


// ========================================
// AFFICHER LES PAYS
// ========================================

function afficherPays(listePays) {

    // Cacher le chargement
    chargement.hidden = true;


    // Vider la grille
    grillePays.innerHTML = "";


    // Aucun résultat
    if (listePays.length === 0) {

        etatVide.hidden = false;

        nombrePays.textContent =
            "0 pays trouvé";

        return;
    }


    // Cacher l'état vide
    etatVide.hidden = true;


    // Nombre de résultats
    nombrePays.textContent =
        `${listePays.length} pays trouvé(s)`;


    // ========================================
    // MAP()
    // ========================================

    const cartes = listePays.map(function (pays) {


        // -----------------------------
        // NOM
        // -----------------------------

        const nom =
            pays.names?.common ||
            "Nom inconnu";


        // -----------------------------
        // DRAPEAU
        // -----------------------------

        const drapeau =
            pays.flag?.svg ||
            pays.flag?.png ||
            "";


        // -----------------------------
        // CAPITALE
        // -----------------------------

        const capitale =
            pays.capitals?.[0] ||
            "Aucune";


        // -----------------------------
        // POPULATION
        // -----------------------------

        const population =
            pays.population ?? 0;


        // -----------------------------
        // RÉGION
        // -----------------------------

        const region =
            pays.region ||
            "Inconnue";


        // -----------------------------
        // LANGUES
        // -----------------------------

        let langues = "Non renseignées";


        if (pays.languages) {

            langues =
                Object.values(pays.languages)
                    .join(", ");

        }


        // -----------------------------
        // CARTE HTML
        // -----------------------------

        return `

            <article class="carte-pays">

                <img
                    class="drapeau"
                    src="${drapeau}"
                    alt="Drapeau de ${nom}"
                >

                <div class="contenu-carte">

                    <h2>
                        ${nom}
                    </h2>

                    <div class="information-pays">

                        <p>
                            <strong>
                                Capitale :
                            </strong>

                            ${capitale}
                        </p>


                        <p>
                            <strong>
                                Population :
                            </strong>

                            ${population.toLocaleString("fr-FR")}
                        </p>


                        <p>
                            <strong>
                                Région :
                            </strong>

                            ${region}
                        </p>


                        <p>
                            <strong>
                                Langues :
                            </strong>

                            ${langues}
                        </p>

                    </div>

                </div>

            </article>

        `;

    });


    // Ajouter toutes les cartes
    grillePays.innerHTML =
        cartes.join("");

}


// ========================================
// FILTRER ET TRIER
// ========================================

function filtrerEtTrier() {


    // Faire une copie
    let resultat = [...pays];


    // ========================================
    // RECHERCHE
    // ========================================

    const texteRecherche =
        recherche.value
            .trim()
            .toLowerCase();


    if (texteRecherche !== "") {

        resultat = resultat.filter(
            function (pays) {

                const nom =
                    pays.names?.common ||
                    "";

                return nom
                    .toLowerCase()
                    .includes(texteRecherche);

            }
        );

    }


    // ========================================
    // FILTRE CONTINENT
    // ========================================

    const continentChoisi =
        continent.value;


    if (continentChoisi !== "tous") {

        resultat = resultat.filter(
            function (pays) {

                return pays.region === continentChoisi;

            }
        );

    }


    // ========================================
    // TRI
    // ========================================

    if (tri.value === "croissant") {

        resultat.sort(
            function (a, b) {

                return (
                    (a.population || 0) -
                    (b.population || 0)
                );

            }
        );

    }


    if (tri.value === "decroissant") {

        resultat.sort(
            function (a, b) {

                return (
                    (b.population || 0) -
                    (a.population || 0)
                );

            }
        );

    }


    // Afficher les résultats
    afficherPays(resultat);

}


// ========================================
// ÉVÉNEMENTS
// ========================================

recherche.addEventListener(
    "input",
    filtrerEtTrier
);


continent.addEventListener(
    "change",
    filtrerEtTrier
);


tri.addEventListener(
    "change",
    filtrerEtTrier
);


// ========================================
// LANCEMENT
// ========================================

recupererPays();