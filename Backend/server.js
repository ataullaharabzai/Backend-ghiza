require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoute = require("./routes/auth.routes");
const restaurantRoute = require("./routes/restaurants.routes");
const foodRoute = require("./routes/food.routes");
const favoriteRoute = require('./routes/favoriteFoods.routes');
const orderRoute = require('./routes/orders.routes')
const errorMsg = require("./middlewares/error.middleware");

const PORT = process.env.PORT
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
app.use('/api/favorite', favoriteRoute) //Favorite API
app.use('/api/order', orderRoute) // Order API


app.use(errorMsg) // Centralized error message
module.exports = app;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
