'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.hasMany(models.Books, { foreignKey: 'genre_id' });
      Genre.hasMany(models.Publisher, { foreignKey: 'genre_id' });
    }
  }
  Genre.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Genre',
    tableName: 'Genre',
    timestamps: false,
  });
  return Genre;
};
