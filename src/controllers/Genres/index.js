const {
  allGenre,
  insertGenre,
  updateGenreData,
  deleteGenreData,
  searchGenre,
} = require("../../services/Genre");
const isEmpty = require("../../middleware/checkEmptyFields");

const getAllGenres = async (req, res) => {
  try {
    const page = parseInt(req.params.ID) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const param = {
      limit,
      offset,
    };

    const genres = await allGenre(param);

    if (genres.length === 0) {
      return res.status(404).json({ error: "No more records to retrieve" });
    }
    return res.status(200).json({ genres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error Check Page Number" });
  }
};

const createGenre = async (req, res) => {
  const body = req.body;

  if (isEmpty(body)) {
    res
      .status(400)
      .json({ message: "Invalid or missing values in the request body" });
    return;
  }

  try {
    const [newGenre, created] = await insertGenre(body);

    if (created) {
      res
        .status(201)
        .json({ message: "Genre Inserted successfully", Genre: newGenre });
    } else {
      res
        .status(409)
        .json({ message: "Genre with the same Name already exists" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to Insert a Genre" });
  }
};

// Update Existing Author
const updateGenre = async (req, res) => {
  const genreId = req.params.id;
  const body = req.body;

  if (isEmpty(body) || !validateUUID(genreId)) {
    res
      .status(400)
      .json({ message: "Invalid or missing values in the request body" });
    return;
  }

  const param = { genreId, body };

  try {
    const [updatedCount, [updateGenre]] = await updateGenreData(param);

    if (updatedCount > 0) {
      res
        .status(200)
        .json({ message: "Genre updated successfully", Genre: updateGenre });
    } else {
      res.status(404).json({ message: "Genre not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the Genre" });
  }
};

// Delete a Author
const deleteGenre = async (req, res) => {
  const genreId = req.params.id;

  if (!validateUUID(genreId)) {
    res.status(400).json({ message: "Invalid book ID" });
    return;
  }

  try {
    const deletedCount = await deleteGenreData(genreId);

    if (deletedCount > 0) {
      res.status(200).json({ message: "Genre deleted successfully" });
    } else {
      res.status(404).json({ message: "Genre not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the Genre" });
  }
};

//   Genres By Search text
const searchGenres = async (req, res) => {
  try {
    const limit = 50;
    const page = req.params.page || 1;
    const offset = (page - 1) * limit;
    const searchText = req.params.searchText;

    if (!searchText) {
      return res.status(400).json({ message: "Search text is required." });
    }

    const param = {
      limit,
      offset,
      searchText,
    };

    const genres = await searchGenre(param);

    if (genres.length === 0) {
      return res
        .status(404)
        .json({ message: "No Genres found matching the search text." });
    }

    res.status(200).json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Genre." });
  }
};

module.exports = {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  searchGenres,
};
