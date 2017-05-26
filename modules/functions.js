let parseAddress = (address) => {
    let result = {
        point: "",
        street: "",
        st: "",
        houseNumber: "",
        officeNumber: ""
    };
    address = address.trim();
    var [point, street] = address.split(":");

    if (street) {
        // has point
        result.point = point;
        street = street.trim();
    } else {
        // hasn't point
        street = address;
    }

    var [street, houseNumber, officeNumber] = street.split(", ");
    var [st, ...street] = street.split(" ");
    result.st = st || "";
    result.street = street.join(" ");
    result.houseNumber = houseNumber || "";
    result.officeNumber = officeNumber || "";

    return result;
}

let parsePhone = (phoneRaw) => {
    let result = {
        countryCode: "",
        phoneType: "т",
        number: "",
        TownCode: "",
        comment: ""
    }

    var [phone, ...comment] = phoneRaw.split("-");

    if (comment) {
        result.comment = comment.join("-").trim();
    }

    phone = phone.trim();
    var [code, number] = phone.split(" ");
    result.number = number.trim();

    code = code.replace(/[+()]/g, " ").trim();
    var [countryCode, townCode] = code.split(" ");

    result.countryCode = countryCode;
    result.TownCode = townCode;

    let mobileCodes = ['978', '50'];

    if (mobileCodes.indexOf(townCode) > -1) {
        result.phoneType = "м";
    }

    return result;
}
/**
 * @param {string} url 
 */
function getFirmId(url) {
    if (/localhost\/NodeJsParser/.test(url)){
        return '00';
    }
    let found = url.match(/\d+$/);
    return found[0];
}



module.exports = {
    parseAddress: parseAddress,
    parsePhone: parsePhone,
    getFirmId: getFirmId
}