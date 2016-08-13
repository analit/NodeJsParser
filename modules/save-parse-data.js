var cheerio = require('cheerio');
var xmlBuilder = require('xmlbuilder');


function isCheck(phones, address) {
    if (phones.text().match(/\+7\(978\)/)) {
        return true;
    }

    if (phones.text().match(/\+7/) && address.text().match(/Республика Крым/)) {
        return true;
    }

    return false;
}

function getFirmId(firmUrl){
    var codes = firmUrl.match(/([0-9]+-){5}[0-9]+/);
    return codes[0].split("-")[3];
}

function appendDataToFirms(name, phones, address) {
    var firmNode = this.ele('firm', {name: name.find("span").text().trim(), id:getFirmId(name.find("a").attr("href"))});
    var addressToArray = address.text().split("\n");
    var addressNode = firmNode.ele('address', {address: addressToArray[1].trim(), region:addressToArray[2].trim()})
    var phonesNode = addressNode.ele('phones');
    phones.html().split("<br>").forEach(function (element) {
       element.trim().length && phonesNode.ele('phone', {}, element.trim())
    });
}


module.exports.getXmlData = function (body) {
    var $ = cheerio.load(body);
    var listFirms = $("table[width='97%'] tr");
    var firms = xmlBuilder.create("firms");

    listFirms.each(function () {
        var tds = $(this).find("td");
        isCheck(tds.eq(2), tds.eq(3)) && appendDataToFirms.call(firms, tds.eq(1), tds.eq(2), tds.eq(3));
    });

    // console.log(firms.toString());
    
};


