let fs = require("fs");

let saveToFile = (firma, fileName) => {
    fs.writeFile(fileName, "Hello word!", (err) => {
        if (err) {
            console.log(err.message)
        }
     })
}

module.exports = {
    saveToFile: saveToFile
}