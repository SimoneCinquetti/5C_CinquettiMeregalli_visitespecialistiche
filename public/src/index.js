import {createMiddleware} from "./scripts/middleware.js";
import {generateReservationForm} from "./scripts/modalFormComponent.js";
import {generateButtonComponent} from "./scripts/listOfButtonsComponent.js";
import {generateTable} from "./scripts/tableComponent.js";
import {generateNavbar} from "./scripts/navbarComponent.js";


const modalBody = document.getElementById("modalBody");
const navbarContainer = document.getElementById("navbarContainer");
const tableContainer = document.getElementById("tableContainer");
const prevButtonContainer = document.getElementById("prevButtonContainer");
const nextButtonContainer = document.getElementById("nextButtonContainer");
const spinner = document.getElementById("spinner");

let confFileContent;
const hours = [8, 9, 10, 11, 12];
const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];

const componenteFetch = createMiddleware() ;
const componentTable = generateTable(tableContainer);
const reservationForm = generateReservationForm(modalBody);
const navbar = generateNavbar(navbarContainer);
const prevButton = generateButtonComponent(prevButtonContainer) ;
const nextButton = generateButtonComponent(nextButtonContainer) ;

componenteFetch.loadType()
.then(data => {
    confFileContent = data.map(e=>e.name);
console.log(confFileContent);

    navbar.build(confFileContent);
    navbar.render();
    navbar.onclick(category => {
        reservationForm.setType(category);
        spinner.classList.remove("d-none");
        componenteFetch.getData("clinica").then((r) => {
            spinner.classList.add("d-none");
            componentTable.setData(r ,category)
            componentTable.render();
        });
    });
    reservationForm.setType(navbar.getCurrentCategory());
    
    componentTable.build(hours, days);
    spinner.classList.remove("d-none");
    componenteFetch.load().then(data => {
        spinner.classList.add("d-none");
        componentTable.setData(data, navbar.getCurrentCategory());
        componentTable.render();
    });

    reservationForm.build(hours);
    reservationForm.render();
    reservationForm.onsubmit(r => {
        console.log(r);
        if (componentTable.add(r)) {
            reservationForm.setStatus(true);
            componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());
            componenteFetch.add(r).then(r => console.log(r));
        }
        else {
            reservationForm.setStatus(false);
        }
    });
    reservationForm.oncancel(() => componentTable.render());

    prevButton.build('Settimana precedente') ;
    nextButton.build('Settimana\nsuccessiva') ;

    prevButton.render() ;
    prevButton.onsubmit(() => {
        componentTable.previous();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());  
        componentTable.render();
    }) ;

    nextButton.render() ;
    nextButton.onsubmit(() => {
        componentTable.next();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());  
        componentTable.render();
    }) ;

    setInterval(() => {
        reservationForm.setType(navbar.getCurrentCategory());
        spinner.classList.remove("d-none");
        componenteFetch.getData("clinica").then((r) => {
            spinner.classList.add("d-none");
            componentTable.setData(r ,navbar.getCurrentCategory())
            componentTable.render();
        });
    }, 300000);
});