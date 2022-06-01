"use strict";

const { Films, sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

const getFilmList = async () => {
  try {
    const filmList = await Films.findAll();
    return filmList;
  } catch (error) {
    return null;
  }
};

const getFilmListByPagination = async (offset, limit) => {
  try {
    const filmList = await Films.findAll({
      offset,
      limit,
    });
    return filmList;
  } catch (error) {
    return null;
  }
};

const getFilmQuanity = async () => {
  try {
    const filmQuantityQuery = await sequelize.query(
      "SELECT COUNT(id) AS filmQuanity FROM films WHERE deletedAt IS NULL",
      {
        type: QueryTypes.SELECT,
      }
    );
    return filmQuantityQuery[0].filmQuanity;
  } catch (error) {
    return null;
  }
};

const getFilmDetailById = async (id) => {
  try {
    const filmDetail = await Films.findOne({
      where: {
        id,
      },
    });
    return filmDetail;
  } catch (error) {
    return null;
  }
};

const getFilmByReleaseDate = async (date) => {
  try {
    const filmList = await sequelize.query(
      `SELECT * FROM films WHERE releaseDate='${date}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    return filmList;
  } catch (error) {
    return null;
  }
};

const createFilm = async (data) => {
  try {
    const film = await Films.create(data);
    return film;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateFilmById = async (id, data) => {
  try {
    const film = await Films.update(data, {
      where: {
        id,
      },
    });
    return film;
  } catch (error) {
    return null;
  }
};

const storePosterByFilmId = async (filmId, url) => {
  try {
    const poster = await Films.update(
      { poster: url },
      {
        where: {
          id: filmId,
        },
      }
    );

    return poster;
  } catch (error) {
    return null;
  }
};

const deleteFilmById = async (id) => {
  try {
    const deletedFilm = await Films.destroy({
      where: {
        id,
      },
    });
    return deletedFilm;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getFilmList,
  getFilmDetailById,
  createFilm,
  updateFilmById,
  storePosterByFilmId,
  deleteFilmById,
  getFilmListByPagination,
  getFilmQuanity,
  getFilmByReleaseDate,
};
