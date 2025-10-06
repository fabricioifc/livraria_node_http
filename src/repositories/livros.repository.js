// src/repositories/livros.repository.js
const fs = require("fs");
const path = require("path");
const RepositoryBase = require("./repository.interface");

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
        this.caminhoArquivo = path.join(__dirname, "../data/livros.json");
    }

    async findAll() {
        const dados = await this._lerArquivo();
        return JSON.parse(dados);
    }

    async findById(id) {
        const livros = await this.findAll();
        return livros.find(livro => livro.id === id);
    }

    async create(livroData) {
        const livros = await this.findAll();

        // Gera novo ID baseado no maior ID existente
        const novoId = await this.getNextId();
        const novoLivro = { id: novoId, ...livroData };

        livros.push(novoLivro);
        await this._saveToFile(livros);

        return novoLivro;
    }

    async update(id, dadosAtualizados) {
        const livros = await this.findAll();
        const indice = livros.findIndex(livro => livro.id === id);

        if (indice === -1) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }

        livros[indice] = { ...livros[indice], ...dadosAtualizados };
        await this._saveToFile(livros);

        return livros[indice];
    }

    async delete(id) {
        const livros = await this.findAll();
        const indice = livros.findIndex(livro => livro.id === id);

        if (indice === -1) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }

        const livroRemovido = livros[indice];
        livros.splice(indice, 1);
        await this._saveToFile(livros);

        return livroRemovido;
    }

    /**
     * Salva a lista de livros no arquivo JSON.
     * @param {Array<Object>} data 
     * @author Professor
     */
    async _saveToFile(data) {
        try {
            fs.writeFileSync(this.caminhoArquivo, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            throw new Error(`Erro ao salvar arquivo de livros: ${error.message}`);
        }
    }

    /**
     * Lê o arquivo e retorna seu conteúdo.
     * @returns {Promise<string>}
     * @author Professor
     */
    async _lerArquivo() {
        try {
            return await fs.promises.readFile(this.caminhoArquivo, 'utf8');
        } catch (error) {
            throw new Error(`Erro ao ler arquivo de livros: ${error.message}`);
        }
    }

}

module.exports = LivrosRepository;