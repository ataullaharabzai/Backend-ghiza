const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");
const { successMsg } = require("../utils/response.util");

async function setFood(req, res) {
  try {
    const { rollNumber, name, price, desc, rating, restaurant } = req.body;

    const filePath = path.join(__dirname, "../db/foods.json");
    const foodData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const allPopularFoods = foodData.allPopularFoods;

    const isFoodAlreadyExist = allPopularFoods.find(
      (food) => food.rollNumber === rollNumber,
    );

    if (isFoodAlreadyExist) {
      return res.status(409).json({
        message: "Food already exist",
      });
    }

    const newFood = {
      id: nanoid(),
      rollNumber: rollNumber,
      name: name,
      price: price,
      desc: desc,
      rating: rating,
      restaurant: restaurant,
      avatar: req.file ? `/db/foodsImages/${req.file.filename}` : null,
    };

    allPopularFoods.push(newFood);
    fs.writeFileSync(filePath, JSON.stringify({ allPopularFoods }, null, 2));

    return successMsg(res, newFood, "Food created successfully", 201);

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getAllFoods(req, res) {
  try {
    const filePath = path.join(__dirname, "../db/foods.json");
    const foodData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const allPopularFoods = foodData.allPopularFoods;

    if (!allPopularFoods) {
      return res.status(404).json({
        message: "Foods not found",
      });
    }

    return successMsg(res, allPopularFoods, "Foods fetched successfully", 200);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getFoodById(req, res) {
  try {
    const foodId = req.params.id;

    const filePath = path.join(__dirname, "../db/foods.json");
    const foodData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const allPopularFoods = foodData.allPopularFoods;

    const isFoodMatching = allPopularFoods.findIndex(
      (food) => food.id === foodId,
    );

    if (isFoodMatching === -1) {
      return res.status(404).json({
        message: "The food is not found",
      });
    }

    const foodMatched = allPopularFoods[isFoodMatching];

    return successMsg(res, foodMatched, "Food matched", 200);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { setFood, getAllFoods, getFoodById };
