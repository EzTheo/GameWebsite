//Classes
class Webpage {
    //Webpage er en egendefinert class(blueprint) av en nettside man kan spesifisere selv.
    constructor({ header, theme, preview }) {
        //Constructor tar inn parametere blir satt inn i nettsiden man lager
        this.stylesheet = new CSSStyleSheet(); //Lager en ny css stylesheet ved bruk av new "class"
        document.adoptedStyleSheets.push(this.stylesheet);
        //Dytter inn det nylig lagde css stylesheet-et inn i documentet sitt "array" med stylesheets
        this.header = header; //En rekke med variabler/parametere som brukeren spesifiserer når de lager nettsiden
        this.preview = preview;
        this.theme = theme;
        this.links = [];
        this.dropped = false;
    }
    load() {
        //Dette er en metode(funskjon) som loader inn nettsiden man har spesifisert
        document.querySelector("body").classList.add(`${this.theme}`);
        //Gir bakgrunnen tema man satte for at bakgrunnsbildet skal passe
        if (this.header == "true") {
            //Dette kjører dersom brukeren ønsker en header på nettsiden
            this.stylesheet.addRule("body", `grid-template-rows: 100px 1fr`);
            //Bruker den nye stylesheet metoden til å endre på css direkte
            const header = createHTMLElement({
                //Bruker funskjonen på bunden til å lage et HTML element. Dette gjør jeg for å "sammensveise" koden litt
                type: "div", //Oppgir en rekke med parametere brukt i funskjonen for å lage elementet man ønsker
                id: "header",
                className: `${this.theme}`,
                parent: "body",
            });
            this.dropdown = createHTMLElement({
                type: "img",
                id: "dropdown",
                className: `${this.theme}`,
                parent: "#header",
            });
            this.dropdown.addEventListener("click", this.dropDown.bind(this));
            //Bind(this) er brukt slik at programmet bruker Webpage sin metode og ikke dropdown sin
            //Her gir jeg nettsiden sin dropdown knapp en event listener som kjører funskjonen dropDown
        }
        if (this.preview == "true") {
            //Dette lager preview dersom bruker ønsker. Dette er ikke spesifiserbart og vil bare lage hangman og gridgame previews
            this.stylesheet.addRule("body", `grid-template-columns: 1fr 1fr`);
            const preview1 = createHTMLElement({
                type: "div",
                id: "prev1",
                className: `${this.theme}`,
                parent: "body",
            });
            preview1.addEventListener("click", () => {
                window.location.href = "./spill/HangMan/html/HangMan.html";
                //Pil funskjon som legger til en link på preview bildet idet man trykker på den og sender deg dit
            });
            const preview2 = createHTMLElement({
                type: "div",
                id: "prev2",
                className: `${this.theme}`,
                parent: "body",
            });
            preview2.addEventListener("click", () => {
                window.location.href = "./spill/GridGame/html/GridGame.html";
            });
        }
        return this;
    }
    dropDown() {
        //Dropdown er metoden som lager linkene og dropdown menyen dersom man trykker på de 3 prikkene
        if (this.dropped == false) {
            this.dropdown.classList.add("active"); //Gir den en class som igjen endrer bildet på knappen
            const dropDownMenu = createHTMLElement({
                type: "table",
                className: `${this.dropdown.parentElement.className}`,
                id: "dropdown-menu",
                parent: "#header",
            });
            for (let i = 0; i < this.links.length; i++) {
                //Lager like mange liker som Array-en med linker bruker har spesifisert.
                //Dette gjøres med å først lage en ny table row og dermed sette inn en link.
                const newTr = createHTMLElement({
                    type: "tr",
                    id: `tr${i}`,
                    parent: "#dropdown-menu",
                });
                const newLink = createHTMLElement({
                    type: "a",
                    id: `a${i}`,
                    className: "link",
                    parent: `#tr${i}`,
                });
                //Destrukturert variabel som henter ut navnet og url ifra linken ifra Array med linker bruker har satt.
                const { name, url } = this.links[i];
                newLink.innerHTML = name;
                newLink.href = url;
            }
            this.dropped = true;
        } else if (this.dropped == true) {
            //Bare fjerner dropdown menyen dersom den allerede er trykket
            this.dropdown.classList.remove("active");
            document.querySelector("#dropdown-menu").remove();
            this.dropped = false;
        }
        return this;
    }
    addLink(name, url) {
        //Metoden dytter inn navn og url til en link inn i Array med linker som ble nevt tidligere.
        this.links.push({
            name,
            url,
        });
        return this;
    }
    removeLink(name) {
        //Metoden filtrerer ut alle linkene med et spesifikt navn og lager en ny liste uten den.
        this.links = this.links.filter(v => v.name != name);
        return this;
    }
}

//Class Elements
const homepage = new Webpage({ header: "true", theme: "light", preview: "true" }) //1
    .addLink("Hangman", "./spill/HangMan/html/HangMan.html") //2
    .addLink("GridGame", "./spill/GridGame/html/GridGame.html")
    .load(); //3
//Her er homepage, en nettside jeg har spesifisert selv ved bruk av class over.
//1. Her sier jeg om jeg ønsker de ulike elementene classen tilbyr eller ikke og velger farge tema.
//2. Her legger jeg til en link til dropdown menyen der argument 1 er navn og argument 2 er url.
//3. Her lages nettsiden ved å følge oppskriften den har blitt tildelt

//Functions
function createHTMLElement({ type, className, id, parent }) {
    const newElement = document.createElement(type);
    newElement.id = id;
    newElement.className = className;
    document.querySelector(parent).appendChild(newElement);
    return newElement; //Returnerer elementet som nettop ble laget slik at det kan brukes og endres på.
}
//Dette er funskjonen som lager html elementer på samme sted for å forhindre uoversiktlige blokker med kode.
