let storage = require( "./../modules/storage" );
let chai = require( "chai" );
let expect = chai.expect;
let assert = chai.assert;

describe( 'test storage', () => {
    it( 'get category id from map', () => {
        let data = getCategoryIdProvider();
        data.forEach( ( data ) => {
            storage.getMapCategory( "./resources/map-rubrics-omel.json", ( map ) => {
                assert.equal( map[data.data], data.expect );
            } );
        } );
    } );
} );

function getCategoryIdProvider () {
    return [
        {
            data: 1217,
            expect: 311
        }
    ];
}