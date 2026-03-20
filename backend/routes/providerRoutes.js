const express = require("express");
const router = express.Router();

const {
  getAllProviders,
  searchProviders,
  getTopProviders
} = require("../controllers/providerController");

router.get("/", getAllProviders);
router.get("/search", searchProviders);
router.get("/top", getTopProviders);

module.exports = router;