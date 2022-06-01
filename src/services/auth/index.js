"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AUTH } = require("./../../config");

const scriptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

const comparePassword = (password, passwordHashed) => {
  const isMatch = bcrypt.compareSync(password, passwordHashed);
  return isMatch;
};

const generateToken = (data) => {
  const token = jwt.sign(data, AUTH.SECRET_KEY, { expiresIn: "1d" });
  return token;
};

const decodeToken = (data) => {
  try {
    const decodedeData = jwt.verify(data, AUTH.SECRET_KEY);
    return decodedeData;
  } catch (error) {
    return null;
  }
};

module.exports = {
  scriptPassword,
  comparePassword,
  generateToken,
  decodeToken,
};
