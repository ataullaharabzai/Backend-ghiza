const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoute = require("../routes/auth.routes");
const restaurantRoute = require("../routes/restaurants.routes");
const foodRoute = require("../routes/food.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  "/db/restaurantImages",
  express.static(path.join(__dirname, "../db/restaurantImages")),
);
app.use(
  "/db/foodsImages",
  express.static(path.join(__dirname, "../db/foodsImages")),
);

// APIs
app.use("/api/auth", authRoute); // Users API
app.use("/api/restaurant", restaurantRoute); // Restaurants API
app.use("/api/foods", foodRoute); // Foods API

module.exports = app;
