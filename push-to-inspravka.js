let argv = require( 'optimist' ).argv;
let request = require( 'request' );
let fs = require( "fs" );
var md5 = require( 'md5' );

if (argv.help) {
    console.log( "Options:" );
    console.log( "--host: (required)" );
    console.log( "--token: (required)" );
    console.log( "--data: (required)" );
    console.log( "--extra: (optional) - additional query params ex. --extra=ignore-phones=1" );
    process.exit( 0 );
}

if (!argv.host || !argv.token || !argv.data) {
    console.log( 'Options "host", "token" or "data" not found!' );
    process.exit( 0 );
}

var url = `${argv.host}/api/crud/add-firm/${md5( argv.token )}`;

if (argv.extra) {
    url = url + "?" + argv.extra;
}

console.log( url );

fs.readFile( `./data/${argv.data}.xml`, ( err, data ) => {
    if (err) {
        console.log( err );
        process.exit( 0 );
    }
    request( {url: url, method: "PUT", body: data}, ( err, response, body ) => {
        // console.log(body);
        console.log( JSON.parse( body ) );
    } );
} );