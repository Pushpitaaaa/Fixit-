const express = require("express");
const router = express.Router();

const {
  getAllProviders,
  searchProviders,
  getTopProviders,
  getProviderById
} = require("../controllers/providerController");

router.get("/", getAllProviders);
router.get("/search", searchProviders);
router.get("/top", getTopProviders);
router.get("/:id", getProviderById);

module.exports = router;