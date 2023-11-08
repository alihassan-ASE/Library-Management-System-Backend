'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      Author.hasMany(models.Books, { foreignKey: 'author_id' });
    }
  }
  Author.init({
    name: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    country: DataTypes.STRING,
    biography: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Author',
    tableName: 'Author',
    timestamps: false,
  });
  return Author;
};
