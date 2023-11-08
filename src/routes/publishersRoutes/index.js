const express = require("express");
const router = express.Router();
const { authorize, isAdmin } = require("../../middleware/validRoute");
const {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
  searchPublisher,
} = require("../../controllers/Publishers");

router.post("/api/createPublisher", isAdmin, createPublisher);
router.patch("/api/updatePublisher/?:id", isAdmin, updatePublisher);
router.delete("/api/deletePublisher/?:id", isAdmin, deletePublisher);

router.get(
  "/api/getAllPublishers?:ID",
  authorize(["admin", "user"]),
  getAllPublishers
);
router.get(
  "/api/searchPublishers/:searchText/:page",
  authorize(["admin", "user"]),
  searchPublisher
);

module.exports = router;
