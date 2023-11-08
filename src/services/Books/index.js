const { Books, Author, Publisher, Genre } = require("../../models");
const sequelize = require("sequelize");

function allBooks(para) {
  return Books.findAll({
    // attributes: ["id"],
    limit: para.limit,
    offset: para.offset,
    // order: [["title", "ASC"]],
  });
}

function insertBook(param) {
  return Books.findOrCreate({
    where: { ISBN: param.ISBN },
    defaults: {
      title: param.title,
      author_id: param.author_id,
      publisher_id: param.publisher_id,
      genre_id: param.genre_id,
      publication_year: param.publication_year,
      ISBN: param.ISBN,
    },
  });
}

function updateBookData(param) {
  return Books.update(
    {
      title: param.body.title,
      author_id: param.body.author_id,
      publisher_id: param.body.publisher_id,
      genre_id: param.body.genre_id,
      publication_year: param.body.publication_year,
      ISBN: param.body.ISBN,
    },
    {
      where: { id: param.bookId },
      returning: true,
    }
  );
}

function deleteBookData(bookId) {
  return Books.destroy({
    where: { id: bookId },
  });
}

function searchBook(param) {
  return Books.findAll({
    where: {
      [sequelize.Op.or]: [
        { title: { [sequelize.Op.iLike]: `%${param.searchText}%` } },
      ],
    },
    limit: param.limit,
    offset: param.offset,
  });
}

function booksCountforAuthor(authorId) {
  return Books.findAll({
    attributes: [
      "author_id",
      [sequelize.fn("COUNT", sequelize.col("author_id")), "bookCount"],
    ],
    where: {
      author_id: {
        [sequelize.Op.in]: authorId,
      },
    },
    group: ["author_id"],
    raw: true,
  });
}

function booksCountForGenre(genreId) {
  return Books.findAll({
    attributes: [
      "genre_id",
      [sequelize.fn("COUNT", sequelize.col("genre_id")), "bookCount"],
    ],
    where: {
      genre_id: {
        [sequelize.Op.in]: genreId,
      },
    },
    group: ["genre_id"],
    raw: true,
  });
}

function booksCountForPublisher(publisherId) {
  return Books.findAll({
    attributes: [
      "publisher_id",
      [sequelize.fn("COUNT", sequelize.col("publisher_id")), "bookCount"],
    ],
    where: {
      publisher_id: {
        [sequelize.Op.in]: publisherId,
      },
    },
    group: ["publisher_id"],
    raw: true,
  });
}

function booksCountForPublisherAndGenre(publisherId) {
  return Books.findAll({
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("Books.id")), "count"],
      [sequelize.col("Publisher.id"), "Publisher.id"],
      [sequelize.col("Publisher.genre_id"), "Publisher.genre_id"],
    ],
    include: {
      model: Publisher,
      as: "Publisher",
      where: {
        id: publisherId,
      },
      attributes: ["id", "name"],
    },
    group: ["Publisher.id", "Publisher.genre_id"],
  });
}

function booksPublishedAfterYear(param) {
  return Books.findAndCountAll({
    where: {
      publication_year: {
        [sequelize.Op.gte]: param.year,
      },
    },
    limit: param.limit,
    offset: param.offset,
  });
}

function booksPublishedBeforeYear(param) {
  return Books.findAndCountAll({
    where: {
      publication_year: {
        [sequelize.Op.lt]: param.year,
      },
    },
    limit: param.limit,
    offset: param.offset,
  });
}

function booksOfAuthor(param) {
  return Books.findAndCountAll({
    where: {
      author_id: {
        [sequelize.Op.in]: [param.authorId],
      },
    },
    limit: param.limit,
    offset: param.offset,
    order: [["ISBN", "ASC"]],
  });
}

function booksOfGenre(param) {
  return Books.findAndCountAll({
    where: {
      genre_id: {
        [sequelize.Op.in]: [param.genreId],
      },
    },
    limit: param.limit,
    offset: param.offset,
    order: [["ISBN", "ASC"]],
  });
}

function booksOfPublisher(param) {
  return Books.findAndCountAll({
    where: {
      publisher_id: {
        [sequelize.Op.in]: [param.publisherId],
      },
    },
    limit: param.limit,
    offset: param.offset,
    order: [["ISBN", "ASC"]],
  });
}

module.exports = {
  allBooks,
  insertBook,
  updateBookData,
  deleteBookData,
  searchBook,
  booksCountforAuthor,
  booksCountForGenre,
  booksCountForPublisher,
  booksCountForPublisherAndGenre,
  booksPublishedAfterYear,
  booksPublishedBeforeYear,
  booksOfAuthor,
  booksOfPublisher,
  booksOfGenre,
};
