class Category {
    constructor(title, id) {
        this.title = title;
        this.id = id;
        this.categories = [];
    }

    addCategory(category) {
        this.categories.push(category);
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    getData() {
        return {
            title: this.title,
            id: this.id
        }
    }
}

module.exports = Category;