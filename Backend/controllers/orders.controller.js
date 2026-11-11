const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");
const { successMsg } = require("../utils/response.util");

async function setOrders(req, res, next) {
  try {
    if (!req.body) {
      const error = new Error("Request is empty");
      error.statusCode = 400;
      return next(error);
    }

    const {
      name,
      price,
      quantity,
      customer,
      portion,
      spicLevel,
      extraItems,
      note,
    } = req.body;

    const filePath = path.join(__dirname, "../db/orders.json");
    const orderData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const orders = orderData.orders;

    if (!orders) {
      const error = new Error("Orders not found");
      error.statusCode = 404;
      return next(error);
    }

    const isOrderAlreadyExist = orders.find((order) => order.name === name);

    if (isOrderAlreadyExist) {
      const error = new Error("Order already exist");
      error.statusCode = 409;
      return next(error);
    }

    const newOrder = {
      id: nanoid(),
      name: name,
      price: price,
      quantity: quantity,
      spicLevel: spicLevel,
      portion: portion,
      extraItems: extraItems,
      note: note,
      customer: customer,
      avatar: req.file ? `/db/ordersImages/${req.file.filename}` : null,
    };

    orders.push(newOrder);
    fs.writeFileSync(filePath, JSON.stringify({ orders }, null, 2));

    return successMsg(res, newOrder, "Order created", 201);
  } catch (error) {
    return next(error);
  }
}

async function orders(req, res, next) {
  try {
    const filePath = path.join(__dirname, "../db/orders.json");
    const orderData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const orders = orderData.orders;

    if (!orders) {
      const error = new Error("Orders not found");
      error.statusCode = 404;
      return next(error);
    }

    return successMsg(res, orders, "Orders fetched successfully", 200);
  } catch (error) {
    return next(error);
  }
}

async function orderById(req, res, next) {
  try {
    const orderId = req.params.id;

    const filePath = path.join(__dirname, "../db/orders.json");
    const orderData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const orders = orderData.orders;

    if (!orders) {
      const error = new Error("Orders not found");
      error.statusCode = 404;
      return next(error);
    }

    const isOrderMatched = orders.findIndex((order) => order.id === orderId);

    if (isOrderMatched === -1) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    const matchedOrder = orders[isOrderMatched];

    return successMsg(res, matchedOrder, "Order found", 200);
  } catch (error) {
    return next(error);
  }
}

async function updateOrder(req, res, next) {
  try {
    if (!req.body) {
      const error = new Error("Request is empty");
      error.statusCode = 400;
      return next(error);
    }

    const orderId = req.params.id;

    const filePath = path.join(__dirname, "../db/orders.json");
    const orderData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const orders = orderData.orders;

    if (!orders) {
      const error = new Error("Orders not found");
      error.statusCode = 404;
      return next(error);
    }

    const isOrderMatching = orders.findIndex((order) => order.id === orderId);

    if (isOrderMatching === -1) {
      const error = new Error("Order not found");
      error.statusCode = 409;
      return next(error);
    }

    const updateOrder = {
      ...orders[isOrderMatching],
      ...req.body,
    };

    orders[isOrderMatching] = updateOrder;

    return successMsg(res, updateOrder, "Order updated successfully", 200);
  } catch (error) {
    return next(error);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const orderId = req.params.id;

    const filePath = path.join(__dirname, "../db/orders.json");
    const orderData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    let orders = orderData.orders;

    if (!orders) {
      const error = new Error("Orders not found");
      error.statusCode = 404;
      return next(error);
    }

    const isOrderStillExist = orders.findIndex((order) => order.id === orderId)

    if(isOrderStillExist === -1) {
        const error = new Error("Order already cancelled or not found")
        error.statusCode = 404
        return next(error)
    }

    const removeOrder = orders.filter((order) => order.id !== orderId);

    orders = removeOrder;

    fs.writeFileSync(filePath, JSON.stringify({ orders }, null, 2));

    return successMsg(res, orders[removeOrder], "Order cancelled", 200);
  } catch (error) {
    return next(error);
  }
}

module.exports = { setOrders, orders, orderById, updateOrder, cancelOrder };
