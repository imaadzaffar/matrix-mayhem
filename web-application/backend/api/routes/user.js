const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const { userSignup, userLogin, userDelete } = require("../controllers/user");

router.post("/signup", userSignup);

router.post("/login", userLogin);

router.delete("/:userId", checkAuth, userDelete);

module.exports = router;
