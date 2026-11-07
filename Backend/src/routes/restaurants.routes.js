const express = require("express");
const restaurantController = require("../controllers/restaurant.controller");
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: path.join(__dirname, "../db/restaurantImages") });
const router = express.Router();

router.post(
  "/setRestaurant",
  upload.single("avatar"),
  restaurantController.saveRestaurant,
);

router.get('/restaurants', restaurantController.getAllRestaurants)

router.get('/restaurant/:id', restaurantController.getRestaurantById)

module.exports = router;
