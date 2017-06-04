let Dom = require( "xmldom" ).DOMParser;
let xpath = require( "xpath" );

function Rubricator( xmlData ) {
    this.dom = new Dom().parseFromString( xmlData );
}

Rubricator.prototype.getRubricsFromXpath = function ( xpath ) {
    let nodes = xpath.select( xpath, this.dom );
}

/**
 *
 * @param {Array} ids
 */
Rubricator.prototype.getRubricsFromIds = function ( ids ) {
    let nodes = [];
    ids.forEach( id => {
        nodes = nodes.concat( xpath.select( `//category[@id=${id}]`, this.dom ) );
    } );

    return this.getRubricsFromNodes( nodes );
}

Rubricator.prototype.getRubricsFromNodes = function ( nodes ) {
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


// exports.Rubricator = Rubricator;
module.exports = Rubricator;