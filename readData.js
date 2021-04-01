import XLSX from 'xlsx'
import data from './src/data.js'
import fs from 'fs'

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
data.vaccinesPerDay = data.vaccinesPerDay.slice(0, data.vaccinesPerDay.length - 3)

data.secondVaccinesPerDay = daily.map(value => value.Zweitimpfung).filter(value => value)
data.secondVaccinesPerDay = data.secondVaccinesPerDay.slice(0, data.secondVaccinesPerDay.length - 3)

const startDate = daily[0].Datum;
const lastUpdate = daily.filter(value => typeof value.Datum.getMonth === 'function').pop().Datum

data.startDate = startDate;
data.lastUpdate = lastUpdate;

const stringToWrite = 'export default ' + JSON.stringify(data)
fs.writeFile('./src/data.js', stringToWrite, (err)=> {
    if(err)
        throw err;
})
