let needle = require("needle");
let tress = require('tress');
let cheerio = require('cheerio');

let functions = require("./modules/functions");
let Firm = require("./modules/firm");
let storage = require("./modules/storage");

let url = "http://localhost/NodeJsParser/8982_test.html";
// let url = "http://1582.com.ua/view.php?id=7522";
// let url = "http://1582.com.ua/view.php?id=8982";
// let url = "http://1582.com.ua/filial.php?id=8982";
// let url = "http://1582.com.ua/view.php?id=235";

if (process.argv.slice(2)[0]) {
    url = process.argv.slice(2)[0];
}

process.on('uncaughtException', function (error) {
    console.log(error.stack);
});

let q = tress((url, callback) => {

    console.log(`Parse url '${url}' ...`);

    let firm = new Firm(functions.getFirmId(url));

    needle.get(url, (err, res) => {
        let $ = cheerio.load(res.body);

        let tableFirmData = $("table[width=550]");
        firm.setName(tableFirmData.find("h1").text().trim());

        // address
        let addressContainer = $("td[width=265]");
        let address = getAddress(addressContainer);
        firm.addAddress(address);

        let phonesObjects = $("td[width=265]").next().find("strong").contents().filter(function () { return this.nodeType === 3; });
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

        // kinds
        let categories = $("div[align=left] a[href*='alloffers.php?category']");
        // let categories = $("div[align=left] a[href*='_test_category']");
        let args = [];
        categories.each((i, category) => {
            args.push(new Promise((resolve, reject) => {
                needle.get($(category).attr("href"), (err, res) => {
                    let kinds = getKinds(cheerio.load(res.body));
                    resolve(() => {
                        kinds.forEach((kind) => {
                            firm.addKind(kind);
                        });
                    });
                });
            }));
        });

        // affiliate on towns
        let selector = "a[href*='filial.php']";
        // let selector = "a[href*='8982_test_filial']";
        $(selector).each((i, a) => {
            args.push(new Promise((resolve, reject) => {
                needle.get($(a).attr("href"), (err, res) => {
                    let affiliates = getAffiliateOnTowns(cheerio.load(res.body), address.town);
                    resolve(() => {
                        affiliates.forEach((address) => {
                            firm.addAddress(address);
                        });
                    });
                });
            }));
        });

        Promise.all(args)
            .then(values => {
                values.forEach(callback => {
                    callback();
                });
                // storage.saveToFile(firm);
                return firm;
            })
            .then(firm => {
                storage.getMapCategory("./resources/map-rubrics-omel.json", (map) => {
                    firm.getKinds().forEach(category => {
                        category.id = map[category["id-omel"]] || "";
                    });
                    storage.saveToFile(firm);
                });
            });
    });

    callback();
}, 10);

q.push(url);

q.drain = function () {
    console.log('Finished');
};

/**
 * 
 * @param {jQuery} $ - page to affiliate
 * @param {string} notTown - skip town name
 */
function getAffiliateOnTowns($, notTown) {

    let result = [];
    $("table[cellspacing=1]").each((i, table) => {
        let affiliateContainer = $(table);
        let point = affiliateContainer.find("tr").eq(0).find("strong").text().trim();
        var addressContainer = affiliateContainer.find("tr").eq(1).find("td").eq(1).contents().filter(function () {
            return this.nodeType === 3;
        });
        let town = addressContainer[4].data.replace(/:/, "").trim();
        if (notTown != town) {
            let address = functions.parseAddress(addressContainer[6].data.replace(/:/, "").trim());
            address.town = town;
            address.phones = getPhonesAffiliateOnTowns(addressContainer[8].data.replace(/:/, "").trim());
            result.push(address);
        }
    });

    return result;
}
/**
 * @param {string} phones 
 */
function getPhonesAffiliateOnTowns(phones) {
    let result = [];
    var phones = phones.split(",");
    phones.forEach(phone => {
        result.push(functions.parsePhone(phone.replace(/Примечание:/, "-").replace(/\)/, ") ").trim()));
    });

    return result;
}
/**
 * @param {jQuery} $ page to kinds
 */
function getKinds($) {
    let result = [];
    $("a[href*=subcategory]").each((i, category) => {
        let match = $(category).attr("href").match(/category=\d+/);
        let idOmel = match[0].replace("category=", "");
        let kind = {
            "id-omel": idOmel,
            text: $(category).find("span").text(),
            class: $(category).find("span").attr("class"),
        };
        result.push(kind);
    });

    return result;
}

function getAffiliateAddress(affiliateContaner, town) {

    var address = affiliateContaner.find("h2").contents().filter(function () { return this.nodeType === 3; }).eq(1)[0].data;
    address = functions.parseAddress(address);
    address.town = town;
    address.phones = [];
    var phones = affiliateContaner.contents().filter(function () { return this.nodeType === 3 });
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