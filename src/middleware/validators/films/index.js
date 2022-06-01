"use strict";

const { check, body } = require("express-validator");

const keywordValidator = check("date").isDate();

const filmNameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Film's name is emtpy");

const genereValidator = body("genre")
  .trim()
  .notEmpty()
  .withMessage("Film's genere is emtpy");

const trailerValidator = body("trailer")
  .trim()
  .notEmpty()
  .withMessage("Film's trailer is emtpy");

const rateValidator = body("rate")
  .trim()
  .notEmpty()
  .withMessage("Film's rate is emtpy")
  .isDecimal()
  .withMessage("Film's rate must be numberic");

const lengthValidator = body("length")
  .trim()
  .notEmpty()
  .withMessage("Film's length is emtpy")
  .isNumeric({ no_symbols: true })
  .withMessage("Film's rate must be numberic");

const descriptionValidator = body("description")
  .trim()
  .notEmpty()
  .withMessage("Film's description is emtpy");

const directorValidator = body("description")
  .trim()
  .notEmpty()
  .withMessage("Film's director is emtpy");

const actorValidator = body("actor")
  .trim()
  .notEmpty()
  .withMessage("Film's actor is emtpy");

const releaseDateValidator = body("releaseDate")
  .isDate()
  .withMessage("Film's release date must be YYYY/MM/DD");

const isReleasedValidator = body("isReleased")
  .isBoolean()
  .withMessage("isReleased must be Boolean value");

const coomingSoonValidator = body("coomingSoon")
  .isBoolean()
  .withMessage("coomingSoon must be Boolean value");

const filmInputValidator = [
  filmNameValidator,
  genereValidator,
  trailerValidator,
  rateValidator,
  lengthValidator,
  descriptionValidator,
  directorValidator,
  actorValidator,
  releaseDateValidator,
  isReleasedValidator,
  coomingSoonValidator,
];

const pageValidator = check("page").isInt().withMessage("Page must be integer");
const itemPerPageValidator = check("itemPerPage")
  .isInt()
  .withMessage("Items per page must be integer");

const paginationValidator = [pageValidator, itemPerPageValidator];

module.exports = {
  keywordValidator,
  filmInputValidator,
  paginationValidator,
};
