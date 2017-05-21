/*jslint es6 */
class Firm {
    constructor() {
        this.name = null;
        this.addresses = [];
        this.kinds = [];
        this.contacts = []
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getAddresses() {
        return this.addresses;
    }

    addAddress(object) {
        this.addresses.push(object);
    }

    addContact(object) {
        this.contacts.push(object);
    }

    addKind(object) {
        this.kinds.push(object);
    }
}

module.exports = Firm;