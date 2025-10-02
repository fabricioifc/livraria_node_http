const express = require("express");
const app = express();

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json()); // Middleware para interpretar JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Adicionado para suportar dados de formulários

// Rotas
const livrosRoutes = require("./routes/livros.routes");

// Middleware de logging simples
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.originalUrl}`);
    next();
});

app.get("/", (req, res) => {
    const response = {
        mensagem: "Bem-vindo à API da Livraria! Use /livros para gerenciar os livros.",
        rotas: {
            listar_livros: "GET /livros",
            adicionar_livro: "POST /livros",
            obter_livro: "GET /livros/:id",
            atualizar_livro: "PUT /livros/:id",
            remover_livro: "DELETE /livros/:id",
            filtrar_por_categoria: "GET /livros/categoria/:categoria"
        }
    };

    res.status(200).json(response);
});
app.use("/livros", livrosRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro capturado:', err.message);

    if (process.env.NODE_ENV === 'development') {
        // Em desenvolvimento: retorna detalhes completos do erro
        res.status(500).json({
            erro: "Erro interno do servidor",
            mensagem: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });
    } else {
        // Em produção: retorna apenas mensagem genérica
        res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
});

// not found handler
app.use((req, res) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`❓ Endpoint não encontrado: ${req.method} ${req.originalUrl}`);
    }
    res.status(404).json({ erro: "Endpoint não encontrado" }); // HTTP 404 Not Found
});

module.exports = app;