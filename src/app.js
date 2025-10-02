const express = require("express");
const app = express();

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

// Rotas
const livrosRoutes = require("./routes/livros.routes");

/**
 * Rota inicial (explicação do sistema)
 * Método: GET
 * Exemplo: http://localhost:3000/
 */
app.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "Bem-vindo à API da Livraria! Use /livros para gerenciar os livros.",
        rotas: {
            listar_livros: "GET /livros",
            adicionar_livro: "POST /livros",
            obter_livro: "GET /livros/:id",
            atualizar_livro: "PUT /livros/:id",
            remover_livro: "DELETE /livros/:id",
            filtrar_por_categoria: "GET /livros/categoria/:categoria"
        }
    });
});
app.use("/livros", livrosRoutes);

// not found handler
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint não encontrado" }); // HTTP 404 Not Found
});



module.exports = app;