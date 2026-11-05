const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");

async function saveRestaurant(req, res) {
  try {
    const { rollNumber, name, meal, timing, rating, minPrice } = req.body;

    const filePath = path.join(__dirname, "../../src/db/restaurantsData.json");
    const restaurantsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const allRestaurants = restaurantsData.allRestaurants;

    const isRestaurantAlreadyExist = allRestaurants.find(
      (restaurant) => restaurant.rollNumber === rollNumber,
    );

    if (isRestaurantAlreadyExist) {
      return res.status(409).json({
        error: "Conflict",
        message: "Restaurant already exist",
      });
    }

    const newRestaurant = {
      id: nanoid(),
      rollNumber: rollNumber,
      name: name,
      meal: meal,
      timing: timing,
      rating: rating,
      minPrice: minPrice,
      avatar: req.file ? `/db/restaurantImages/${req.file.url}` : null,
    };

    allRestaurants.push(newRestaurant);

    fs.writeFileSync(filePath, JSON.stringify({ allRestaurants }, null, 2));

    return res.status(201).json({
      message: "Restaurant registered",
      newRestaurant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getAllRestaurants(req, res) {
  try {
    const filePath = path.join(__dirname, "../db/restaurantsData.json");
    const restaurantsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const allRestaurants = restaurantsData.allRestaurants;

    if (!allRestaurants) {
      return res.status(404).json({
        message: "Restaurants not found",
      });
    }

    return res.status(200).json({
      message: "Restaurants fetched Successfully",
      allRestaurants,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getRestaurantById(req, res) {
  try {
    const restaurantId = req.params.id;

    const filePath = path.join(__dirname, "../db/restaurantsData.json");
    const restaurantsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const allRestaurants = restaurantsData.allRestaurants;

    const isRestaurantMatching = allRestaurants.findIndex(
      (restaurant) => restaurant.id === restaurantId,
    );

    if(isRestaurantMatching === -1) {
      return res.status(404).json({
        message: "The restaurant is not found"
      })
    }

    const restaurantFound = allRestaurants[isRestaurantMatching]

    return res.status(200).json({
      message: "Restaurant found successfully",
      restaurantFound
    })
    
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { saveRestaurant, getAllRestaurants, getRestaurantById };
