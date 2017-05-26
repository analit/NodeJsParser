/*jslint es6 */
class Firm {
    constructor(id) {
        this.id = id;
        this.name = null;
        this.addresses = [];
        this.kinds = [];
        this.contacts = [];
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getKinds() {
        return this.kinds;
    }

    getContacts() {
        return this.contacts;
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