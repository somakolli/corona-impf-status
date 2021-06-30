import data from './data.js';
import {
    Chart,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement, LineElement, Filler, Title, Tooltip, Legend
} from 'chart.js';

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function parseDate(stringDate) {
    const dateArray = stringDate.split('.');
    console.log(dateArray);
    let date = new Date();
    date.setDate(Number.parseInt(dateArray[0]));
    date.setMonth(Number.parseInt(dateArray[1]));
    date.setFullYear(Number.parseInt(dateArray[2]));
    return date;
}

const startDate = parseDate(data.startDate);
console.log(startDate)
console.log(data.lastUpdate)
const population = data.population;
const accumulator = (acc, current) => acc + current;
const sufficientVaccinationNumber = population * 0.7

const getSevenDayAverage = (value, index, array) => {
    const start = Math.max(0, index - 6)
    return array.slice(start, index + 1).reduce(accumulator) / (index + 1 - start)
}

const accumUntil = (value, index, array) => {
    return array.slice(0, index + 1).reduce(accumulator)
}
Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

function render() {
    var context = document.getElementById('chart');
    const vaccinesChart = new Chart(context, {
        type: 'line',
        responsive: true,
        data: {
            labels: data.vaccinesPerDay.map(((value, index) => startDate.addDays(index).toLocaleDateString("de"))),
            datasets: [{
                data: data.vaccinesPerDay,
                label: 'Impfungen am tag',
                borderColor: 'rgba(234,191,191,0.45)',
                backgroundColor: '#EABFBF72',
                fill: true
            },
                {
                    data: data.vaccinesPerDay.map(getSevenDayAverage),
                    label: 'Sieben-Tages-Schnitt',
                    fill: false,
                    borderColor: 'rgba(191,231,231,0.53)',
                }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            locale: 'de'
        }
    })
    const cumulativeContext = document.getElementById('cumulative-chart')


    const totalChart = new Chart(cumulativeContext, {
        type: 'line',
        responsive: true,
        data: {
            labels: data.vaccinesPerDay.map(((value, index) => startDate.addDays(index).toLocaleDateString("de"))),
            datasets: [
                {
                    data: data.vaccinesPerDay.map(accumUntil),
                    label: 'Erstimpfungen verabreicht',
                    borderColor: 'rgba(234,191,191,0.45)',
                    backgroundColor: '#EABFBF72',
                    fill: true
                },
                {
                    data: data.secondVaccinesPerDay.map(accumUntil),
                    label: 'Vollständig geimpft',
                    borderColor: 'rgba(181,236,198,0.75)',
                    backgroundColor: 'rgba(181,236,198,0.75)',
                    fill: true
                },
                {
                    data: data.vaccinesPerDay.map(value => sufficientVaccinationNumber),
                    borderColor: 'rgba(191,231,231,0.53)',
                    label: 'Herdenimmunität',
                    fill: false
                }]
        },
        options: {
            responsive: true,
            plugins:
                {
                    legend: {
                        position: 'bottom'
                    }
                },
            locale: 'de'
        }
    })
}

render()
