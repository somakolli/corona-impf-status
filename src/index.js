import data from './data.js';
import Mustache from 'mustache';
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const vaccinesPerDay = data.vaccinesPerDay;
const population = data.population;
const accumulator = (acc, current) => acc + current;
const totalVaccines = vaccinesPerDay.reduce(accumulator);
const percentageOfPeopleVaccinated = population / totalVaccines
const sevenDayTotal = vaccinesPerDay.slice(vaccinesPerDay.length - 7, vaccinesPerDay.length).reduce(accumulator)
const sevenDayAverage = sevenDayTotal / 7
const sufficientVaccinationNumber = population * 0.7
const additionalRequiredVaccinations = sufficientVaccinationNumber - totalVaccines
const daysUntilRequiredVaccinationsReached = additionalRequiredVaccinations / sevenDayAverage
const daysUntilSecondVaccinationsReached = daysUntilRequiredVaccinationsReached + 12 * 7
const dateFirsVaccinationsReached = new Date(Date.now()).addDays(daysUntilRequiredVaccinationsReached).toLocaleDateString("de")
const dateSecondVaccinationsReached = new Date(Date.now()).addDays(daysUntilSecondVaccinationsReached).toLocaleDateString("de")

const Counter = {
    data() {
        return {
            counter: 1,
            totalVaccines,
            sevenDayTotal,
            sevenDayAverage,
            percentageOfPeopleVaccinated,
            sufficientVaccinationNumber,
            additionalRequiredVaccinations,
            daysUntilRequiredVaccinationsReached,
            daysUntilSecondVaccinationsReached,
            dateSecondVaccinationsReached,
            dateFirsVaccinationsReached,
            lastUpdate: data.lastUpdate
        }
    }
}

const introView = {
    sevenDayAverage: Math.round(sevenDayAverage).toLocaleString("de"),
    daysUntilSecondVaccinationsReached: Math.floor(daysUntilSecondVaccinationsReached),
    totalVaccines: totalVaccines.toLocaleString("de"),
    percentageOfPeopleVaccinated: percentageOfPeopleVaccinated.toLocaleString("de"),
    dateSecondVaccinationsReached,
    daysUntilRequiredVaccinationsReached: Math.floor(daysUntilRequiredVaccinationsReached).toLocaleString("de"),
    twelveWeeks: 12 * 7
}

const footerView = {
    lastUpdate: data.lastUpdate
}

function renderTemplate(templateName, targetId, object) {
    fetch(templateName)
        .then((response) => response.text())
        .then((template) => {
            var rendered = Mustache.render(template, object);
            console.log(rendered)
            document.getElementById(targetId).innerHTML = rendered;
        });
}
renderTemplate('intro.mustache', 'intro', introView)
renderTemplate('footer.mustache', 'footer', footerView)

