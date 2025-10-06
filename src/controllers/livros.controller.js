const LivrosRepository = require("../repositories/livros.repository");

class LivrosController {
    constructor() {
        this.livrosRepository = new LivrosRepository();
    }

    // Listar todos os livros
    async listarLivros(req, res, next) {
        const livros = await this.livrosRepository.findAll();
        res.status(200).json(livros);
    }

    // Buscar livro por ID
    async buscarLivroPorId(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const livro = await this.livrosRepository.findById(id);
            if (!livro) {
                return res.status(404).json({ erro: "Livro não encontrado" });
            }
            res.status(200).json(livro);
        } catch (error) {
            next(error);
        }
    }

    // Criar novo livro
    async criarLivro(req, res, next) {
        try {
            const { titulo, autor, categoria, ano } = req.body;
            const novoLivro = await this.livrosRepository.create({
                titulo,
                autor,
                categoria,
                ano: parseInt(ano)
            });
            res.status(201).json({
                mensagem: "Livro criado com sucesso",
                data: novoLivro
            });
        } catch (error) {
            next(error);
        }
    }

    // Atualizar livro
    async atualizarLivro(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { titulo, autor, categoria, ano } = req.body;
            const livroAtualizado = await this.livrosRepository.update(id, {
                titulo,
                autor,
                categoria,
                ano: parseInt(ano)
            });

            res.status(200).json({
                mensagem: "Livro atualizado com sucesso",
                data: livroAtualizado
            });
        } catch (error) {
            next(error);
        }
    }

    // Remover livro
    async removerLivro(req, res, next) {
        const id = parseInt(req.params.id);
        const livroRemovido = await this.livrosRepository.delete(id);
        res.status(200).json({
            mensagem: "Livro removido com sucesso",
            data: livroRemovido
        });
    }
}

module.exports = LivrosController;