const { Author } = require("../../models");
const sequelize = require("sequelize");

function allAuthors(param) {
  return Author.findAll({
    // attributes: ["name"],
    limit: param.limit,
    offset: param.offset,
    order: [["id", "ASC"]],
  });
}

function insertAuthor(param) {
  return Author.findOrCreate({
    where: { name: param.name },
    defaults: {
      name: param.name,
      birth_date: param.birth_date,
      country: param.country,
      biography: param.biography,
    },
  });
}

function updateAuthorData(param) {
  return Author.update(
    {
      name: param.body.name,
      birth_date: param.body.birth_date,
      country: param.body.country,
      biography: param.body.biography,
    },
    {
      where: { id: param.authorId },
      returning: true,
    }
  );
}

function deleteAuthorData(authorId) {
  return Author.destroy({
    where: { id: authorId },
  });
}

function searchAuthor(param) {
  return Author.findAll({
    where: {
      [sequelize.Op.or]: [
        { name: { [sequelize.Op.iLike]: `%${param.searchText}%` } },
      ],
    },
    limit: param.limit,
    offset: param.offset,
  });
}

module.exports = {
  allAuthors,
  searchAuthor,
  updateAuthorData,
  deleteAuthorData,
  insertAuthor,
};
