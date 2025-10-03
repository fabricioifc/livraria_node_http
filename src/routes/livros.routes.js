const express = require("express");
const router = express.Router();

// Base de dados em memória (array) - Livros de Informática
let livros = [
    { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", categoria: "Programação", ano: 2008 },
    { id: 2, titulo: "O Programador Pragmático", autor: "Andrew Hunt e David Thomas", categoria: "Programação", ano: 1999 },
    { id: 3, titulo: "Design Patterns", autor: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", categoria: "Programação", ano: 1994 },
];

/**
 * Listar livros e permitir filtrar por título ou categoria
 * Método: GET
 */
router.get("/", (req, res) => {
    const { titulo, categoria } = req.query;
    let resultados = livros;

    if (titulo) {
        resultados = resultados.filter(livro => livro.titulo.toLowerCase().includes(titulo.toLowerCase()));
    }

    if (categoria) {
        resultados = resultados.filter(livro => livro.categoria.toLowerCase() === categoria.toLowerCase());
    }

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

    livros.push(novoLivro);

    res.status(201).json({ mensagem: "Livro adicionado com sucesso", data: novoLivro }); // HTTP 201 Created
});

/**
 * Listar um livro pelo ID
 * Método: GET
 */
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const livro = livros.find(livro => livro.id === id);

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

    const livro = livros.find(livro => livro.id === id);
    if (!livro) {
        return res.status(404).json({ erro: "Livro não encontrado" }); // HTTP 404 Not Found
    }

    if (!titulo || !autor || !categoria || !ano) {
        return res.status(400).json({ erro: "Preencha todos os campos" }); // HTTP 400 Bad Request
    }

    livro.titulo = titulo;
    livro.autor = autor;
    livro.categoria = categoria;
    livro.ano = ano;

    res.status(200).json({ mensagem: "Livro atualizado com sucesso", data: livro }); // HTTP 200 OK
});

/**
 * Remover um livro pelo ID
 * Método: DELETE
 */
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = livros.findIndex(livro => livro.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Livro não encontrado" }); // HTTP 404 Not Found
    }

    const removido = livros.splice(index, 1);

    res.status(200).json({ mensagem: "Livro removido", data: removido[0] });
});

/**
 * Filtrar livros por categoria
 * Método: GET
 * Exemplo: /livros/categoria/Programação
 */
router.get("/categoria/:categoria", (req, res) => {
    const categoria = req.params.categoria;
    const livrosFiltrados = livros.filter(livro => livro.categoria.toLowerCase() === categoria.toLowerCase());

    res.status(200).json(livrosFiltrados); // HTTP 200 OK
});


module.exports = router;
