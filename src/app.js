const express = require("express");
const app = express();

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

// Base de dados em memória (array) - Livros de Informática
let livros = [
    { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", categoria: "Programação", ano: 2008 },
    { id: 2, titulo: "O Programador Pragmático", autor: "Andrew Hunt e David Thomas", categoria: "Programação", ano: 1999 },
    { id: 3, titulo: "Design Patterns", autor: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", categoria: "Programação", ano: 1994 },
];

/**
 * Rota inicial (explicação do sistema)
 * Método: GET
 * Exemplo: http://localhost:3000/
 */
app.get("/", (req, res) => {
    res.send(`
        <h1>Biblioteca Online</h1>
        <p>Use os endpoints:</p>
        <ul>
            <li>GET /livros → lista os livros</li>
            <li>POST /livros → adiciona um livro (JSON: {titulo, autor})</li>
            <li>DELETE /livros/:id → remove livro pelo id</li>
        </ul>
    `);
});

/**
 * Listar livros
 * Método: GET
 */
app.get("/livros", (req, res) => {
    res.status(200).json(livros); // HTTP 200 OK
});

/**
 * Adicionar um novo livro
 * Método: POST
 */
app.post("/livros", (req, res) => {
    const { titulo, autor, categoria, ano } = req.body;

    if (!titulo || !autor, !categoria || !ano) {
        return res.status(400).json({ erro: "Preencha todos os campos" }); // HTTP 400 Bad Request
    }

    const novoLivro = {
        id: livros.length + 1,
        titulo,
        autor
    };

    livros.push(novoLivro);

    res.status(201).json({ mensagem: "Livro adicionado com sucesso", livro: novoLivro }); // HTTP 201 Created
});

/**
 * Listar um livro pelo ID
 * Método: GET
 */
app.get("/livros/:id", (req, res) => {
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
app.put("/livros/:id", (req, res) => {
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

    res.status(200).json({ mensagem: "Livro atualizado com sucesso", livro }); // HTTP 200 OK
});

/**
 * Remover um livro pelo ID
 * Método: DELETE
 */
app.delete("/livros/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = livros.findIndex(livro => livro.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Livro não encontrado" }); // HTTP 404 Not Found
    }

    const removido = livros.splice(index, 1);
    res.status(200).json({ mensagem: "Livro removido", livro: removido[0] });
});

module.exports = app;