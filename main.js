var request = require('request');
var fs = require('fs');

// var url = "http://1582.com.ua/STROYMATERIALI.-STROITELNIE-MATERIALI/Besedki/Kovannie-besedki/22-1264-1632-0.html";
// var url = "http://localhost/NodeJsParser/test2.html";

var argv = process.argv.slice(2);

if (argv.length != 2) {
    console.log("Error format argv. params: 1 - page url, 2 - count pages");
    console.log("Example. node main.js http://1582.com.ua/ALKOGOLNIE-NAPITKI-PIVO/Alkogolnie-napitki/2-32-0.html 6");
    process.exit(0);
}

function populateUrs(url, countPage) {
    var urls = [];
    for (var i = 0; i < countPage; i++) {
        urls.push(url.replace(/0.html$/, i + ".html"))
    }
    return urls;
}

var urls = populateUrs(argv[0], argv[1]);

// console.log(urls); process.exit();

var Iconv = require('iconv').Iconv;
var fromEnc = 'cp1251';
var toEnc = 'utf-8';
var translator = new Iconv(fromEnc, toEnc);

function getFileName(url) {
    var match = url.match(/([0-9]+-){2,3}[0-9]+/);
    if (match) {
        return match[0];
    }
    return Math.random();
}

function parse(url) {
    request({url: url, encoding: null}, function (error, response, body) {

        console.log("Parse " + url);
        if (error) {
            console.log("Parser error:" + error); return;
        }

        if (response.statusCode !== 200) {
            console.log("Parser error: Status code - " + response.statusCode); return;
        }

        var xmlData = require('./modules/save-parse-data').getXmlData(translator.convert(body).toString());

        xmlData.att("url", url);

        // console.log(xmlData); process.exit(0);
        var fileName = 'kinds-data/' + getFileName(url) + ".xml";
        fs.writeFile(fileName, xmlData);
        console.log("Created file " + fileName);

    });
}

urls.forEach(parse);