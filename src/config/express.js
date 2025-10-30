const express = require("express");
const morgan = require("morgan");
const session = require("express-session");

const app = express();

app.use(express.json()); // Middleware para interpretar JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Suporte para dados de formulários
app.use(morgan("common")); // Logging HTTP

app.use(session({
    secret: process.env.SESSION_SECRET || "livraria_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // true apenas em produção HTTPS
        maxAge: 1000 * 60 * 60 * 2 // 2 horas
    }
}));

module.exports = app;