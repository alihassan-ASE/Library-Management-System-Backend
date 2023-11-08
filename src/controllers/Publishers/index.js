const {
  allPublishers,
  insertPublisher,
  updatePublisherData,
  deletePublisherData,
  searchPublishers,
} = require("../../services/Publishers");
const { v4: uuidv4, validate: validateUUID } = require("uuid");
const isEmpty = require("../../middleware/checkEmptyFields");

//   Get All Publishers
const getAllPublishers = async (req, res) => {
  try {
    const page = parseInt(req.params.ID) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const param = {
      limit,
      offset,
    };

    const publishers = await allPublishers(param);

    if (publishers.length === 0) {
      return res.status(404).json({ error: "No more records to retrieve" });
    }

    return res.status(200).json({ publishers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error Check Page Number" });
  }
};

function isValidDate(dateString) {
  return !isNaN(new Date(dateString).getTime());
}
// Insert Publisher
const createPublisher = async (req, res) => {
  const body = req.body;

  if (
    isEmpty(body) ||
    !isValidDate(body.founded_date) ||
    !validateUUID(body.genre_id)
  ) {
    res
      .status(400)
      .json({ message: "Invalid or missing values in the request body" });
    return;
  }

  try {
    const [newPublisher, created] = await insertPublisher(body);

    if (created) {
      res
        .status(201)
        .json({
          message: "Publisher Inserted successfully",
          Publisher: newPublisher,
        });
    } else {
      res
        .status(409)
        .json({ message: "Publisher with the same Name already exists" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to Insert a Publisher" });
  }
};

// Update Existing Author
const updatePublisher = async (req, res) => {
  const body = req.body;
  const publisherId = req.params.id;

  if (
    isEmpty(body) ||
    !validateUUID(publisherId) ||
    !isValidDate(founded_date) ||
    !validateUUID(genre_id)
  ) {
    res
      .status(400)
      .json({ message: "Invalid or missing values in the request body" });
    return;
  }

  const param = { publisherId, body };

  try {
    const [updatedCount, [updatePublisher]] = await updatePublisherData(param);

    if (updatedCount > 0) {
      res
        .status(200)
        .json({
          message: "Publisher updated successfully",
          Publisher: updatePublisher,
        });
    } else {
      res.status(404).json({ message: "Publisher not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the Publisher" });
  }
};

// Delete a Author
const deletePublisher = async (req, res) => {
  const publisherId = req.params.id;

  if (!validateUUID(publisherId)) {
    res.status(400).json({ message: "Invalid book ID" });
    return;
  }

  try {
    const deletedCount = await deletePublisherData(publisherId);

    if (deletedCount > 0) {
      res.status(200).json({ message: "Publisher deleted successfully" });
    } else {
      res.status(404).json({ message: "Publisher not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the Publisher" });
  }
};

// Search Publisher By Text
const searchPublisher = async (req, res) => {
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
    const publisher = await searchPublishers(param);

    if ([publisher].length === 0) {
      return res
        .status(404)
        .json({ message: "No Publisher found matching the search text." });
    }

    res.status(200).json(publisher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Publisher." });
  }
};

module.exports = {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
  searchPublisher,
};
