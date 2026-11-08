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
      id: nanoid(),
      rollNumber: rollNumber,
      name: name,
      desc: desc,
      rating: rating,
      price: price,
      restaurant: restaurant,
      avatar: req.file ? `/db/foodsImages/${req.file.filename}` : null,
    };

    allFavoriteFood.push(newFavoriteFood);

    fs.writeFileSync(filePath, JSON.stringify({ allFavoriteFood }, null, 2));

    return successMsg(res, newFavoriteFood, "Food added to Favorites", 201);
  } catch (error) {
    next(error);
  }
}

async function getFavoriteFoods(req, res, next) {
  try {
    const filePath = path.join(__dirname, "../db/favoritesFoods.json");
    const favoritesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const favoriteFoods = favoritesData.allFavoriteFood;

    if (!favoriteFoods) {
      const error = new Error("Foods not found");
      error.statusCode = 404;
      return next(error);
    }

    return successMsg(res, favoriteFoods, "Foods fetched successfully", 200);
  } catch (error) {
    return next(error);
  }
}

async function getFavoriteFoodById(req, res, next) {
  try {
    const foodId = req.params.id;

    const filePath = path.join(__dirname, "../db/favoritesFoods.json");
    const favoritesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const favoriteFoods = favoritesData.allFavoriteFood;

    const isFoodMatching = favoriteFoods.findIndex(
      (food) => food.id === foodId,
    );

    if (isFoodMatching === -1) {
      const error = new Error("Food not found");
      error.statusCode = 409;
      return next(error);
    }

    const matchedFood = favoriteFoods[isFoodMatching];

    return successMsg(res, matchedFood, "Food found successfully", 200);
  } catch (error) {
    return next(error);
  }
}

async function removeFavoriteFood(req, res, next) {
  try {
    const foodId = req.params.id;

    const filePath = path.join(__dirname, "../db/favoritesFoods.json");
    const favoritesData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let allFavoriteFood = favoritesData.allFavoriteFood;

    if (!allFavoriteFood) {
      const error = new Error("Food not found");
      error.statusCode = 404;
      return next(error);
    }

    const removeFood = allFavoriteFood.filter((food) => food.id !== foodId);

    allFavoriteFood = removeFood

    fs.writeFileSync(filePath, JSON.stringify({allFavoriteFood}, null, 2))

    return successMsg(res, allFavoriteFood[removeFood], "Food removed", 200)

  } catch (error) {
    return next(error);
  }
}

module.exports = {
  registerFavoriteFood,
  getFavoriteFoods,
  getFavoriteFoodById,
  removeFavoriteFood
};
