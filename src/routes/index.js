// todas as rotas aqui
const express = require("express");
const router = express.Router();

// Rotas de livros
const livrosRoutes = require("./livros.routes");

// Rota inicial (explicação do sistema)
router.get("/", (req, res) => {
    const response = {
        mensagem: "Bem-vindo à API da Livraria! Use /livros para gerenciar os livros.",
        rotas: {
            listar_livros: "GET /livros",
            adicionar_livro: "POST /livros"
        }
    };

    res.status(200).json(response);
});

// Usa as rotas de livros
router.use("/livros", livrosRoutes);


module.exports = router;