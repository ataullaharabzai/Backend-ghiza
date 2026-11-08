const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoute = require("../routes/auth.routes");
const restaurantRoute = require("../routes/restaurants.routes");
const foodRoute = require("../routes/food.routes");
const favoriteRoutes = require('../routes/favoriteFoods.routes');
const errorMsg = require("../middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());

// Global access for Restaurant images
app.use(
  "/db/restaurantImages",
  express.static(path.join(__dirname, "../db/restaurantImages")),
);

// Global access for Food images
app.use(
  "/db/foodsImages",
  express.static(path.join(__dirname, "../db/foodsImages")),
);

// APIs
app.use("/api/auth", authRoute); // Users API
app.use("/api/restaurant", restaurantRoute); // Restaurants API
app.use("/api/food", foodRoute); // Foods API
app.use('/api/favorite', favoriteRoutes) //Favorite API


app.use(errorMsg) // Centralized error message
module.exports = app;
