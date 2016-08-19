var request = require('request');
var fs = require('fs');

var url = "http://1582.com.ua/STROYMATERIALI.-STROITELNIE-MATERIALI/Besedki/Kovannie-besedki/22-1264-1632-0.html";
var url = "http://localhost/NodeJsParser/test2.html";

var Iconv = require('iconv').Iconv;
var fromEnc = 'cp1251';
var toEnc = 'utf-8';
var translator = new Iconv(fromEnc, toEnc);

function getFileName(url) {
    var match = url.match(/([0-9]+-){2,3}[0-9]+/);
    if (match) {
        return match[0];
    }
    return 'test';
}

var fileName = getFileName(url) + ".xml";


request({url: url, encoding: null}, function (error, response, body) {
    var xmlData = require('./modules/save-parse-data').getXmlData(translator.convert(body).toString());
    xmlData.att("url", url);
    fs.writeFile('kinds-data/' + getFileName(url) + ".xml", xmlData);
});