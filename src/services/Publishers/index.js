const { Publisher } = require("../../models");
const sequelize = require("sequelize");

function allPublishers(param) {
  return Publisher.findAll({
    // attributes: ["name"],
    limit: param.limit,
    offset: param.offset,
    order: [["id", "ASC"]],
  });
}

function insertPublisher(param) {
  return Publisher.findOrCreate({
    where: { name: param.name },
    defaults: {
      name: param.name,
      genre_id: param.genre_id,
      founded_date: param.founded_date,
      city: param.city,
      country: param.country,
    },
  });
}

function updatePublisherData(param) {
  return Publisher.update(
    {
      name: param.body.name,
      genre_id: param.body.genre_id,
      founded_date: param.body.founded_date,
      city: param.body.city,
      country: param.body.country,
    },
    {
      where: { id: param.publisherId },
      returning: true,
    }
  );
}

function deletePublisherData(publisherId) {
  return Publisher.destroy({
    where: { id: publisherId },
  });
}

function searchPublishers(param) {
  return Publisher.findAll({
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
  allPublishers,
  insertPublisher,
  updatePublisherData,
  deletePublisherData,
  searchPublishers,
};
