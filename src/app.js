const app = require("./config/express");
const { init: initDb } = require('./database/sqlite');
// Inicializa o banco SQLite (schema + seed opcional). Não bloqueia o servidor se falhar
initDb().then(() => {
    if (process.env.NODE_ENV === 'development') {
        console.log('SQLite inicializado.');
    }
}).catch((e) => {
    console.error('Falha ao inicializar SQLite:', e.message);
});
// Todas as rotas da aplicação
const routes = require("./routes");
// Configura o middleware de tratamento de erros
const errorHandler = require("./middlewares/errorHandler");

// Configura as rotas
app.use("/api", routes);

app.use(errorHandler);

// Handler para rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).json({ erro: "Endpoint não encontrado" });
});


module.exports = app;