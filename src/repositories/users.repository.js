const db = require('../database/sqlite');
const User = require('../models/user.model');

class UsersRepository {
    findById(id) {
        const row = db.get('SELECT * FROM users WHERE id = ?', [id]);
        return row ? User.fromDB(row) : null;
    }

    findByUsername(username) {
        const row = db.get('SELECT * FROM users WHERE username = ?', [username]);
        return row ? User.fromDB(row) : null;
    }

    findByEmail(email) {
        const row = db.get('SELECT * FROM users WHERE email = ?', [email]);
        return row ? User.fromDB(row) : null;
    }

    create({ username, email, password }) {
        const result = db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        return this.findById(result.lastInsertRowid);
    }

    listAll() {
        const rows = db.all('SELECT * FROM users ORDER BY id ASC');
        return rows.map(row => User.fromDB(row));
    }
}

module.exports = UsersRepository;
