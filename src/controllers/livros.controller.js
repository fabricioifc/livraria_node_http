const fs = require("fs");
const path = require("path");

class LivrosController {
    constructor() {
        this.caminhoArquivo = path.join(__dirname, "../data/livros.json");
    }

    // ============= MÉTODOS PRIVADOS DE ACESSO A DADOS =============

    async _findAll() {
        const dados = await this._lerArquivo();
        return JSON.parse(dados);
    }

    async _findById(id) {
        const livros = await this._findAll();
        return livros.find(livro => livro.id === id);
    }

    async _create(livroData) {
        const livros = await this._findAll();

        // Gera novo ID baseado no maior ID existente
        const novoId = await this._getNextId();
        const novoLivro = { id: novoId, ...livroData };

        livros.push(novoLivro);
        await this._salvarArquivo(livros);

        return novoLivro;
    }

    async _update(id, dadosAtualizados) {
        const livros = await this._findAll();
        const indice = livros.findIndex(livro => livro.id === id);

        if (indice === -1) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }

        livros[indice] = { ...livros[indice], ...dadosAtualizados };
        await this._salvarArquivo(livros);

        return livros[indice];
    }

    async _delete(id) {
        const livros = await this._findAll();
        const indice = livros.findIndex(livro => livro.id === id);

        if (indice === -1) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }

        const livroRemovido = livros[indice];
        livros.splice(indice, 1);
        await this._salvarArquivo(livros);

        return livroRemovido;
    }

    async _getNextId() {
        const livros = await this._findAll();
        if (livros.length === 0) return 1;
        return Math.max(...livros.map(livro => livro.id)) + 1;
    }

    async _salvarArquivo(data) {
        try {
            fs.writeFileSync(this.caminhoArquivo, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            throw new Error(`Erro ao salvar arquivo de livros: ${error.message}`);
        }
    }

    async _lerArquivo() {
        try {
            return await fs.promises.readFile(this.caminhoArquivo, 'utf8');
        } catch (error) {
            throw new Error(`Erro ao ler arquivo de livros: ${error.message}`);
        }
    }

    async listarLivros(req, res, next) {
        const livros = await this._findAll();
        res.status(200).json(livros);
    }

    async buscarLivroPorId(req, res, next) {
        const id = parseInt(req.params.id);
        const livro = await this._findById(id);
        if (!livro) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }
        res.status(200).json(livro);
    }

    async criarLivro(req, res, next) {
        const { titulo, autor, categoria, ano } = req.body;
        const novoLivro = await this._create({
            titulo,
            autor,
            categoria,
            ano: parseInt(ano)
        });
        res.status(201).json({
            mensagem: "Livro criado com sucesso",
            data: novoLivro
        });
    }

    async atualizarLivro(req, res, next) {
        const id = parseInt(req.params.id);
        const { titulo, autor, categoria, ano } = req.body;
        const livroAtualizado = await this._update(id, {
            titulo,
            autor,
            categoria,
            ano: parseInt(ano)
        });

        res.status(200).json({
            mensagem: "Livro atualizado com sucesso",
            data: livroAtualizado
        });
    }

    async removerLivro(req, res, next) {
        const id = parseInt(req.params.id);
        const livroRemovido = await this._delete(id);
        res.status(200).json({
            mensagem: "Livro removido com sucesso",
            data: livroRemovido
        });
    }


}

module.exports = LivrosController;