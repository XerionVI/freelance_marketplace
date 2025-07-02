const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesContoller");

router.get("/", categoriesController.getCategories);
router.post("/", categoriesController.createCategory);
router.put("/:id", categoriesController.editCategory);
router.delete("/:id", categoriesController.deleteCategory);

module.exports = router;