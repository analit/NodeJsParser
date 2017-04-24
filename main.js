let fs = require('fs');
let xmlDoc = require('xmldoc');

fs.readFile('rubricator1582.xml', 'utf8', function (err, data) {
    console.log(data);
});