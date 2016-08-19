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

function getUrlLogo(tdLogo) {
    if (tdLogo.find("img").length){
        return tdLogo.find("img").attr("src")
    }
    return "";
}

function appendDataToFirms(tdLogo, tdName, tdPhones, tdAddress) {
    var firmAttributes = {
        name: tdName.find("span").text().trim(),
        id: getFirmId(tdName.find("a").attr("href")),
        path: tdName.find("a").attr("href"),
        logo: getUrlLogo(tdLogo)
    };

    var firmNode = this.ele('firm', firmAttributes);
    var addressToArray = tdAddress.text().split("\n");
    var addressNode = firmNode.ele('address', {address: addressToArray[1].trim(), region: addressToArray[2].trim()})
    var phonesNode = addressNode.ele('phones');
    tdPhones.html().split("<br>").forEach(function (element) {
        element.trim().length && phonesNode.ele('phone', {}, element.trim())
    });
}


module.exports.getXmlData = function (body) {
    var $ = cheerio.load(body);
    var listFirms = $("table[width='97%'] tr");
    var firms = xmlBuilder.create("firms");

    listFirms.each(function () {
        var tds = $(this).find("td");
        isCheck(tds.eq(2), tds.eq(3)) && appendDataToFirms.call(firms, tds.eq(0), tds.eq(1), tds.eq(2), tds.eq(3));
    });

    return firms;
};


