let needle = require('needle');
let tress = require('tress');
let cheerio = require('cheerio');
let builder = require('xmlbuilder');
let functions = require("./modules/functions")
let Firm = require("./modules/firm");

let url = "http://localhost/NodeJsParser/8982_test.html";
// let url = "http://1582.com.ua/view.php?id=7522";
// let url = "http://1582.com.ua/view.php?id=8982";
// let xmlFirm = builder.create("firm");

function saveToFile() {

}

function parseKinds(err, res){
    console.log(firm);
}

let q = tress((url, callback) => {

    let firm = new Firm();

    needle.get(url, (err, res) => {
        let $ = cheerio.load(res.body);

        let tableFirmData = $("table[width=550]");
        firm.setName(tableFirmData.find("h1").text().trim());

        // address
        let addressContainer = $("td[width=265]");
        var address = getAddress(addressContainer);
        firm.addAddress(address);

        let phonesObjects = $("td[width=265]").next().find("strong").contents().filter(function () { return this.nodeType === 3 });
        let phones = getPhones(phonesObjects);
        address.phones = phones;

        // affiliate
        $("div#fil").each((i, affiliateContaner) => {
            let addressAffiliate = getAffiliateAddress($(affiliateContaner), address.town);
            firm.addAddress(addressAffiliate);
        });

        // site
        let site = $("td[width=265]").next().find('a[target=new]');
        if (site.length) {
            firm.addContact({ type: 'http', contact: site.text().trim() });
        }

        // let kinds = $("div[align=left] a[href*='alloffers.php?category']");
        let kinds = $("div[align=left] a[href*='_test_category']");
        kinds.each((i, kind) => {
            console.log($(kind).attr("href"));
            needle.get($(kind).attr("href"), parseKinds);
        });
        callback();
    })
}, 10)

q.push(url);
// q.push(url);

q.drain = function () {
    console.log('Finished');
};

function getAffiliateAddress(affiliateContaner, town) {

    var address = affiliateContaner.find("h2").contents().filter(function () { return this.nodeType === 3 }).eq(1)[0].data;
    address = functions.parseAddress(address);
    address.town = town;
    address.phones = [];
    var phones = affiliateContaner.contents().filter(function () { return this.nodeType === 3 })
    phones.each((i, phone) => {
        phone = phone.data.trim().replace(/\)/, ") ");
        if (/\+\d+\(\d+\)/.test(phone)) {
            phone = functions.parsePhone(phone);
            address.phones.push(phone);
        }

    })

    return address;
}

function getAddress(addressContainer) {

    let town = addressContainer.contents().filter("strong").eq(0).text().trim();
    let address = addressContainer.contents().filter("strong").eq(1).text().trim();
    let result = functions.parseAddress(address);
    result.town = town;

    return result;
}

function getPhones(phonesObjects) {
    let result = [];
    phonesObjects.each((index, phone) => {
        result.push(functions.parsePhone(phone.data));
    });
    return result;
}