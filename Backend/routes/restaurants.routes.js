const express = require("express");
const restaurantController = require("../controllers/restaurant.controller");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: path.join(__dirname, "../db/restaurantImages") });
const router = express.Router();

router.post(
  "/restaurants",
  upload.single("avatar"),
  restaurantController.saveRestaurant,
);
router.get('/restaurants', restaurantController.getAllRestaurants)
router.get('/restaurants/:id', restaurantController.getRestaurantById)
router.delete('/restaurants/:id', restaurantController.removeRestaurant)

module.exports = router;
