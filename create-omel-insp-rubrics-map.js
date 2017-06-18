let xpath = require( "xpath" );
let Dom = require( "xmldom" ).DOMParser;
let fs = require( "fs" );
let xmlBuilder = require( 'xmlbuilder' );
let xml = xmlBuilder.create( 'maps' );

let rubOmel, rubInsp, mapOmel;

let args = [];

console.log( 'Start process ...' );

process.on( 'uncaughtException', function ( error ) {
    console.log( error.stack );
} );

args.push( new Promise( resolve => {
    fs.readFile( "./resources/rubricator-omel.xml", 'utf8', ( err, data ) => {
        if (err) {
            console.log( err );
        }
        resolve( () => {
            rubOmel = new Dom().parseFromString( data );
        } );
    } );
} ) );

args.push( new Promise( resolve => {
    fs.readFile( "./resources/rubricator-inspravka.xml", 'utf8', ( err, data ) => {
        if (err) {
            console.log( err );
        }
        resolve( () => {
            rubInsp = new Dom().parseFromString( data );
        } );
    } );
} ) );

args.push( new Promise( resolve => {
    fs.readFile( "./resources/map-rubrics-omel.json", 'utf8', ( err, data ) => {
        if (err) {
            console.log( err );
        }
        resolve( () => {
            mapOmel = JSON.parse( data );
        } );
    } );
} ) );


Promise.all( args ).then( ( values ) => {
    values.forEach( callback => {
        callback();
    } )

    createMap();
} );

function createMap () {
    for (let idOmel in mapOmel) {
        let xmlMap = xml.ele( 'map' );

        let nodesOmel = xpath.select( `//category[@id=${idOmel}]`, rubOmel );
        for (let rub of getRubs( nodesOmel )) {
            xmlMap.ele( 'omel', rub );
        }

        let idsInspr = mapOmel[idOmel].split( "," );

        for (let idInsp of idsInspr) {
            let nodesInsp = xpath.select( `//category[@id=${idInsp}]`, rubInsp );
            for (let rub of getRubs( nodesInsp )) {
                xmlMap.ele( 'insp', rub );
            }
        }
    }
    let fileName = "data/omel-insp-rubrics-map.xml";
    fs.writeFile( fileName, xml.toString(), err => {
        console.log( `Was created file ${fileName}!` );
    } );

}

function getRubs ( nodes ) {
    let result = [];
    for (let node of nodes) {
        let attrsNode = {
            id: node.getAttributeNode( 'id' ).value,
            title: node.getAttributeNode( 'title' ).value
        };
        result.push( attrsNode );
    }

    return result;
}