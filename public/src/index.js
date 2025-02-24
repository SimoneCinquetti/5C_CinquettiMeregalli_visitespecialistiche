import { createMiddleware } from "./scripts/middleware.js";
import { generateReservationForm } from "./scripts/modalFormComponent.js";
import { generateButtonComponent } from "./scripts/listOfButtonsComponent.js";
import { generateTable } from "./scripts/tableComponent.js";
import { generateNavbar } from "./scripts/navbarComponent.js";

const modalBody = document.getElementById("modalBody");
const navbarContainer = document.getElementById("navbarContainer");
const tableContainer = document.getElementById("tableContainer");
const prevButtonContainer = document.getElementById("prevButtonContainer");
const nextButtonContainer = document.getElementById("nextButtonContainer");
const spinner = document.getElementById("spinner");

let confFileContent;
const hours = [8, 9, 10, 11, 12];
const days = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];

const componenteFetch = createMiddleware();
const componentTable = generateTable(tableContainer);
const reservationForm = generateReservationForm(modalBody);
const navbar = generateNavbar(navbarContainer);
const prevButton = generateButtonComponent(prevButtonContainer);
const nextButton = generateButtonComponent(nextButtonContainer);
let categories;

(async () => {
    categories = await componenteFetch.loadType();
    confFileContent = categories.map(e => e.name);

    navbar.build(confFileContent);
    navbar.render();

    navbar.onclick(async (category) => {
        reservationForm.setType(category);
        spinner.classList.remove("d-none");
        const r = await componenteFetch.load();
        spinner.classList.add("d-none");
        componentTable.setData(r, category);
        componentTable.render();
    });

    reservationForm.setType(navbar.getCurrentCategory());

    componentTable.build(hours, days,categories);
    spinner.classList.remove("d-none");

    const data = await componenteFetch.load();
    spinner.classList.add("d-none");
    componentTable.setData(data, navbar.getCurrentCategory());
    componentTable.render();

    reservationForm.build(hours, categories);
    reservationForm.render();

    reservationForm.onsubmit(async (r) => {
        if (componentTable.add()) {
            reservationForm.setStatus(true);
            console.log(await componenteFetch.add(r));
            componentTable.setData(await componenteFetch.load(), navbar.getCurrentCategory());
            componentTable.render()
        } else {
            reservationForm.setStatus(false);
        }
    });

    reservationForm.oncancel(() => componentTable.render());

    prevButton.build('Settimana precedente');
    nextButton.build('Settimana successiva');

    prevButton.render();
    prevButton.onsubmit(() => {
        componentTable.previous();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());
        componentTable.render();
    });

    nextButton.render();
    nextButton.onsubmit(() => {
        componentTable.next();
        componentTable.setData(componentTable.getData(), navbar.getCurrentCategory());
        componentTable.render();
    });

    setInterval(async () => {
        reservationForm.setType(navbar.getCurrentCategory());
        spinner.classList.remove("d-none");
        const r = await componenteFetch.load();
        spinner.classList.add("d-none");
        componentTable.setData(r, navbar.getCurrentCategory());
        componentTable.render();
    }, 120000); //ogni 2 minuti
})();
