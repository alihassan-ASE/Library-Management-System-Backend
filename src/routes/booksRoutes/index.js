const express = require("express");
const router = express.Router();
const { authorize, isAdmin } = require("../../middleware/validRoute");

const {
  getAllBooks,
  createBook,
  updateBook,
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
  deleteBook,
} = require("../../controllers/Books");

router.post("/api/createBook", isAdmin, createBook);
router.patch("/api/updateBook/?:id", isAdmin, updateBook);
router.delete("/api/deleteBook/?:id", isAdmin, deleteBook);

router.get("/api/getAllBooks?:ID", authorize(["admin", "user"]), getAllBooks);
router.get(
  "/api/searchBooks/:searchText/:page",
  authorize(["admin", "user"]),
  searchBooks
);
router.get(
  "/api/getBooksCountByAuthors",
  authorize(["admin", "user"]),
  getBooksCountByAuthors
);
router.get(
  "/api/getBooksCountByGenres",
  authorize(["admin", "user"]),
  getBooksCountByGenres
);
router.get(
  "/api/getBooksCountByPublishers",
  authorize(["admin", "user"]),
  getBooksCountByPublishers
);
router.get(
  "/api/getBooksCountByPublishersAndGenre",
  authorize(["admin", "user"]),
  getBooksCountByPublishersAndGenre
);
router.get(
  "/api/admin/getBooksPublishedAfterYear/:year/:page",
  authorize(["admin", "user"]),
  getBooksPublishedAfterYear
);
router.get(
  "/api/admin/getBooksPublishedBeforeYear/:year/:page",
  authorize(["admin", "user"]),
  getBooksPublishedBeforeYear
);
router.get(
  "/getBooksOfAuthor/:id/:page",
  authorize(["admin", "user"]),
  getBooksByAuthorName
);
router.get(
  "/getBooksOfGenre/:id/:page",
  authorize(["admin", "user"]),
  getBooksByGenreName
);
router.get(
  "/getBooksOfpublisher/:id/:page",
  authorize(["admin", "user"]),
  getBooksByPublisherName
);

module.exports = router;
