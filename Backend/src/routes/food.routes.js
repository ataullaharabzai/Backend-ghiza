const express = require("express");
const foodController = require("../controllers/food.controller");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: path.join(__dirname, "../db/foodsImages") });
const router = express.Router();

router.post("/registerFood", upload.single("avatar"), foodController.setFood);
router.get('/getFoods', foodController.getAllFoods)
router.get('/getFood/:id', foodController.getFoodById)


module.exports = router
