// let Dom = require( "xmldom" ).DOMParser;

let fs = require("fs");
let builder = require('xmlbuilder');
let Rubricator = require("./rubricator");
/**
 *
 * @param {Firm} firm
 */
let saveToFile = (firm) => {

    let xmlFirm = builder.create('root').ele('firm', {
        'id-omel': firm.getId(),
        name: firm.getName(),
        createdBy: firm.getCreatedBy()
    });

    // logo
    xmlFirm.ele('images').ele("image", {
        src: firm.logo
    });

    // addresses
    let xmlAddresses = xmlFirm.ele('addresses');
    firm.getAddresses().forEach(function (address) {
        let phones = address.phones;
        delete address.phones;
        let xmlAddress = xmlAddresses.ele('address', address);
        let xmlPhones = xmlAddress.ele('phones');
        phones.forEach(phone => {
            xmlPhones.ele('phone', phone);
        });
    });

    // kinds
    let xmlKinds = xmlFirm.ele('kinds');
    firm.getKinds().forEach(kind => {
        xmlKinds.ele('kind', kind);
    });

    // contacts
    if (firm.getContacts().length) {
        let xmlContacts = xmlFirm.ele('contacts');
        firm.getContacts().forEach(contact => xmlContacts.ele('contact', contact));
    }

    let fileName = `data/${firm.getId()}.xml`;
    fs.writeFile(fileName, xmlFirm.toString(), (err) => {
        if (err) {
            console.log(err.message);
        }

        console.log(`File saved in ${fileName}`);
    });
};

function getMapCategory(fileMapRubricsOmel, fileRubricatorInspravka, callback) {

    let dataMapRubricsOmel, dataRubricatorInspravka;
    let args = [
        new Promise(resolve => {
            fs.readFile(fileMapRubricsOmel, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                }
                dataMapRubricsOmel = JSON.parse(data);
                resolve();
            });
        }),
        new Promise(resolve => {
            fs.readFile(fileRubricatorInspravka, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                }
                // dataRubricatorInspravka = new Dom().parseFromString( data );
                dataRubricatorInspravka = new Rubricator(data);
                resolve();
            });
        })
    ];

    Promise.all(args).then(() => {
        callback(dataMapRubricsOmel, dataRubricatorInspravka);
    });
}

module.exports = {
    saveToFile: saveToFile,
    getMapCategory: getMapCategory
};