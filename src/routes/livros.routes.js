const express = require("express");
const router = express.Router();
const livrosController = require("../controllers/livros.controller");

/**
 * Listar livros e permitir filtrar por título ou categoria
 * Método: GET
 */
router.get("/", (req, res) => {
    let resultados = livrosController.lerLivros();
    res.status(200).json(resultados); // HTTP 200 OK
});

/**
 * Adicionar um novo livro
 * Método: POST
 */
router.post("/", (req, res) => {
    const { titulo, autor, categoria, ano } = req.body;

    if (!titulo || !autor || !categoria || !ano) {
        return res.status(400).json({ erro: "Preencha todos os campos" }); // HTTP 400 Bad Request
    }

    const novoLivro = {
        id: livros.length + 1,
        titulo,
        autor,
        categoria,
        ano
    };

    livrosController.cadastrarLivro(novoLivro);

    res.status(201).json({ mensagem: "Livro adicionado com sucesso", data: novoLivro }); // HTTP 201 Created
});

/**
 * Listar um livro pelo ID
 * Método: GET
 */
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const livro = livrosController.lerLivrosPorId(id);

    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" }); // HTTP 404 Not Found
    }

    res.status(200).json(livro); // HTTP 200 OK
});

/**
 * Atualizar um livro pelo ID
 * Método: PUT
 */
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, autor, categoria, ano } = req.body;

    const livro = livrosController.lerLivrosPorId(id);
    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" }); // HTTP 404 Not Found
    }

    if (!titulo || !autor || !categoria || !ano) {
        return res.status(400).json({ erro: "Preencha todos os campos" }); // HTTP 400 Bad Request
    }

    const dadosAtualizados = { titulo, autor, categoria, ano };
    livrosController.atualizarLivro(id, dadosAtualizados);
    res.status(200).json({ mensagem: "Livro atualizado com sucesso", data: dadosAtualizados }); // HTTP 200 OK
});

/**
 * Remover um livro pelo ID
 * Método: DELETE
 */
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const livro = livrosController.lerLivrosPorId(id);
    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" }); // HTTP 404 Not Found
    }

    livrosController.removerLivro(id);

    res.status(200).json({ mensagem: "Livro removido com sucesso", data: livro }); // HTTP 200 OK
});

module.exports = router;
