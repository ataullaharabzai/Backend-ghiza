const express = require("express");
const multer = require("multer");
const path = require("path");
const favoriteController = require("../controllers/favoriteFood.controller");

const upload = multer({ dest: path.join(__dirname, "../db/foodsImages") });

const router = express.Router();

router.post(
  "/favorites",
  upload.single("avatar"),
  favoriteController.registerFavoriteFood,
);

module.exports = router;
