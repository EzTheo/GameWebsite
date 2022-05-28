const stylesheet = new CSSStyleSheet(); //Lager en ny CSS Stylesheet og fester det til variabelen "stylesheet"
document.adoptedStyleSheets.push(stylesheet); //Legger til det nylig lagde CSS Stylesheet-et til dokumentets liste med stylesheets den tar inn.
let started = false;
let colNum = 2; //En variabel programmet bruker senere til å bestemme antall kolonner i grid-en.
let rowNum = 1; //En variabel programmet bruker senere til å bestemme antall rader i grid-en.
let points = 0;
let time = 0;
let timer = false; //Dersom denne er True kjører timeren som reduserer tiden hvert sekund osv...
let dead = false; //Dersom denne er True stopper tilnærmet all koden. Med andre ord stopper spillet.
const highscore = window.localStorage.getItem("highscore") || 0; //Henter inn highscore fra localstorage. Finnes den ikke er den 0.

const matrix = new Array(rowNum).fill(0).map(() => new Array(colNum).fill(0));
//Lager et array fyllt med 0 som deretter byttes ut med nye arrays fyllt med 0. Dette blir et 2D array.
matrix[0][0] = 3; //setter [0][0] = 3, verdien til ghost (spøkelset) slik at den alltid starter på samme sted.
mapGeneration(); //Kjører funksjonen map generation.

setInterval(() => {
    //I et interval av 1000ms/1s sjekker den om tiden ikke er null og at timeren/spillet har startet og reduserer tiden med 1.
    if (time != 0 && timer == true) {
        time--;
        const nodeList = containerEl.querySelectorAll(".grid"); //(1/2) Setter alle html elementene i spillskjermen med ".grid" som id (alle rutene i spillet) inn i en liste.
        for (let i = 0; i < nodeList.length / 4; i++) {
            //(2/3) Deretter velger den tilfeldige ruten med antall=1/4 av alle rutene i spillet og øker verdien deres med 1 i matrix-en.
            // (3/3) Den gjør dette slik at når programmet looper over koden senere og skal plassere inn de riktige elementene, så vil "stagen" til rutene endre seg.
            const ran1 = Math.floor(Math.random() * matrix.length); //Velger en tilfelig y-verdi (tilfeldig array i 2D array-et).
            const ran2 = Math.floor(Math.random() * matrix[ran1].length); //Velger en tilfelig x-verdi (tilfeldig index i det tilfeldige array-et).
            switch (
                matrix[ran1][ran2] //Dette er en switch statement. En annen versjon av if-else statements som er mer optimal i dette tilfellet.
            ) {
                case 0:
                    matrix[ran1][ran2]++; //Samme som "if(verdien==0)->Gjør noe"
                    break;
                case 1:
                    matrix[ran1][ran2]++;
                    break;
                case 2:
                    matrix[ran1][ran2] = 0;
                    break;
            }
        }
        reloadContent(); //Dette er funksjonen som oppdaterer det visuelle. Kommer til det senere
    } else if (time == 0 && timer == true) {
        //Hvis spillet har startet og tiden = 0, så setter den dead til true (du stopper og taper spillet).
        timer = false;
        dead = true;
    }
}, 1000);

document.onkeydown = e => {
    //En arrow function som tar inn et "event" som i dette tilfellet er en tast brukeren trykker og fester den til parameteren "e".
    if (dead == false) {
        //Gjør bare noe dersom man ikke er død.
        e.preventDefault(); //Stopper siden i å scrolle nedover hvis man trykker space f.eks.
        if (e.keyCode == 32 && started == false) {
            //Space
            startGame(); //Kjører funksjonen startGame hvis man trykker på space.
        } else if (e.key.startsWith("Arrow") && started == true) {
            //Ser om knappen man trykket var en piltast og om spillet har startet.
            if (e.keyCode == 39) {
                //Right
                updateMatrix(
                    0,
                    1,
                    (x, y, m) => x + 2 <= m[y].length
                ); /*Det 3. parameteret også kalt "callback" er en callback function.
                parameteret sammen med de 2 andre blir sendt inn i "updateMatrix" som dermed tilkaller det 3. parameteret (funksjonen over).
                */
            } else if (e.keyCode == 37) {
                //Left
                updateMatrix(0, -1, x => x > 0);
            } else if (e.keyCode == 38) {
                //Up
                updateMatrix(-1, 0, (x, y) => y > 0);
            } else if (e.keyCode == 40) {
                //Down
                updateMatrix(1, 0, (x, y, m) => y + 2 <= m.length);
            }
            reloadContent();
        }
    }
};

function updateMatrix(dy, dx, callback) {
    //Kort sagt tar funksjonen annsvar for all logistikken etter "movement".
    for (let y = 0; y < matrix.length; y++)
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 3 && callback(x, y, matrix)) {
                //Forsetter hvis verdien er 3 (den har loopet frem til spøkelset) og koordinatene er i matrix
                if (matrix[y + dy][x + dx] == 4) {
                    //Hvis den nye posisjonen sin verdi=blob så setter den verdien til spøkelse og den gamle til ingenting.
                    matrix[y + dy][x + dx] = 3;
                    matrix[y][x] = 0;
                    points++; //Øker poeng siden man plukket opp en blob
                    timer = true; //starter timeren (har bare en effekt første gang)
                    time = Math.floor(points / 4 + 5); //Kalkulerer tiden man får for hvert "lvl"
                    if (points % 2 == 0) {
                        //Hvis poeng er et partall øker den 2D arrayet mot høyre
                        for (let y = 0; y < matrix.length; y++) {
                            matrix[y].push(0);
                        }
                        colNum++; //Denne bestemmer som sagt hvor lang mange kolonner grid skal ha. Den brukes som en variabel senere.
                    } else {
                        //Dersom poeng er et odde tall legger den til et nytt array i hoved array-et som vil øke det nedover
                        matrix.push(new Array(colNum).fill(0));
                        rowNum++;
                    }
                    stylesheet.addRule(
                        //Lager en ny css regel ser grid sin høyde og lengde blir spesifisert
                        ".container",
                        //Lager så mange rader den får plass til med bredde lik 100%/antall rader, slik at den samlede bredden blir like og fyller hele skjermen.
                        //Samme gjelder kolonnene
                        `grid-template-rows: repeat(auto-fill, ${
                            100 / rowNum
                        }vh);grid-template-columns: repeat(auto-fill, ${100 / colNum}vw)`
                    );
                    mapGeneration(); //Spawner den neste blob-en et tilfeldig sted
                } else if (matrix[y + dy][x + dx] == 2) {
                    //Hvis den nye verdien er 2, blir den satt til spøkelset og den gamle til null. Til slutt stopper den spillet
                    //Dette er fordi de hvite rutene har verdi 2 og dreper deg
                    matrix[y + dy][x + dx] = 3;
                    matrix[y][x] = 0;
                    dead = true;
                    timer = false;
                } else {
                    matrix[y + dy][x + dx] = 3; //Hvis det ikke er noe spesielt i den nye posisjonen så bare flytter karakteren seg dit
                    matrix[y][x] = 0;
                }
                return; //Her returnerer funksjonen ordrene tilbake til den andre funksjonen over som handler basert på de.
                //Dette består hovedsakelig av å bevege figuren.
            }
        }
}

const reloadContent = function () {
    //Her lages hele griden med elementer dersom spillet starter eller man kommer til neste lvl
    pointCounter.textContent = points; //Setter points til riktig verdi
    timerEl.textContent = time; //Oppdaterer tiden
    containerEl.innerHTML = ""; //Fjerner alt inni containeren (der spillet tar plass)
    //Looper over begge dimensjoner med array
    for (let y = 0; y < matrix.length; y++)
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 3) {
                //Dersom verdien er spøkelse så lages det visuelle
                ghost = document.createElement("img"); //Lager et image element
                ghost.src = "../assets/Ghost.PNG"; //Setter source til bilde
                ghost.classList.add("ghost"); //Legger til en klasse
                switch (
                    dead //Hvis den kommer til spøkelset og man er død spiller den av death animation og sjekker for highscore
                ) {
                    case true:
                        saveHighScore();
                        ghost.style.animation = "fadeOut 2s 1";
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                        break;
                }
                containerEl.append(ghost); //Fester bildet til dokumentet
            } else if (matrix[y][x] == 4) {
                //Dersom verdien i matrix er 4 så lager den en blob på samme måte som spøkelset
                blob = document.createElement("div");
                blob.classList.add("blob");
                containerEl.append(blob);
            } else {
                //Hvis den ikke er en blob eller et spøkelse, så lager den en grid (tom rute)
                grid = document.createElement("div");
                grid.classList.add("grid");
                switch (matrix[y][x]) {
                    //Sjekker om verdien er 0, 1 eller 2.
                    case 0: //Er verdien f.eks 0, øker opacity til å passe med hvilken "stage" ruten er i.
                        grid.style.opacity = "0";
                        break;
                    case 1:
                        grid.style.opacity = "0.5";
                        break;
                    case 2:
                        grid.style.opacity = "1";
                        break;
                }
                containerEl.append(grid);
            }
        }
};

function mapGeneration() {
    //MapGeneration sørger for å spawne inn bloben på et tilfeldig sted i matrix
    for (;;) {
        //En loop som bare kan brytes fra innsiden. Med andre ord når den har gjort det den skal
        const y = Math.floor(Math.random() * matrix.length); //Tilfeldig y-verdi i matrix
        const x = Math.floor(Math.random() * matrix[y].length); //Tilfeldig x-verdi i matrix
        if (matrix[y][x] != 3) {
            //Tillater å plassere blob dersom det ikke er spøkelset sin posisjon. Da looper den på nytt
            matrix[y][x] = 4;
            return; //Siden den fikk plassert blob-en, bryter den loopen og fullfører funksjonen
        }
    }
}

document.querySelector(".startButton").addEventListener("click", e => {
    //Her settes en eventlistener på start knappen med en arrow function festet til eventet
    if (dead == false && started == false) {
        //Passer på at startGame() ikke kjører dersom man allerede har startet spillet
        startGame();
    }
});

const startGame = () => {
    //Henter inn alle HTML elementene allerede i dokumentet
    menuEl = document.querySelector(".menu");
    showcaseWindowEl = document.querySelector(".showcaseWindow");
    //Istedenfor å legge til en ny regel på et annet style sheet, legges det inn en direkte i det første.
    stylesheet.insertRule(
        //Bildet av karakteren i menyen er egentlig et "sprite sheet" eller en rekke med bilder satt sammen i ett langt et.
        //Her flytter bildet seg fra venstre til høyre ved bruk av keyframes
        `@keyframes sprite{
    to{background-position-x: -${
        showcaseWindowEl.getBoundingClientRect().width * 10 //Showcasewindow er boksen bildet er begrenset i.
        //Finner bredden av 1 bildet og ganger med antall bilder for å finne den totale lengden. Dette brukes for å bestemme hvor langt bildet skal flyttes
    }px;}}`,
        stylesheet.cssRules.length
    );
    showcaseWindowEl.style.animation = "sprite 2.1s steps(10) 1"; //Ettersom animasjonen er laget, blir den spilt av her. (anim, tid, antall hopp, repetisjoner av animasjon)
    //Det brukes "steps" slik at man ikke kan se overgangen mellom hvert bilde
    setTimeout(() => {
        //Dette kjører etter 2s (animasjonen er ferdig)
        menuEl.style.display = "none"; //Fjerner alt inni menyen
        stylesheet.addRule(
            //Legger til en css regel som lager grid-en med fast mengde hver gang spillet spillet starter
            ".container",
            `grid-template-rows: repeat(auto-fill, ${
                100 / rowNum
            }vh);grid-template-columns: repeat(auto-fill, ${100 / colNum}vw)`
        );
        containerEl = document.createElement("div"); //Følgende blokk med kode lager alle faste elementer på skjermen
        containerEl.classList.add("container");
        pointCounter = document.createElement("p");
        pointCounter.textContent = points;
        pointCounter.classList.add("pointCounter");
        timerEl = document.createElement("p");
        timerEl.classList.add("timer");
        highScoreEl = document.createElement("p");
        highScoreEl.classList.add("highScore");
        highScoreEl.textContent = highscore; //Henter inn highscore
        document.querySelector("body").append(containerEl, pointCounter, timerEl, highScoreEl); //Fester elementene til skjermen
        reloadContent(); //Kjører funksjonen for å lage alt inni grid
        started = true; //Forteller programmet at spillet har startet
    }, 2000);
};
const saveHighScore = () => {
    //Dette er funksjonen som lagrer highscore i localstorage
    if (points > highscore) {
        //Hvis poengene du fikk var mer enn de høyeste, lagres det
        window.localStorage.setItem("highscore", points);
    }
};
