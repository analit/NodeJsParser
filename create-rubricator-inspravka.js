let fs = require( 'fs' );
let mysq = require( 'mysql' );
let xmlBuilder = require( 'xmlbuilder' );
let xml = xmlBuilder.create( 'categories' );
let Category = require( "./modules/category" );
let categories = [];


let connection = mysq.createConnection( {
    host: "localhost",
    user: "root",
    password: "",
    database: "inspravka"
} );

connection.connect();

connection.query( "select * from _in_info_categories order by id", ( error, results, fields ) => {

    if (error) {
        console.log( error );
    }

    results.forEach( row => {
        if (row.parent_id) {
            let category = findCategory( row.parent_id );
            if (category) {
                category.categories.push( new Category( row.title, row.id ) );
            }
        } else {
            categories.push( new Category( row.title, row.id ) );
        }
    } );

    createXml( categories, xml );
    fs.writeFile( "resources/rubricator-inspravka.xml", xml.toString() );
} );

connection.end();


function findCategory ( id ) {

    for (category of categories) {
        if (category.id == id) {
            return category;
        }
    }

    return null;
}

function createXml ( categories, xml ) {
    categories.forEach( ( category ) => {
        let elem = xml.ele( "category", category.getData() );
        if (category.categories.length) {
            createXml( category.categories, elem );
        }
    } );
}