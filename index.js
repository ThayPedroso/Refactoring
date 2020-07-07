const fs = require('fs')

const readPlays = JSON.parse(fs.readFileSync('./plays.json'))
const readInvoices = JSON.parse(fs.readFileSync('./invoices.json'))

function statement (invoice, plays) {
    let totalAmount = 0
    let volumeCredits = 0
    let result = `Statement for ${invoice.customer}\n`
    const format = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2
    }).format

    for (let perf of invoice.performances) {
        const play = plays[perf.playID]
        let thisAmount = amountFor(perf, play)

        // soma créditos por volume
        volumeCredits += Math.max(perf.audience -30, 0)
        // soma um crédito crédito extra para cada dez expectadores de comédia
        if("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5)

        // exibe a linha para esta requisição
        result += `  ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`
        totalAmount += thisAmount
    }

    result += `Amount owed is ${format(totalAmount/100)}\n`
    result += `You earned ${volumeCredits} credits\n`
    return result

    function amountFor(perf, play) {

        switch (play.type) {
            case "tragedy": 
                thisAmount = 40000
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30)
                }
                break
            case "comedy": 
                thisAmount = 30000
                if (perf.audience > 20) {
                    thisAmount += 10000  + 500 * (perf.audience - 20)
                }
                thisAmount += 300 * perf.audience
                break
            default:
                throw new Error(`unknown type: ${play.type}`)
        }
        return thisAmount
    }
}



const print = statement(readInvoices[0], readPlays)
console.log(print)