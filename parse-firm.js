let needle = require('needle');
let tress = require('tress');
let cheerio = require('cheerio');
let builder = require('xmlbuilder');
let Firm = require("./modules/firm");

let url = "http://localhost/NodeJsParser/7522_test.html";
// let url = "http://1582.com.ua/view.php?id=7522";
// let xmlFirm = builder.create("firm");

function saveToFile() {

}

let firm = new Firm();

let q = tress((url, callback) => {
    needle.get(url, (err, res) => {
        let $ = cheerio.load(res.body);

        let tableFirmData = $("table[width=550]");
        firm.name(tableFirmData.find("h1").text());

        let addressContainer = $("td[width=256]");


    })
}, 10)

q.push(url);
// q.push(url);
// needle.get(url, (err, res) => {
//     console.log(res.body);
// })

function getAddress(addressContainer) {

    let town = addressContainer.filter("strong").eq(0).text().trim();
    let address = addressContainer.filter("strong").eq(0).text().trim();

    return {
        town: town,
        st: 'st',
        point: "",
        street: 'street',
        houseNumber: 'houseNumber'
    }
}
