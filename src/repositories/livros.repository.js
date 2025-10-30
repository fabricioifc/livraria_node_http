// src/repositories/livros.repository.js
const RepositoryBase = require("./repository.interface");
const db = require("../database/sqlite");
const Livro = require("../models/livro.model");

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
    }

    async findAll() {
        const rows = db.all("SELECT id, titulo, autor, categoria, ano FROM livros ORDER BY id ASC");
        return rows.map(row => Livro.fromJSON(row));
    }

    async findById(id) {
        const row = db.get("SELECT id, titulo, autor, categoria, ano FROM livros WHERE id = ?", [id]);
        return row ? Livro.fromJSON(row) : null;
    }

    async create(livroData) {
        const novoLivro = new Livro({ id: null, ...livroData });
        const result = db.run(
            "INSERT INTO livros (titulo, autor, categoria, ano) VALUES (?, ?, ?, ?)",
            [novoLivro.titulo, novoLivro.autor, novoLivro.categoria, novoLivro.ano]
        );
        return this.findById(result.lastInsertRowid);
    }

    async update(id, dadosAtualizados) {
        const existente = this.findById(id);
        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        const atualizado = new Livro({ ...existente.toJSON(), ...dadosAtualizados });
        db.run(
            "UPDATE livros SET titulo = ?, autor = ?, categoria = ?, ano = ? WHERE id = ?",
            [atualizado.titulo, atualizado.autor, atualizado.categoria, atualizado.ano, id]
        );
        return this.findById(id);
    }

    async delete(id) {
        const existente = this.findById(id);
        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        db.run("DELETE FROM livros WHERE id = ?", [id]);
        return existente;
    }
}

module.exports = LivrosRepository;