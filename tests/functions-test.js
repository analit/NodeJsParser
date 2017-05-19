let functions = require("./../modules/functions.js");
let chai = require("chai");
let expect = chai.expect;

describe('test functions', function () {
    it('parse address', function () {
        let data = getParseAddressDataProvider();
        data.forEach(function (data) {
            expect(functions.parseAddress(data.data)).to.eql(data.expect);
        });
    })

    it('parse phone', () => {
        let data = getParsePnoneDataProvider();
        data.forEach((data) => {
            expect(functions.parsePhone(data.data)).to.eql(data.expect);
        });
    })
});

function getParsePnoneDataProvider() {
    return [
        {
            data: "+7(978) 7278553 - Директор - в абнентском зале",
            expect: {
                countryCode: "7",
                phoneType: "м",
                number: "7278553",
                TownCode: "978",
                comment: "Директор - в абнентском зале"
            }
        },
        {
            data: "+380(50) 7278553 - Директор",
            expect: {
                countryCode: "380",
                phoneType: "м",
                number: "7278553",
                TownCode: "50",
                comment: "Директор"
            }
        },
        {
            data: "+7(3652) 621238",
            expect: {
                countryCode: "7",
                phoneType: "т",
                number: "621238",
                TownCode: "3652",
                comment: ""
            }
        }
    ]
}

function getParseAddressDataProvider() {
    return [
        {
            data: "ул. Балаклавская, 68, оф. 107",
            expect: {
                point: "",
                street: "Балаклавская",
                st: "ул.",
                houseNumber: "68",
                officeNumber: "оф. 107"
            }
        },
        {
            data: "ул. Александра Невского, 68, оф. 107",
            expect: {
                point: "",
                street: "Александра Невского",
                st: "ул.",
                houseNumber: "68",
                officeNumber: "оф. 107"
            }
        },
        {
            data: "ул. К. Бородина, 12а",
            expect: {
                point: "",
                street: "К. Бородина",
                st: "ул.",
                houseNumber: "12а",
                officeNumber: ""
            }
        },
        {
            data: "Офис: ул. Маяковского, 2 ",
            expect: {
                point: "Офис",
                street: "Маяковского",
                st: "ул.",
                houseNumber: "2",
                officeNumber: ""
            }
        }
    ]
}