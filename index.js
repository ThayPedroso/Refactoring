const fs = require('fs')

const statementData = require('./createStatementData')

const readPlays = JSON.parse(fs.readFileSync('./plays.json'))
const readInvoices = JSON.parse(fs.readFileSync('./invoices.json'))

function statement (invoice, plays) {
    return renderPlainText(statementData.createStatementData(invoice, plays))
}
function renderPlainText (data) {
    let result = `Statement for ${data.customer}\n` 
    for (let perf of data.performances) {
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`
    result += `You earned ${data.totalVolumeCredits} credits\n`
    return result
}

function htmlStatement (invoice, plays) {
    return renderHtml(statementData.createStatementData(invoice, plays))
}
function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n` 
    result += "<table>\n"
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>\n"
    for (let perf of data.performances) {
        result += `  <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`
        result += `<td>${usd(perf.amount)}</td></tr>\n`
    }
    result += "</table>\n"
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`
    return result
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2
    }).format(aNumber/100)
}


const print = statement(readInvoices[0], readPlays)
console.log(print)