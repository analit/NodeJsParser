var cheerio = require('cheerio');
var xmlBuilder = require('xmlbuilder');

function isCheck(phones, address) {
    if (phones.text().match(/\+7\(978\)/)) {
        return true;
    }

    if (phones.text().match(/\+7/) && address.text().match(/Республика Крым/)) {
        return true;
    }

    return false
}

function appendDataToFirms(name, phones, address) {
    var firm = this.ele('firm', {name: name.find("span").text().trim()});
    var address = address.text().split("\n");
    var address = firm.ele('address', {address: address[1].trim(), region:address[2].trim()})
    console.log();
}

function getFileName(url) {
    return "ppc.xml";
}

module.exports.saveToXml = function (url, body) {
    var $ = cheerio.load(body);
    var listFirms = $("table[width='97%'] tr");
    var firms = xmlBuilder.create("firms");

    listFirms.each(function () {
        var tds = $(this).find("td");
        isCheck(tds.eq(2), tds.eq(3)) && appendDataToFirms.call(firms, tds.eq(1), tds.eq(2), tds.eq(3));
    });

    console.log(firms.toString());
};


