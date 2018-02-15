/*jslint es6 */
class Firm {
    constructor(id) {
        this.id = id;
        this.name = null;
        this.addresses = [];
        this.kinds = [];
        this.contacts = [];
        this.logo = '';
        this.createdBy = `parser-omel:${id}`;
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

    getCreatedBy() {
        return this.createdBy
    }
}

module.exports = Firm;