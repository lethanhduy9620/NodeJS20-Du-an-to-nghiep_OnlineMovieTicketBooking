"use strict";

const { decodeToken } = require("../../services/auth");
const { responseData } = require("../../services/response");
const { getUserById } = require("../../services/users");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedeData = decodeToken(token); //decodedeData is userID

    if (!decodedeData) {
      return res.status(401).send(responseData("Token is invalid"));
    }

    const user = await getUserById(decodedeData.data);

    if (!user) {
      return res.status(401).send(responseData("Token is invalid"));
    }

    req.user = user;
  } catch (error) {
    return res.status(500).send(responseData("Server has errors"));
  }

  next();
};

const checkRole = (role) => (req, res, next) => {
  try {
    const { user } = req;

    if (user.role !== role) {
      return res.status(401).send(responseData("Access denied"));
    }
  } catch (error) {
    return res.status(500).send(responseData("Server has errors"));
  }

  next();
};

module.exports = { authenticate, checkRole };
