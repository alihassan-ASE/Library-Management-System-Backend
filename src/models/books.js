'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    static associate(models) {
      Books.belongsTo(models.Author, { foreignKey: 'author_id' });
      Books.belongsTo(models.Publisher, { foreignKey: 'publisher_id' });
      Books.belongsTo(models.Genre, { foreignKey: 'genre_id' });
    }
  }
  Books.init({
    title: DataTypes.STRING,
    author_id: DataTypes.UUID,
    publisher_id: DataTypes.UUID,
    genre_id: DataTypes.UUID,
    publication_year: DataTypes.INTEGER,
    ISBN: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Books',
    tableName: 'Books',
    timestamps: false,
  });
  
  return Books;
};
