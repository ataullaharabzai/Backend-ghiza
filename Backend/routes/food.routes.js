const express = require("express");
const foodController = require("../controllers/food.controller");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: path.join(__dirname, "../db/foodsImages") });
const router = express.Router();

router.post("/foods", upload.single("avatar"), foodController.setFood);
router.get('/foods', foodController.getAllFoods)
router.get('/foods/:id', foodController.getFoodById)
router.delete('/foods/:id', foodController.removeFood)


module.exports = router
