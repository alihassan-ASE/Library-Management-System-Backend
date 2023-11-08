const { v4: uuidv4, validate: validateUUID } = require("uuid");
const isEmpty = require("../../middleware/checkEmptyFields");
const {
  allAuthors,
  insertAuthor,
  updateAuthorData,
  deleteAuthorData,
  searchAuthor,
} = require("../../services/Authors");

// Get All Authors
const getAllAuthors = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;
    const param = {
      limit,
      offset,
    };
    const authors = await allAuthors(param);

    if (authors.length === 0) {
      return res.status(404).json({ error: "No more records to retrieve" });
    }

    return res.status(200).json({ authors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error Check Page Number" });
  }
};

function isValidDate(dateString) {
  return !isNaN(new Date(dateString).getTime());
}

// Insert Author
const createAuthor = async (req, res) => {
  const body = req.body;
  // const { name, birth_date, country, biography } = req.body;

  if (isEmpty(body) || !isValidDate(body.birth_date)) {
    res
      .status(400)
      .json({ message: "Invalid or missing values in the request body" });
    return;
  }

  try {
    const [newAuthor, created] = await insertAuthor(body);

    if (created) {
      res
        .status(201)
        .json({ message: "Author Inserted successfully", Author: newAuthor });
    } else {
      res
        .status(409)
        .json({ message: "Author with the same Name already exists" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to Insert a Author" });
  }
};

// Update Existing Author
const updateAuthor = async (req, res) => {
  const authorId = req.params.id;
  const body = req.body;
  // const { name, birth_date, country, biography } = req.body;

  if (isEmpty(body) || !validateUUID(authorId) || !isValidDate(birth_date)) {
    res
      .status(400)
      .json({ message: "Invalid or missing values in the request body" });
    return;
  }
  const param = { authorId, body };

  try {
    const [updatedCount, [updateAuthor]] = await updateAuthorData(param);

    if (updatedCount > 0) {
      res
        .status(200)
        .json({ message: "Author updated successfully", Author: updateAuthor });
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the Author" });
  }
};

// Delete a Author
const deleteAuthor = async (req, res) => {
  const authorId = req.params.id;

  if (!validateUUID(authorId)) {
    res.status(400).json({ message: "Invalid book ID" });
    return;
  }

  try {
    const deletedCount = await deleteAuthorData(authorId);

    if (deletedCount > 0) {
      res.status(200).json({ message: "Author deleted successfully" });
    } else {
      res.status(404).json({ message: "Author not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the Author" });
  }
};

// Authors By Text Search
const searchAuthors = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 50;
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
    const authors = await searchAuthor(param);

    if (authors.length === 0) {
      return res
        .status(404)
        .json({ message: "No authors found matching the search text." });
    }

    res.status(200).json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch authors." });
  }
};

module.exports = {
  getAllAuthors,
  searchAuthors,
  updateAuthor,
  deleteAuthor,
  createAuthor,
};
