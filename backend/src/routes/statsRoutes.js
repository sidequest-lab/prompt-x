const express = require("express");
const controller = require("../controllers/statsController");

const router = express.Router();

router.get("/stats/overview", controller.getOverview);

module.exports = router;
