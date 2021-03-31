import data from './data.js';
import Mustache from 'mustache';
import Chart from 'chart.js';
import footer from '../templates/footer.txt'
import intro from '../templates/intro.txt'

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const startDate = new Date(Date.parse(data.startDay));
console.log(startDate);
const vaccinesPerDay = data.vaccinesPerDay;
const population = data.population;
const accumulator = (acc, current) => acc + current;
const totalVaccines = vaccinesPerDay.reduce(accumulator);
const percentageOfPeopleVaccinated = (totalVaccines / population) * 100;
const sevenDayTotal = vaccinesPerDay.slice(vaccinesPerDay.length - 7, vaccinesPerDay.length).reduce(accumulator)
const sevenDayAverage = sevenDayTotal / 7
const sufficientVaccinationNumber = population * 0.7
const additionalRequiredVaccinations = sufficientVaccinationNumber - totalVaccines
const daysUntilRequiredVaccinationsReached = additionalRequiredVaccinations / sevenDayAverage
const daysUntilSecondVaccinationsReached = daysUntilRequiredVaccinationsReached + 12 * 7
const dateFirsVaccinationsReached = new Date(Date.now()).addDays(daysUntilRequiredVaccinationsReached).toLocaleDateString("de")
const dateSecondVaccinationsReached = new Date(Date.now()).addDays(daysUntilSecondVaccinationsReached).toLocaleDateString("de")

const introView = {
    sevenDayAverage: Math.round(sevenDayAverage).toLocaleString("de"),
    daysUntilSecondVaccinationsReached: Math.floor(daysUntilSecondVaccinationsReached),
    totalVaccines: totalVaccines.toLocaleString("de"),
    percentageOfPeopleVaccinated: percentageOfPeopleVaccinated.toLocaleString("de"),
    dateSecondVaccinationsReached,
    daysUntilRequiredVaccinationsReached: Math.floor(daysUntilRequiredVaccinationsReached).toLocaleString("de"),
    dateFirsVaccinationsReached,
    twelveWeeks: 12 * 7
}

const footerView = {
    lastUpdate: data.lastUpdate
}

function renderTemplate(template, targetId, object) {

            var rendered = Mustache.render(template, object);
            document.getElementById(targetId).innerHTML = rendered;
}

renderTemplate(intro, 'intro', introView);
renderTemplate(footer, 'footer', footerView);

// const context = document.getElementById('daily-vaccines-chart')
//    .getContext('2d')

const getSevenDayAverage = (value, index, array) => {
    const start = Math.max(0, index - 7)
    return array.slice(start, index + 1).reduce(accumulator) / (index + 1 - start)
}

const accumUntil = (value, index, array) => {
    return array.slice(0, index+1).reduce(accumulator)
}

var context = document.getElementById('chart');
const vaccinesChart = new Chart(context, {
    type: 'line',
    responsive: 'true',
    data: {
        labels: data.vaccinesPerDay.map(((value, index) => startDate.addDays(index).toLocaleDateString("de"))),
        datasets: [{
            data: data.vaccinesPerDay,
            label: 'Impfungen pro tag',
            borderColor: 'rgba(234,191,191,0.45)',
            backgroundColor: '#EABFBF72'
        },
            {
                data: data.vaccinesPerDay.map(getSevenDayAverage),
                label: 'Sieben-Tages-Schnitt',
                fill: false,
                borderColor: 'rgba(191,231,231,0.53)',
                cubicInterpolationMode: 'monotone'
            }]
    }
})
const cumulativeContext = document.getElementById('cumulative-chart')


const totalChart = new Chart(cumulativeContext, {
    type: 'line',
    data: {
        labels: data.vaccinesPerDay.map(((value, index) => startDate.addDays(index).toLocaleDateString("de"))),
        datasets: [{
            data: data.vaccinesPerDay.map(accumUntil),
            label: 'Impfdosen verabreicht',
            borderColor: 'rgba(234,191,191,0.45)',
            backgroundColor: '#EABFBF72'
        },
            {
                data: data.vaccinesPerDay.map(value => sufficientVaccinationNumber),
                borderColor: 'rgba(191,231,231,0.53)',
                label:'Herendimmunität erreicht',
                fill: false
            }]
    }
})
