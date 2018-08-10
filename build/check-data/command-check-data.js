"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * node build/check-data/check-data.js https://google.com 9
 */
const xmldom_1 = require("xmldom");
const fs = require("fs");
// import * as md5 from "md5";
const config = require("../../config");
const md5 = require("md5");
const needle = require("needle");
let id = parseInt(process.argv[3]);
let url = process.argv[2];
let parser = new xmldom_1.DOMParser();
fs.readFile(`data/${id}.xml`, 'utf8', (err, data) => {
    let xml = parser.parseFromString(data, 'application/xml');
    console.log(data);
    console.log("--------------------------------------");
    let firm = new Firm(xml);
    let phones = firm.getPhones();
    phones.forEach(phone => {
        needle.get(`${url}/api/search?phone=${phone}&token=${md5(config.api_token)}`, (error, response, body) => {
            console.log(`Result - ${phone}:`, JSON.stringify(body));
        });
    });
    let name = firm.getName();
});
class Firm {
    constructor(xml) { this.xml = xml; }
    getPhones() {
        let result = [];
        const phones = this.xml.getElementsByTagName("phone");
        if (phones === null)
            return result;
        for (let i = 0; i < phones.length; i++) {
            let phone;
            phone = phones && phones.item(i) && phones.item(i).attributes && phones.item(i).attributes.getNamedItem('number') && phones.item(i).attributes.getNamedItem('number').nodeValue;
            if (phone) {
                result.push(phone);
            }
        }
        return result;
    }
    getName() {
        const element = this.xml.firstChild;
        if (element === null) {
            return null;
        }
        return element.attributes.getNamedItem('name').nodeValue;
    }
    getPhonesToString() {
        return this.getPhones().join(",");
    }
}
