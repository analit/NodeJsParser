/**
 * Example
 * node build/list-firms/parse-list-firms-omel.js https://yandex.ru 1-100
 */
// import needle = require("needle");
import * as needle from "needle";
// import $ = require("cheerio");
import * as cheerio from "cheerio";

import * as  fs from "fs";

import * as builder from "xmlbuilder";

import * as xpath from "xpath";

import { DOMParser } from "xmldom";
import { SelectedValue } from "xpath";
import { encode } from "punycode";

let rangeParams: string = process.argv[3];
let rangeArray: string[] = rangeParams.split("-");

const baseUrl = `${process.argv[2]}/view.php`;

function* range(start: number, end: number): IterableIterator<number> {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

for (let id of range(parseInt(rangeArray[0]), parseInt(rangeArray[1]))) {
    parsePage(id);
}

function parsePage(id: number): void {
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
    })
}


function parse(data: string): Result {

    let result = new Result(0, "");

    let regExp = /Внимание! Данная страница не найдена./;
    if (data.match(regExp)) {
        return result;
    }

    let doc = new DOMParser({ errorHandler: { warning: (msg) => { } } }).parseFromString(data);

    // needed phones
    let path: string = "//table[@width=550]//td/strong[contains(.,'+7(978)')]";
    let nodes = xpath.select(path, doc);

    if (!nodes.length) {
        return result;
    }

    let name: SelectedValue[] = xpath.select("//table[@width=550]//h1/text()", doc);
    // console.log(name[0].toString());
    // result.setId(id).setName(name[0].toString());
    result.setName(name[0].toString());

    // needed http
    path = "//table[@width=550]//td/a[contains(text(),'http')]";
    nodes = xpath.select(path, doc);

    if (nodes.length) {
        result.setHttp(true)
    }

    return result;
}

class Result {
    private id: number;
    private name: string;
    private http: boolean;
    constructor(id: number, name: string, phones: boolean = false, http: boolean = false) { 
        this.id = id, this.name = name, this.http = http 
    }
    getId(): number { return this.id; }
    setId(id: number): Result { this.id = id; return this }
    setName(name: string): Result { this.name = name; return this }
    setHttp(flag: boolean): Result { this.http = flag; return this }
}