const express = require("express");
const restaurantController = require("../controllers/restaurant.controller");
const multer = require("multer");

const upload = multer({ dest: "/db/restaurantImages/" });
const router = express.Router();

router.post(
  "/setRestaurant",
  upload.single("avatar"),
  restaurantController.saveRestaurant,
);

router.get('/restaurants', restaurantController.getAllRestaurants)

router.get('/restaurant/:id', restaurantController.getRestaurantById)

module.exports = router;
