var request = require('request');
var fs = require('fs');
var xmlBuilder = require('xmlbuilder');


//var url = "http://1582.com.ua/STROYMATERIALI.-STROITELNIE-MATERIALI/Besedki/Kovannie-besedki/22-1264-1632-0.html";
var url = "http://localhost/NodeJsParser/test.html";

var Iconv = require('iconv').Iconv;
var fromEnc = 'cp1251';
//var fromEnc = 'iso-8859-1';
var toEnc = 'utf-8';
var translator = new Iconv(fromEnc, toEnc);

//request({url: url, encoding: null}, createKindFile);
request({url: url, encoding: null}, function (error, response, body) {
    require('./modules/save-parse-data').saveToXml(url, translator.convert(body).toString());
});


function createKindFile(error, response, body) {

    console.log(translator.convert(body).toString());
    process.exit(1);
    
    $ = cheerio.load(response);
    var listFirms = $("table[width='97%'] tr");
    
    

    var firms = xmlBuilder.create("firms");
    var phones = firms.ele('firm', {name: "Test firm name"}).
            ele('address', {address: "Симферополь, ул. Ветлицкого, 25, кв. 18"}).
            ele('phones');

    phones.ele('phone', {}, "25-12-49");
    phones.ele('phone', {}, "25-12-48");

    fs.writeFile('kinds-data/blya.xml', firms);
}

function appendFirm(){
    
}



