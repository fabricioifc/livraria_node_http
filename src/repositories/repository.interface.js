class Repository {
    constructor() {
        if (this.constructor === Repository) {
            throw new Error("Cannot instantiate abstract class Repository");
        }
    }

    async findAll() {
        throw new Error("Method 'findAll()' must be implemented");
    }

    async findById(id) {
        throw new Error("Method 'findById()' must be implemented");
    }

    async create(data) {
        throw new Error("Method 'create()' must be implemented");
    }

    async update(id, data) {
        throw new Error("Method 'update()' must be implemented");
    }

    async delete(id) {
        throw new Error("Method 'delete()' must be implemented");
    }
}

module.exports = Repository;
