const { sequelize, DataTypes } = require('../src/database');
const path = require('path');

async function run() {
  try {
    await sequelize.authenticate();
    const migration = require('../migrations/001-create-livros');
    await migration.up(sequelize, DataTypes);
    console.log('Migration up aplicada com sucesso');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao aplicar migration:', err);
    process.exit(1);
  }
}

run();
