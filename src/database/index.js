const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// Por compatibilidade com a implementação anterior usamos 'livraria.db' por padrão
const DB_FILE = process.env.SQLITE_DB_FILE || path.join(__dirname, '../data/livraria.sqlite');

// Inicializa o Sequelize apontando para um arquivo sqlite local
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_FILE,
  logging: false,
});

// Exporta a instância e utilitários
module.exports = { sequelize, DataTypes };
