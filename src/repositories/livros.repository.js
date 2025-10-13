// src/repositories/livros.repository.js
const RepositoryBase = require("./repository.interface");
const Livro = require("../models/livro.model");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
    }

    async findAll() {
        const rows = await prisma.livro.findMany({ orderBy: { id: 'asc' } });
        return rows.map(row => Livro.fromJSON(row));
    }

    async findById(id) {
        const row = await prisma.livro.findUnique({ where: { id } });
        return row ? Livro.fromJSON(row) : null;
    }

    async create(livroData) {
        // Valida com Model primeiro
        const novoLivro = new Livro({ id: null, ...livroData });
        const row = await prisma.livro.create({
            data: {
                titulo: novoLivro.titulo,
                autor: novoLivro.autor,
                categoria: novoLivro.categoria,
                ano: novoLivro.ano,
            }
        });
        return Livro.fromJSON(row);
    }

    async update(id, dadosAtualizados) {
        const existente = await this.findById(id);
        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        const atualizado = new Livro({ ...existente.toJSON(), ...dadosAtualizados });
        const row = await prisma.livro.update({
            where: { id },
            data: {
                titulo: atualizado.titulo,
                autor: atualizado.autor,
                categoria: atualizado.categoria,
                ano: atualizado.ano,
            }
        });
        return Livro.fromJSON(row);
    }

    async delete(id) {
        const existente = await this.findById(id);
        if (!existente) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        await prisma.livro.delete({ where: { id } });
        return existente;
    }
}

module.exports = LivrosRepository;