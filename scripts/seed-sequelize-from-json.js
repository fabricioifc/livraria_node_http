/*
 Script de seed que popula a tabela 'livros' usando Sequelize e o modelo definido.
 Uso: node scripts/seed-sequelize-from-json.js
*/

const path = require('path');
const fs = require('fs');

const { sequelize, DataTypes } = require('../src/database');
const defineLivroModel = require('../src/models/livro.sequelize.model');

async function run() {
  try {
    const LivroModel = defineLivroModel(sequelize, DataTypes);
    // garante que a tabela existe
    await sequelize.authenticate();
    await sequelize.sync();

    const dataPath = path.join(__dirname, '../src/data/livros.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const livros = JSON.parse(raw);

    // Remove todos e insere os do JSON (opcional: confirme antes de usar em produção)
    await LivroModel.destroy({ where: {} });
    for (const l of livros) {
      // Desconsidera id do JSON para não forçar PK, deixa autoIncrement
      const { titulo, autor, categoria, ano } = l;
      await LivroModel.create({ titulo, autor, categoria, ano });
    }

    console.log('Seed concluído com sucesso');
    process.exit(0);
  } catch (err) {
    console.error('Erro no seed:', err);
    process.exit(1);
  }
}

run();
