const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const { resultsCreate, resultsGet } = require("../controllers/results");

router.get("/:userId", resultsGet);

router.post("/", resultsCreate);

module.exports = router;
