let Rubricator = require( "./../modules/rubricator.js" );
let fs = require( "fs" );
let chai = require( "chai" );
let expect = chai.expect;
let assert = chai.assert;

describe( 'test rubricator', () => {
    it( 'test get rubrics from ids', function (done) {
        fs.readFile( "./resources/rubricator-inspravka.xml", 'utf8', ( err, data ) => {
            if (err) throw err;
            let rubricator = new Rubricator( data );
            let dataProvider = getRubricsFromIdsDataProvider();
            dataProvider.forEach( ( data ) => {
                expect( rubricator.getRubricsFromIds( data.data ) ).to.eql( data.expect );
                done();
            } );
        } );
    } );
} );

function getRubricsFromIdsDataProvider() {
    return [
        {
            data: [901, 3007],
            expect: [
                {
                    id: "901",
                    title: "Средства ухода за кожей"
                },
                {
                    id: "3007",
                    title: "Оборудование для парикмахерских и косметологических салонов"
                }
            ]
        }
    ];
}
