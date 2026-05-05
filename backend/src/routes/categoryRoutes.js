const express = require("express");
const controller = require("../controllers/categoryController");
const validate = require("../middleware/validate");
const { categoryQuerySchema } = require("../validators/categoryValidator");

const router = express.Router();

router.get("/categories", validate(categoryQuerySchema, "query"), controller.listCategories);

module.exports = router;
