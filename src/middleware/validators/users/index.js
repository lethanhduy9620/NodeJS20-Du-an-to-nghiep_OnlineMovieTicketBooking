"use strict";

const { check } = require("express-validator");

const emailValidator = check("email")
  .isEmail()
  .withMessage("Input is not email format");

const firstnameValidator = check("firstName")
  .trim()
  .notEmpty()
  .withMessage("First name is empty")
  .isLength({ max: 40 })
  .withMessage("First name exceeds allowable characters");

const lastNameValidator = check("lastName")
  .trim()
  .notEmpty()
  .withMessage("Last name is empty")
  .isLength({ max: 40 })
  .withMessage("First name exceeds allowable characters");

const dobValidator = check("DOB")
  .isDate()
  .withMessage("DOB must be date YYYY/MM/DD");

const passwordValidator = check("password")
  .isLength({ min: 6 })
  .withMessage("Password length must be larger than 6");

const phoneNumberValidator = check("phoneNumber")
  .isNumeric()
  .withMessage("Phone number must be numberic")
  .isLength({ min: 9, max: 11 })
  .withMessage("Phone number must vary from 9 to 11 numbers");

const searchKeywordValidator = check("keyword").trim().notEmpty();

const signInValidator = [emailValidator];

const signUpValidator = [
  firstnameValidator,
  lastNameValidator,
  dobValidator,
  emailValidator,
  passwordValidator,
  phoneNumberValidator,
];

const updateValitor = [
  firstnameValidator,
  lastNameValidator,
  dobValidator,
  phoneNumberValidator,
];

module.exports = {
  signInValidator,
  signUpValidator,
  searchKeywordValidator,
  updateValitor,
};
