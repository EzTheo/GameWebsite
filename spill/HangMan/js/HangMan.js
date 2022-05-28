const stylesheet = new CSSStyleSheet(); //Lager en ny CSS Stylesheet og fester det til variabelen "stylesheet"
document.adoptedStyleSheets.push(stylesheet); //Legger til det nylig lagde CSS Stylesheet-et til dokumentets liste med stylesheets den tar inn.
const buttonEl = document.querySelector("button");
document.querySelector("#confirm-word").addEventListener("click", startGame); //Legger til eventListener på de to knappene i menyen
document.querySelector("#random-word").addEventListener("click", startGame);
const Letters = []; //Tomt array som skal lagre alle bokstavene i ordet
const wordArray = ["Apple", "Lemon", "Banana", "Car", "Bike", "Horse", "Dog", "Cat"]; //Array med mulige ord dersom man velger tilfeldig ord modus
const correct = new Audio("../assets/correct.wav"); //Lager et nytt lyd objekt og tar inn linken til lyden
const wrong = new Audio("../assets/wrong.wav");
const gameover = new Audio("../assets/gameover.mp3");
const victory = new Audio("../assets/victory.mp3");

function createHTMLElement({ type, className, id, parent }) {
    //Funksjonen er brukt til å lage html elementer på ett og samme sted.
    //Funskjonen tar inn parametere som brukes til å utføre de ulike delene av å lage et element.
    const newElement = document.createElement(type);
    newElement.id = id;
    newElement.className = className;
    document.querySelector(parent).appendChild(newElement);
    return newElement; //Returnerer det nye elementet slik at den kan brukes senere.
}

function startGame(event) {
    const word = document.querySelector("input").value.toUpperCase();
    //Denne tar det brukeren har skrevet inn i input og gjør det om til store bokstaver.
    const randomWord = wordArray[Math.round(Math.random() * wordArray.length)].toUpperCase();
    //Tar inn en tilfeldig verdi ifra araray med ord og gjør det til store bokstaver
    if (word.length > 0 || event.target.id == "random-word") {
        //Sjekker om man har skrevet inn noe eller valgt tilfeldig ord før den går videre.
        document.querySelector(
            "#main"
        ).innerHTML = `<div id="header"><img id="title" src="../assets/HangMan.png"></img></div>`;
        //Lager header på nettsiden
        const secretInputEl = createHTMLElement({
            //Et usynlig input element som er det brukeren skriver inn bokstavene
            type: "input",
            id: "secretInput",
            parent: "#main",
        });
        secretInputEl.addEventListener("input", keypress);
        //Setter en event listener på input elementet
        secretInputEl.spellcheck = false;
        //Skrur av at det ser etter skrive feil. Dette for å unngå den rød streken som igjen vil gjøre feltet synlig
        const wrongLetters = createHTMLElement({
            //P element som viser bokstaver man tipper feil
            type: "p",
            id: "wrongLetters",
            parent: "#main",
        });
        const attempts = createHTMLElement({
            //Viser antall forsøk man har igjen
            type: "p",
            id: "attempts",
            parent: "#main",
        });
        const highscoreEl = createHTMLElement({
            //Viser highscore
            type: "p",
            id: "highscore",
            parent: "#main",
        });
        document.querySelector("#highscore").innerHTML += highscore;
        //Legger til highscore slik at det står ifra start
        const person = createHTMLElement({
            //Dette er personen som indikerer hvordan du ligger an i spillet
            type: "img",
            id: "person",
            parent: "#main",
        });
        document.querySelector("#person").src = "../assets/person0.png";
        //Setter bilde adresse
        const lineContainer = createHTMLElement({
            //Div element som holder alle strekene/bostavene
            type: "div",
            id: "line-container",
            parent: "#main",
        });
        switch (event.target.id) {
            //Event target vil være hvilken knapp som tilkalte funksjonen
            case "confirm-word": //Dersom den er confirm-word så kjører den koden for selvvalgt ord
                for (let i = 0; i < word.length; i++) {
                    Letters.push(word[i]); //Fyller inn array som holder bokstaver med bokstavene i ordet man valgte
                    const line = createHTMLElement({
                        //Lager en strek. Det blir laget like mange som lengden av orden ved bruk av for loop.
                        type: "div",
                        className: "line",
                        parent: "#line-container",
                    });
                    document.body.onclick = () => secretInputEl.focus();
                    //Dersom man trykker på skjermen vil skrive feltet alltid være i fokus.
                    //Det vil si at man kan skrive inn i det. Uten dette kan man trykke vekk ifra den og spillet stopper å fungere.
                }
                break;
            case "random-word": //Dersom knappen er random word så kjører den følgene kode.
                for (let i = 0; i < randomWord.length; i++) {
                    Letters.push(randomWord[i]); //Fyller inn array som holder bokstaver med bokstavene i det tilfeldig valgte ordet.
                    const line = createHTMLElement({
                        //Lager en strek. Det blir laget like mange ganger som antall bokstaver i ordet.
                        type: "div",
                        className: "line",
                        parent: "#line-container",
                    });
                    document.body.onclick = () => secretInputEl.focus();
                }
                break;
        }
    }
}

const highscore = window.localStorage.getItem("highscore") || 0;
//Henter inn highscore ifra local storage og setter den til varibelen "highscore". Derom den ikke har en verdi er den lik 0.
let tries = 10; //Definerer antall forsøk på å tippe ordet
const x = []; //En tom array som lagrer plass til riktige bokstaver i ordet
function keypress(e) {
    //e er tasten man trykket inn som også kjører funksjonen
    const nodeList = document.querySelectorAll(".line");
    //Lager en liste med alle strekene som objekter
    const char = e.target.value.toUpperCase();
    //Gjør bokstaven man skrev inn til stor variant
    console.log(char);
    if (Letters.includes(char)) {
        //Dersom array med bokstavene inneholder det man tippet:
        const Indices = []; //Tom array som lagrer alle indexene (plassene).
        let idx = Letters.indexOf(char); //Idx er posisjonen til bostaven man tippet i ordet.
        while (idx != -1) {
            //Dersom den eksistere i array med bokstaver:
            Indices.push(idx); //Dytter inn posisjonen til bokstaven man tippet riktig.
            nodeList[idx].innerHTML = char; //Legger til bokstaven på streken.
            correct.play(); //Spiller av lyd siden man tippet riktig
            if (!x.includes(idx)) {
                //Dersom man ikke har gjettet bokstaven før og den er riktig:
                x.push(idx); //Dytter inn bokstaven inn i array med feil bokstaver.
            }
            idx = Letters.indexOf(char, idx + 1);
            //Går videre i ordet for å lete etter en til av samme bokstav.
        }
        if (x.length >= Letters.length) {
            //Dersom man har gjettet alle bokstavene:
            document.querySelector("#main").innerHTML = "";
            //Fjerer alt på skjermen
            const popUp = createHTMLElement({
                //En div som virker som et pop up vindu
                type: "div",
                id: "popUp",
                className: "green",
                parent: "#main",
            });
            const message = createHTMLElement({
                //Holder meldingen som forteller resultatet av spillet
                type: "div",
                id: "message",
                parent: "#popUp",
            });
            message.innerHTML = "YOU WON!"; //Setter meldingen som vises til at man vant
            stylesheet.addRule(
                //Lager en ny css regel som setter inn det riktige bildet av personen.
                //Viser altså hvor "bra" man gjorde det.
                "#popup",
                `background-image: url("../assets/person${10 - tries}.png");`
            );
            victory.play(); //Spiller seier lyden
            if (tries > highscore) {
                //Dersom man hadde flere forsøk igjen enn rekorden:
                window.localStorage.setItem("highscore", tries);
                //Lagrer antall forsøk som highscore i local storage
            }
            const restart = createHTMLElement({
                //Restart knappen
                type: "div",
                id: "restart",
                parent: "#popUp",
            });
            restart.addEventListener("click", () => {
                location.reload();
            });
            //Kjører en pil funksjon dersom man trykker på knappen. Dette vil reloade siden automatisk
            restart.innerHTML = "RESTART";
        }
    } else if (
        //Dersom man gjetter feil bokstav::
        !Letters.includes(char) &&
        !document.querySelector("#wrongLetters").innerHTML.includes(char)
    ) {
        tries--; //Fjerner et forsøk
        document.querySelector("#attempts").innerHTML = tries; //Oppdaterer antall forsøk teksten
        document.querySelector("#wrongLetters").innerHTML += ` ${char},`; //Setter inn den feil bokstaven inn i teksten.
        document.querySelector("#person").src = `../assets/person${10 - tries}.png`; //Endrer til neste bildet på personen.
        wrong.play();
        if (tries <= 0) {
            //Dersom man ikke har flere forsøk:
            document.querySelector("#main").innerHTML = "";
            const popUp = createHTMLElement({
                //Lager en pop up
                type: "div",
                id: "popUp",
                className: "red",
                parent: "#main",
            });
            const message = createHTMLElement({
                //Lager melding beholderen
                type: "div",
                id: "message",
                parent: "#popUp",
            });
            message.innerHTML = "YOU LOST!"; //Setter inn meldingen
            stylesheet.addRule(
                "#popup",
                `background-image: url("../assets/person${10 - tries}.png");`
            );
            gameover.play();
            const restart = createHTMLElement({
                type: "div",
                id: "restart",
                parent: "#popUp",
            });
            restart.addEventListener("click", () => {
                location.reload();
            });
            restart.innerHTML = "RESTART";
        }
    }
    e.target.value = ""; //Resetter bokstaven man trykket på slik at alt kan kjøre på nytt.
}
