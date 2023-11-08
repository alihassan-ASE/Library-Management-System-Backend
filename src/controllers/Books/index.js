const { Books, Author, Publisher, Genre } = require("../../models");
const { v4: uuidv4, validate: validateUUID } = require("uuid");
const isEmpty = require("../../middleware/checkEmptyFields");
const {
  allBooks,
  insertBook,
  updateBookData,
  checkToDelete,
  deleteBookData,
  searchBook,
  booksCountforAuthor,
  booksCountForGenre,
  booksCountForPublisherAndGenre,
  booksPublishedAfterYear,
  booksPublishedBeforeYear,
  booksOfAuthor,
  booksOfPublisher,
  booksOfGenre,
  booksCountForPublisher,
} = require("../../services/Books/index");

// Get All Books
const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.params.ID) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;
    const para = {
      limit,
      offset,
    };

    const books = await allBooks(para);

    if (books.length === 0) {
      return res.status(404).json({ error: "No more records to retrieve" });
    }

    return res.status(200).json({ books });
  } catch (error) {
    console.error("Controller Get Books", error);
    res.status(500).json({ error: "Internal server error Check Page Number" });
  }
};

// Insert Books
const createBook = async (req, res) => {
  const body = req.body;

  if (
    isEmpty(body) ||
    !validateUUID(body.author_id) ||
    !validateUUID(body.publisher_id) ||
    !validateUUID(body.genre_id)
  ) {
    res
      .status(400)
      .json({ message: "Invalid or missing values in the request body" });
    return;
  }

  try {
    const [newBook, created] = await insertBook(body);

    if (created) {
      res
        .status(201)
        .json({ message: "Book created successfully", book: newBook });
    } else {
      res
        .status(409)
        .json({ message: "Book with the same ISBN already exists" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a book" });
  }
};

// Update Existing Book
const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const body = req.body;
  // const { title, author_id, publisher_id, genre_id, publication_year, ISBN } =
  //   req.body;

  if (
    isEmpty(body) ||
    !validateUUID(bookId) ||
    !validateUUID(body.author_id) ||
    !validateUUID(body.publisher_id) ||
    !validateUUID(genre_id)
  ) {
    res.status(400).json({ message: "Invalid book ID" });
    return;
  }
  const param = { bookId, body };

  try {
    const [updatedCount, [updatedBook]] = await updateBookData(param);

    if (updatedCount > 0) {
      res
        .status(200)
        .json({ message: "Book updated successfully", book: updatedBook });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the book" });
  }
};

// Delete a Book
const deleteBook = async (req, res) => {
  const bookId = req.params.id;

  if (!validateUUID(bookId)) {
    res.status(400).json({ message: "Invalid book ID" });
    return;
  }

  try {
    const deletedCount = await deleteBookData(bookId);

    if (deletedCount > 0) {
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the book" });
  }
};

// Search Book By Title/Books Name
const searchBooks = async (req, res) => {
  try {
    const limit = 50;
    const page = req.params.page || 1;
    const offset = (page - 1) * limit;
    const searchText = req.params.searchText;

    const param = {
      limit,
      offset,
      searchText,
    };

    if (!searchText) {
      return res.status(400).json({ message: "Search text is required." });
    }

    const books = await searchBook(param);

    if (books.length === 0) {
      return res
        .status(404)
        .json({ message: "No Books found matching the search text." });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books." });
  }
};

// Books Count By Author/Authors
const getBooksCountByAuthors = async (req, res) => {
  try {
    let authorIds = [];

    if (req.body && req.body.authors && Array.isArray(req.body.authors)) {
      authorIds = req.body.authors;
    } else if (req.body && !req.body.authors && Array.isArray(req.body)) {
      authorIds = req.body;
    } else {
      res.status(400).json({ message: "Invalid Format" });
      return;
    }

    const results = await booksCountforAuthor(authorIds);

    const finalResults = authorIds.map((id) => {
      const result = results.find((row) => row.author_id === id);

      return {
        authorId: id,
        bookCount: result ? result.bookCount : 0,
      };
    });

    finalResults.sort((a, b) => a.bookCount - b.bookCount);

    res.status(200).json({
      message: "Books Count for given Authors are",
      results: finalResults,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch books count by authors" });
  }
};

// Books By Genre / Genres
const getBooksCountByGenres = async (req, res) => {
  try {
    let genreIds = [];

    if (req.body && req.body.genres && Array.isArray(req.body.genres)) {
      genreIds = req.body.genres;
    } else if (req.body && !req.body.genres && Array.isArray(req.body)) {
      genreIds = req.body;
    } else {
      res.status(400).json({ message: "Invalid Format" });
      return;
    }

    const results = await booksCountForGenre(genreIds);

    const finalResults = genreIds.map((id) => {
      const result = results.find((row) => row.genre_id === id);

      return {
        genreId: id,
        bookCount: result ? result.bookCount : 0,
      };
    });

    finalResults.sort((a, b) => a.bookCount - b.bookCount);

    res.status(200).json({
      message: "Books Count for given Genres are",
      results: finalResults,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch books count by genres" });
  }
};

// Books By Publishers/Publisher
const getBooksCountByPublishers = async (req, res) => {
  try {
    let publishersIds = [];

    if (req.body && req.body.publishers && Array.isArray(req.body.publishers)) {
      publishersIds = req.body.publishers;
    } else if (req.body && !req.body.publishers && Array.isArray(req.body)) {
      publishersIds = req.body;
    } else {
      res.status(400).json({ message: "Invalid Format" });
      return;
    }

    const results = await booksCountForPublisher(publishersIds);

    const finalResults = publishersIds.map((id) => {
      const result = results.find((row) => row.publisher_id === id);

      return {
        publisherId: id,
        bookCount: result ? result.bookCount : 0,
      };
    });

    finalResults.sort((a, b) => a.bookCount - b.bookCount);

    res.status(200).json({
      message: "Books Count for given Publishers are",
      results: finalResults,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch books count by publisher" });
  }
};

//   Books by Publihser using it Own Genre
const getBooksCountByPublishersAndGenre = async (req, res) => {
  try {
    let publisherNames = [];

    if (req.body && req.body.publishers && Array.isArray(req.body.publishers)) {
      publisherNames = req.body.publishers;
    } else if (req.body && !req.body.publishers && Array.isArray(req.body)) {
      publisherNames = req.body;
    } else {
      res.status(400).json({ message: "Invalid Format" });
      return;
    }
    const publisherCounts =
      await booksCountForPublisherAndGenre(publisherNames);

    res.status(200).json({
      message: "Books Count for specified publishers and genres are",
      counts: publisherCounts,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch book count by publishers and genres" });
  }
};

//   Books After Year
const getBooksPublishedAfterYear = async (req, res) => {
  try {
    const year = req.params.year;

    if (!year || isNaN(year)) {
      return res.status(400).json({
        message: "Invalid year parameter. Please provide a valid year.",
      });
    }

    const page = req.params.page || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const param = {
      limit,
      offset,
      year,
    };

    const { rows: books, count: totalBooks } =
      await booksPublishedAfterYear(param);

    const remainingBooks = (totalBooks - page) * limit;

    res.status(200).json({
      totalBooks,
      pageNumber: page,
      booksPerPage: limit,
      remainingBooks,
      books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

//   Books Before Year
const getBooksPublishedBeforeYear = async (req, res) => {
  try {
    const year = req.params.year;

    if (!year || isNaN(year)) {
      return res.status(400).json({
        message: "Invalid year parameter. Please provide a valid year.",
      });
    }

    const page = req.params.page || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const param = {
      limit,
      offset,
      year,
    };
    const { rows: books, count: totalBooks } =
      await booksPublishedBeforeYear(param);

    const remainingBooks = (totalBooks - page) * limit;

    res.status(200).json({
      totalBooks,
      pageNumber: page,
      booksPerPage: limit,
      remainingBooks,
      books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Books of Authors
const getBooksByAuthorName = async (req, res) => {
  const authorId = req.params.id;
  const page = parseInt(req.params.page) || 1;

  if (!authorId || isNaN(page)) {
    res.status(400).json({ message: "Invalid parameters provided." });
    return;
  }

  const limit = 50;
  const offset = (page - 1) * limit;

  const param = {
    limit,
    offset,
    authorId,
  };
  try {
    const { count, rows } = await booksOfAuthor(param);

    if (count === 0) {
      res.status(404).json({ message: `No data found for ${authorId}` });
    } else {
      res.status(200).json({
        message: `Total number of books for ${authorId} is ${count}`,
        rows,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the request." });
  }
};

// Books of Genres
const getBooksByGenreName = async (req, res) => {
  const genreId = req.params.id;
  const page = parseInt(req.params.page);

  if (!genreId || isNaN(page)) {
    res.status(400).json({ message: "Invalid parameters provided." });
    return;
  }

  const limit = 50;
  const offset = (page - 1) * limit;

  const param = {
    limit,
    offset,
    genreId,
  };
  try {
    const { count, rows } = await booksOfGenre(param);

    if (count === 0) {
      res.status(404).json({ message: `No data found for ${genreId}` });
    } else {
      res.status(200).json({
        message: `Total number of books for ${genreId} is ${count}`,
        rows,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the request." });
  }
};

// Books of Publishers
const getBooksByPublisherName = async (req, res) => {
  const publisherId = req.params.id;
  const page = parseInt(req.params.page);

  if (!publisherId || isNaN(page)) {
    res.status(400).json({ message: "Invalid parameters provided." });
    return;
  }

  const limit = 50;
  const offset = (page - 1) * limit;
  const param = {
    limit,
    offset,
    publisherId,
  };

  try {
    const { count, rows } = await booksOfPublisher(param);

    if (count === 0) {
      res.status(404).json({ message: `No data found for ${publisherId}` });
    } else {
      res.status(200).json({
        message: `Total number of books for ${publisherId} is ${count}`,
        rows,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the request." });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getBooksCountByAuthors,
  getBooksCountByGenres,
  getBooksCountByPublishers,
  getBooksCountByPublishersAndGenre,
  getBooksPublishedAfterYear,
  getBooksPublishedBeforeYear,
  getBooksByAuthorName,
  getBooksByGenreName,
  getBooksByPublisherName,
};
