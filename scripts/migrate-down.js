const { sequelize } = require('../src/database');
const path = require('path');

async function run() {
  try {
    await sequelize.authenticate();
    const migration = require('../migrations/001-create-livros');
    await migration.down(sequelize);
    console.log('Migration down aplicada com sucesso');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao reverter migration:', err);
    process.exit(1);
  }
}

run();
