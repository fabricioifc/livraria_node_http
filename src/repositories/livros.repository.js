// src/repositories/livros.repository.js
const RepositoryBase = require("./repository.interface");
const { sequelize, DataTypes } = require("../database");
const defineLivroModel = require("../models/livro.sequelize.model");

// Define o modelo Sequelize (singleton por módulo)
const LivroModel = defineLivroModel(sequelize, DataTypes);

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
    }

    async findAll() {
        const rows = await LivroModel.findAll({ order: [['id', 'ASC']] });
        // return json
        return rows.map(r => r.get({ plain: true }));
    }

    async findById(id) {
        const row = await LivroModel.findByPk(id);
        return row ? row.get({ plain: true }) : null;
    }

    async create(livroData) {
        const created = await LivroModel.create({
            titulo: livroData.titulo,
            autor: livroData.autor,
            categoria: livroData.categoria,
            ano: livroData.ano
        });
        return this.findById(created.id);
    }

    async update(id, dadosAtualizados) {
        const existente = await LivroModel.findByPk(id);
        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }

        await existente.update({
            titulo: dadosAtualizados.titulo ?? existente.titulo,
            autor: dadosAtualizados.autor ?? existente.autor,
            categoria: dadosAtualizados.categoria ?? existente.categoria,
            ano: dadosAtualizados.ano ?? existente.ano
        });

        return this.findById(id);
    }

    async delete(id) {
        const existente = await LivroModel.findByPk(id);
        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        const plain = existente.get({ plain: true });
        await existente.destroy();
        return plain;
    }
}

module.exports = LivrosRepository;