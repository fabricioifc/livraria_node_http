const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

class User {
    constructor({ id = null, username, email, password, created_at = null }) {
        this.id = id;
        this.username = String(username).trim();
        this.email = String(email).trim().toLowerCase();
        this.password = password; // hash
        this.created_at = created_at;
        this._validate();
    }

    _validate() {
        const errors = [];
        if (!this.username || this.username.length < 3) errors.push("Usuário deve ter pelo menos 3 caracteres");
        if (!EMAIL_REGEX.test(this.email)) errors.push("Email inválido");
        if (!this.password || this.password.length < 6) errors.push("Senha deve ter pelo menos 6 caracteres (hash)");
        if (errors.length > 0) {
            const err = new Error("Dados inválidos");
            err.statusCode = 400;
            err.details = errors;
            throw err;
        }
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            created_at: this.created_at
        };
    }

    static fromDB(row) {
        return new User(row);
    }
}

module.exports = User;
