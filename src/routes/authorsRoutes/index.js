const express = require("express");
const router = express.Router();
const { authorize, isAdmin } = require("../../middleware/validRoute");
const {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  searchAuthors,
} = require("../../controllers/Authors");

router.post("/api/createAuthor", isAdmin, createAuthor);
router.patch("/api/updateAuthor/?:id", isAdmin, updateAuthor);
router.delete("/api/deleteAuthor/?:id", isAdmin, deleteAuthor);

router.get(
  "/api/getAllAuthors?:page",
  authorize(["admin", "user"]),
  getAllAuthors
);
router.get(
  "/api/searchAuthors/:searchText/:page",
  authorize(["admin", "user"]),
  searchAuthors
);

module.exports = router;
