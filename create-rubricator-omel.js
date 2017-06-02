let fs = require('fs');
let parseString = require('xml2js').parseString;
let xmlBuilder = require('xmlbuilder');
let Category = require("./category");


let xml = xmlBuilder.create('categories');

let categories = [];

const readableFile = "rubricator1582.xml";
/**
 * 
 * @param string id 
 * @param number depth 
 * @return number
 */
let getCategoryId = (id, depth = 0) => {
    return id.split("#")[depth];
}

let clearTitle = (title) => {
    return title.replace(/^\s*\+--\s*/, "").trim();
}

let findOption = (options, id) => {
    console.log(id);
    for (let option of options) {
        if (getCategoryId(option.$.value) == id) {
            return option;
        }
    }
}

let isOptionDepth1 = (option) => {
    return option.$.value.match(/^\d+#\d+#0$/)
}

let parseDocument = (err, data) => {
    let catXR = null;
    parseString(data, (err, result) => {
        for (let optgroup of result.select.optgroup) {
            let currentCategory = null;
            if (optgroup.$.class == 'catXR') {
                catXR = new Category(optgroup.$.label);
                currentCategory = catXR;
                categories.push(catXR);
            }

            if (optgroup.$.class == 'subXR') {
                currentCategory = new Category(clearTitle(optgroup.$.label));
                catXR.addCategory(currentCategory);
            }

            if (optgroup.option) {
                let etalonOption = optgroup.option[0];
                if (isOptionDepth1(etalonOption)) {
                    catXR.setId(getCategoryId(etalonOption.$.value, 0));
                } else {
                    catXR.setId(getCategoryId(etalonOption.$.value, 0));
                    currentCategory.setId(getCategoryId(etalonOption.$.value, 1));
                }
                for (let option of optgroup.option) {
                    let depth = isOptionDepth1(option) ? 1 : 2;
                    currentCategory.addCategory(new Category(clearTitle(option._), getCategoryId(option.$.value, depth)))
                }
            }

        }

        categories.forEach((category) => {
            result.select.option.forEach((option) => {
                if (category.getId() == getCategoryId(option.$.value)) {
                    category.addCategory(new Category(clearTitle(option._), getCategoryId(option.$.value, 1)));
                }
            });
        });
        createXml(categories, xml);
        fs.writeFile("data/rubricator1582.xml", xml.toString());
    });
}

function createXml(categories, xml) {
    categories.forEach((category) => {
        let elem = xml.ele("category", category.getData());
        if (category.categories.length) {
            createXml(category.categories, elem);
        }
    });
}

fs.readFile(readableFile, 'utf8', parseDocument);