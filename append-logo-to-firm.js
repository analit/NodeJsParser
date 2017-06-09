let argv = require( 'optimist' ).argv;
let request = require( 'request' );
let fs = require( "fs" );
var md5 = require( 'md5' );

if (argv.help) {
    console.log( "Options:" );
    console.log( "--host: (required)" );
    console.log( "--token: (required)" );
    console.log( "--data: (required)" );
    console.log( "--url: (required)" );
    process.exit( 0 );
}

if (!argv.host || !argv.token || !argv.data || !argv.url) {
    console.log( 'Options "host", "token", "data" or "url" not found!' );
    process.exit( 0 );
}

var url = `${argv.host}/api/crud/add-logo/${md5( argv.token )}`;

console.log( url );


request( {
    url: url,
    method: "PUT",
    form: {"firm-id": argv.data, "logo-url": argv.url}
    // , headers: {
    //     'User-Agent': 'request'
    // }
}, ( err, response, body ) => {
    console.log( JSON.parse( body ) );
    // console.log(  body  );
} );
