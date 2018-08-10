"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Example
 * node build/list-firms/parse-list-firms-omel.js https://yandex.ru 1-100
 */
// import needle = require("needle");
const needle = require("needle");
const xpath = require("xpath");
const xmldom_1 = require("xmldom");
let rangeParams = process.argv[3];
let rangeArray = rangeParams.split("-");
const baseUrl = `${process.argv[2]}/view.php`;
function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}
for (let id of range(parseInt(rangeArray[0]), parseInt(rangeArray[1]))) {
    parsePage(id);
}
function parsePage(id) {
    needle.get(baseUrl + `?id=${id}`, (err, res) => {
        if (err) {
            console.log(id + " : " + "Error");
            process.exit(1);
        }
        let result = parse(res.body);
        result.setId(id);
        if (result.getId()) {
            // console.log(result);
            console.log(JSON.stringify(result));
        }
    });
}
function parse(data) {
    let result = new Result(0, "");
    let regExp = /Внимание! Данная страница не найдена./;
    if (data.match(regExp)) {
        return result;
    }
    let doc = new xmldom_1.DOMParser({ errorHandler: { warning: (msg) => { } } }).parseFromString(data);
    // needed phones
    let path = "//table[@width=550]//td/strong[contains(.,'+7(978)')]";
    let nodes = xpath.select(path, doc);
    if (!nodes.length) {
        return result;
    }
    let name = xpath.select("//table[@width=550]//h1/text()", doc);
    // console.log(name[0].toString());
    // result.setId(id).setName(name[0].toString());
    result.setName(name[0].toString());
    // needed http
    path = "//table[@width=550]//td/a[contains(text(),'http')]";
    nodes = xpath.select(path, doc);
    if (nodes.length) {
        result.setHttp(true);
    }
    return result;
}
class Result {
    constructor(id, name, phones = false, http = false) {
        this.id = id, this.name = name, this.http = http;
    }
    getId() { return this.id; }
    setId(id) { this.id = id; return this; }
    setName(name) { this.name = name; return this; }
    setHttp(flag) { this.http = flag; return this; }
}
