const express = require("express");
const router = express.Router();
const { authorize, isAdmin } = require("../../middleware/validRoute");
const {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  searchGenres,
} = require("../../controllers/Genres");

router.post("/api/createGenre", isAdmin, createGenre);
router.patch("/api/updateGenre/?:id", isAdmin, updateGenre);
router.patch("/api/deleteGenre/?:id", isAdmin, deleteGenre);

router.get("/api/getAllGenres?:ID", authorize(["admin", "user"]), getAllGenres);
router.get(
  "/api/searchGenres/:searchText/:page",
  authorize(["admin", "user"]),
  searchGenres
);

module.exports = router;
