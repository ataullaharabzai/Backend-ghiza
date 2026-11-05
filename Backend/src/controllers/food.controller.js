const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");

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
      name: name,
      price: price,
      desc: desc,
      rating: rating,
      restaurant: restaurant,
      avatar: req.file
        ? `/Backend/src/db/foodsImages/${req.file.filename}`
        : null,
    };

    allPopularFoods.push(newFood);
    fs.writeFileSync(filePath, JSON.stringify({ allPopularFoods }, null, 2));

    return res.status(201).json({
      message: "Add new food successfully",
      newFood,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getAllFoods(req, res) {
  try {
    
    const filePath = path.join(__dirname, '../db/foods.json')
    const foodData = JSON.parse(fs.readFileSync(filePath, "utf-8"))

    const allPopularFoods = foodData.allPopularFoods

    if(!allPopularFoods) {
      return res.status(404).json({
        message: "Foods not found"
      })
    }

    return res.status(200).json({
      message: "Foods fetched successfully",
      allPopularFoods
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

async function getFoodById(req, res) {
  try {

    const foodId = req.params.id

    const filePath = path.join(__dirname, '../db/foods.json')
    const foodData = JSON.parse(fs.readFileSync(filePath, "utf-8"))

    const allPopularFoods = foodData.allPopularFoods

    const isFoodMatching = allPopularFoods.findIndex((food) => food.id === foodId)

    if(isFoodMatching === -1) {
      return res.status(404).json({
        message: "The food is not found"
      })
    }

    const foodMatched = allPopularFoods[isFoodMatching]

    return res.status(200).json({
      message: "Food found successfully",
      foodMatched
    })
    
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

module.exports = { setFood, getAllFoods, getFoodById };
