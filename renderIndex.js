import data from './src/data.js';
import Mustache from 'mustache';
import fs from 'fs';



Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const startDate = new Date(Date.parse(data.startDate));
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
    twelveWeeks: 12 * 7,
    lastUpdate: new Date(Date.parse(data.lastUpdate)).addDays(1).toLocaleDateString("de")
}

fs.readFile('./index.mustache', (err, index) => {
    if(err)
        throw err;
    const rendered = Mustache.render(index.toString(), introView)
    fs.writeFile('index.html', rendered, (err) => {
        if(err)
            throw err;
    })
})
