const express = require("express");
const foodController = require("../controllers/food.controller");
const multer = require("multer");

const upload = multer({ dest: "../db/foodsImages" });
const router = express.Router();

router.post("/registerFood", upload.single("avatar"), foodController.setFood);
router.get('/getFoods', foodController.getAllFoods)
router.get('/getFood/:id', foodController.getFoodById)


module.exports = router
