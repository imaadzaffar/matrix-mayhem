const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const { questionsGetNew, questionsCheckAnswer } = require("../controllers/questions");

router.get("/:difficulty", questionsGetNew);

router.post("/check", questionsCheckAnswer);

module.exports = router;
