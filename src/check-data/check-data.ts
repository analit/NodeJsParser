/**
 * node build/check-data/check-data.js https://google.com 9
 */
import { DOMParser } from "xmldom";
import * as fs from "fs";
// import * as md5 from "md5";
const config = require("../../config");
import md5 = require("md5");
import * as needle from "needle";
import { NeedleOptions } from "needle";


let id: number = parseInt(process.argv[3]);
let url: string = process.argv[2];
let parser = new DOMParser()

fs.readFile(`data/${id}.xml`, 'utf8', (err, data) => {
    let xml: Document = parser.parseFromString(data, 'application/xml');
    console.log(data);
    console.log("--------------------------------------")
    let firm = new Firm(xml);
    let phones = firm.getPhones();
    phones.forEach(phone => {
        needle.get(`${url}/api/search?phone=${phone}&token=${md5(config.api_token)}`, (error, response, body) => {
            console.log(`Result - ${phone}:`, JSON.stringify(body));
        })
    });

    let name = firm.getName();
});

class Firm {
    private xml: Document
    constructor(xml: Document) { this.xml = xml }
    public getPhones(): string[] {
        let result: string[] = [];
        let phones = this.xml.getElementsByTagName("phone");
        for (let i = 0; i < phones.length; i++) {
            let phone: string | null = phones.item(i).attributes.getNamedItem('number').nodeValue;
            if (phone) {
                result.push(phone);
            }
        }
        return result;
    }
    public getName(): string | null {
        let element: Node | null = this.xml.firstChild;
        if (element) {
            return element.attributes.getNamedItem('name').nodeValue;
        }
        return null;
    }

    public getPhonesToString(): string {
        return this.getPhones().join(",");
    }


}
