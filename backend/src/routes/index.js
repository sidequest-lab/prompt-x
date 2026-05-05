const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const promptRoutes = require("./promptRoutes");
const reviewRoutes = require("./reviewRoutes");
const categoryRoutes = require("./categoryRoutes");
const statsRoutes = require("./statsRoutes");

const router = express.Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(promptRoutes);
router.use(reviewRoutes);
router.use(categoryRoutes);
router.use(statsRoutes);

module.exports = router;
