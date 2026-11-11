const fs = require("fs");
const bcrypt = require("bcryptjs");
const userData = require("../db/users.json");
const { nanoid } = require("nanoid");
const path = require("path");
const { successMsg } = require("../utils/response.util");

async function userRegister(req, res) {
  const { name, email, password, phone, role } = req.body;
  const users = userData.users;

  const isUserAlreadyExist = users.find(
    (user) => user.email === email || user.phone === phone,
  );

  if (isUserAlreadyExist) {
    return res.status(409).json({
      error: "Conflict",
      message: "This user already exist",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: nanoid(),
    name: name,
    email: email,
    password: hashPassword,
    phone: phone,
    role: role,
  };

  users.push(newUser);
  fs.writeFileSync(
    require.resolve("../db/users.json"),
    JSON.stringify(userData, null, 2),
  );

  res.status(201).json({
    message: "User created",
    // newUser,
  });
}

async function loginUser(req, res) {
  try {
    const { phone, password } = req.body;

    const filePath = path.join(__dirname, "../db/users.json");
    const userData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const users = userData.users;

    const user = users.find((user) => user.phone === phone);

    if (!user) {
      return res.status(404).json({
        error: "Not found",
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Incorrect credential",
        message: "Invalid phone number or password",
      });
    }

    return res.status(200).json({
      message: "Login successfully",
      user: {
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;

    const filePath = path.join(__dirname, "../db/users.json");
    const userData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const users = userData.users;

    const userMatch = users.findIndex((user) => user.id === userId);

    if (!userMatch) {
      return res.status(404).json({
        error: "No matching",
        message: "User not matched",
      });
    }

    const updateUser = {
      ...users[userMatch],
      ...req.body,
    };

    users[userMatch] = updateUser;

    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

    return res.status(200).json({
      message: "User updated",
      updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function deleteUser(req, res, next) {
  try {

    const userId = req.params.id;
    const {phone} = req.body

    if(!phone) {
      const error = new Error("Phone number required")
      error.statsCode = 400
      return next(error)
    }

    const filePath = path.join(__dirname, "../db/users.json");
    const userData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let users = userData.users;

    const removeUser = users.filter(
      (user) => user.id !== userId || user.phone !== phone,
    );

    users = removeUser

    fs.writeFileSync(filePath, JSON.stringify({users}, null, 2))

    return successMsg(res, users[removeUser], "User deleted", 200)

  } catch (error) {
    return next(error);
  }
}

module.exports = { userRegister, loginUser, updateUser, deleteUser };
