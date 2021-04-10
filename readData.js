import XLSX from 'xlsx'
import fs from 'fs'

const data = {}

const impfquoten = XLSX.readFile('data.xlsx', {cellDates: true})
const sheet_name_list = impfquoten.SheetNames;
const daily = XLSX.utils.sheet_to_json(impfquoten.Sheets['Impfungen_proTag'])
/*
Daily Json Structure
[{
    Datum: 'Gesamt',
    Erstimpfung: 9627222,
    Zweitimpfung: 4152414,
    'Gesamtzahl verabreichter Impfstoffdosen': 13779636
}, ...]
 */

data.vaccinesPerDay = daily.map(value => value.Erstimpfung).filter(value => value)
data.vaccinesPerDay = data.vaccinesPerDay.slice(0, data.vaccinesPerDay.length - 1)

data.secondVaccinesPerDay = daily.map(value => value.Zweitimpfung).filter(value => value)
data.secondVaccinesPerDay = data.secondVaccinesPerDay.slice(0, data.secondVaccinesPerDay.length - 3)

const startDate = daily[0].Datum;

data.startDate = startDate;
data.lastUpdate = new Date(Date.now());
data.population = 83985588;

const stringToWrite = 'export default ' + JSON.stringify(data)
fs.writeFile('./src/data.js', stringToWrite, (err)=> {
    if(err)
        throw err;
})
