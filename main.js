var request = require('request');
var fs = require('fs');
var xmlBuilder = require('xmlbuilder');

var url = "http://1582.com.ua/STROYMATERIALI.-STROITELNIE-MATERIALI/Besedki/Kovannie-besedki/22-1264-1632-0.html";

var Iconv = require('iconv').Iconv;
var fromEnc = 'cp1251';
var toEnc = 'utf-8';
var translator = new Iconv(fromEnc, toEnc);

function getFileName(url) {
    return url.match(/([0-9]+-){2,3}[0-9]+/)[0];
}

var fileName = getFileName(url) + ".xml";

fs.access('kinds-data/blya.xml', null, (err) => {
    console.log('File %s already exists!');
});

request({url: url, encoding: null}, function (error, response, body) {
    var xmlData = require('./modules/save-parse-data').getXmlData(translator.convert(body).toString());
    fs.writeFile('kinds-data/' + getFileName(url) + ".xml", xmlData);
});