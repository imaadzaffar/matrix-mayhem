const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const { questions_get_new } = require("../controllers/questions");

router.get("/new/:type", questions_get_new);

// router.get("/new", orders_get_all);

// router.post("/", checkAuth, orders_create_order);

// router.get("/:orderId", checkAuth, orders_get_order);

// router.delete("/:orderId", checkAuth, orders_delete_order);

module.exports = router;
