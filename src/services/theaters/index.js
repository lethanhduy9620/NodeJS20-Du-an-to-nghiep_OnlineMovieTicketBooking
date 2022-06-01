"use strict";

const { sequelize, Theaters } = require("../../models");
const { QueryTypes } = require("sequelize");

const queryTheaterIdByCinemaId = async (cinemaId) => {
  try {
    const theaterArrayQuery = await sequelize.query(
      `
    SELECT t.id FROM theaters AS t JOIN cinemas AS c ON c.id = t.cinemaId WHERE c.id = ${cinemaId};
   `,
      {
        type: QueryTypes.SELECT,
      }
    );

    const theaterIdArray = theaterArrayQuery.map((item) => item.id);

    return theaterIdArray;
  } catch (error) {
    return null;
  }
};

const getTheaterNameByTheaterId = async (theaterId) => {
  try {
    const theaterArrayQuery = await sequelize.query(
      `
    SELECT name AS theaterName FROM theaters WHERE id = ${theaterId}
    `,
      {
        type: QueryTypes.SELECT,
      }
    );

    const { theaterName } = theaterArrayQuery[0];
    return theaterName;
  } catch (error) {
    return null;
  }
};

const getTheaterByTheaterId = async (theaterId) => {
  try {
    const theater = await Theaters.findOne({
      where: {
        id: theaterId,
      },
    });
    return theater;
  } catch (error) {
    return null;
  }
};

module.exports = {
  queryTheaterIdByCinemaId,
  getTheaterNameByTheaterId,
  getTheaterByTheaterId,
};
