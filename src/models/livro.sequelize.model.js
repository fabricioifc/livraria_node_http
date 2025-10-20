// Definição do modelo Sequelize para 'Livro'
module.exports = (sequelize, DataTypes) => {
  const Livro = sequelize.define('Livro', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Título é obrigatório' }
      }
    },
    autor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Autor é obrigatório' }
      }
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Categoria é obrigatória' }
      }
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Ano deve ser um número válido' }
      }
    },
  }, {
    tableName: 'livros',
    timestamps: false,
  });

  return Livro;
};
