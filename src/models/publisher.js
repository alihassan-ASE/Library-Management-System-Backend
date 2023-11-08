'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publisher extends Model {
    static associate(models) {
      Publisher.hasMany(models.Books, { foreignKey: 'publisher_id' });
    }
  }
  Publisher.init({
    name: DataTypes.STRING,
    genre_id: DataTypes.UUID,
    founded_date: DataTypes.DATE,
    city: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Publisher',
    tableName: 'Publisher',
    timestamps: false,
  });
  return Publisher;
};
