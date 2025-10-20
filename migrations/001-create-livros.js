// migration simples: criar/dropar tabela livros usando sequelize
module.exports = {
  up: async (sequelize, DataTypes) => {
    await sequelize.getQueryInterface().createTable('livros', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      titulo: { type: DataTypes.STRING, allowNull: false },
      autor: { type: DataTypes.STRING, allowNull: false },
      categoria: { type: DataTypes.STRING, allowNull: false },
      ano: { type: DataTypes.INTEGER, allowNull: false },
    });
  },
  down: async (sequelize) => {
    await sequelize.getQueryInterface().dropTable('livros');
  }
};
