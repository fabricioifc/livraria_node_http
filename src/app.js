const app = require("./config/express");

// Inicializa o banco de dados (Sequelize)
const { sequelize } = require("./database");
const defineLivroModel = require("./models/livro.sequelize.model");
// Define modelos e sincroniza
defineLivroModel(sequelize, require('sequelize').DataTypes);
async function initDb() {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Banco de dados (Sequelize) inicializado');
}
// inicia de forma assíncrona, sem bloquear a exportação do app
initDb().catch(err => console.error('Erro ao inicializar DB:', err));

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