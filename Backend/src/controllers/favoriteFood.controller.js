const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");
const { successMsg } = require("../utils/response.util");

async function registerFavoriteFood(req, res, next) {
  try {
    if (!req.body) {
      const error = new Error("Request body is required");
      error.statusCode = 400;
      return next(error);
    }

    const { rollNumber, name, desc, price, rating, restaurant } = req.body; 

    const filePath = path.join(__dirname, "../db/favoritesFoods.json");
    const favoritesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const allFavoriteFood = favoritesData.allFavoriteFood;

    const isFoodAlreadyExist = allFavoriteFood.find(
      (food) => food.rollNumber === rollNumber,
    );

    if (isFoodAlreadyExist) {
      const error = new Error("Food already exist in Favorites");
      error.statusCode = 409;
      return next(error);
    }

    const newFavoriteFood = {
      rollNumber: rollNumber,
      name: name,
      desc: desc,
      rating: rating,
      price: price,
      restaurant: restaurant,
      avatar: req.file ? `/db/foodsImages/${req.file.filename}` : null,
    };

    allFavoriteFood.push(newFavoriteFood);

    fs.writeFileSync(filePath, JSON.stringify({allFavoriteFood}, null, 2))

    return successMsg(res, newFavoriteFood, "Food added to Favorites", 201);
  } catch (error) {
    next(error);
  }
}

module.exports = { registerFavoriteFood };
