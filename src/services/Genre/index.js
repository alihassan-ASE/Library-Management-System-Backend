const { Genre } = require("../../models");
const sequelize = require("sequelize");

function allGenre(param) {
  return Genre.findAll({
    // attributes: ["name"],
    limit: param.limit,
    offset: param.offset,
    order: [["id", "ASC"]],
  });
}

function insertGenre(param) {
  return Genre.findOrCreate({
    where: { name: param.name },
    defaults: {
      name: param.name,
    },
  });
}

function updateGenreData(param) {
  return Genre.update(
    {
      name: param.body.name,
    },
    {
      where: { id: param.genreId },
      returning: true,
    }
  );
}

function deleteGenreData(genreId) {
  return Genre.destroy({
    where: { id: genreId },
  });
}

function searchGenre(param) {
  return Genre.findAll({
    where: {
      [sequelize.Op.or]: [
        { name: { [sequelize.Op.iLike]: `%${searchText}%` } },
      ],
    },
    limit: limit,
    offset: offset,
  });
}

module.exports = {
  allGenre,
  insertGenre,
  updateGenreData,
  deleteGenreData,
  searchGenre,
};
