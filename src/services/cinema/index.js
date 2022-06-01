"use strict";

const { CinemaChains, Cinemas, sequelize, Theaters } = require("../../models");

const { QueryTypes } = require("sequelize");

const getCinemaChainsList = async (chainCode) => {
  try {
    if (chainCode) {
      const cinemaChainList = await CinemaChains.findAll({
        where: {
          chainCode,
        },
      });
      return cinemaChainList;
    } else {
      const cinemaChainList = await CinemaChains.findAll();
      return cinemaChainList;
    }
  } catch (error) {
    return null;
  }
};

const getChainIdByChainCode = async (chainCode) => {
  try {
    const chainIdQuery = await sequelize.query(
      `SELECT id FROM cinemachains WHERE chainCode='${chainCode}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    return chainIdQuery[0].id;
  } catch (error) {
    return null;
  }
};

const getCinemaListByChainId = async (chainId) => {
  try {
    const cinemaList = await Cinemas.findAll({
      where: {
        cinemaChainId: chainId,
      },
      attributes: { exclude: ["cinemaChainId", "id"] },
      include: [
        {
          model: Theaters,
          as: "theaterList",
          attributes: { exclude: ["createdAt", "updatedAt", "cinemaId"] },
        },
      ],
    });
    return cinemaList;
  } catch (error) {
    return null;
  }
};

const getCinemaInfoByCinemaChain = async (chainCode) => {
  try {
    const cinemaInfo = await CinemaChains.findAll({
      attributes: ["chainCode", ["name", "chainName"], ["logo", "chainLogo"]],
      where: {
        chainCode,
      },
      include: {
        model: Cinemas,
        as: "cinemaList",
        attributes: [
          ["id", "cinemaId"],
          "cinemaCode",
          ["name", "cinemaName"],
          "address",
        ],
      },
    });

    return cinemaInfo;
  } catch (error) {
    return null;
  }
};

const queryCinemaIdByChainId = async (chainId) => {
  try {
    const cinemaIdQuery = await sequelize.query(
      `
      SELECT t.id FROM theaters AS t 
      JOIN cinemas AS c ON c.id = t.cinemaId 
      WHERE c.id = ${chainId};
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    return cinemaIdQuery;
  } catch (error) {
    return null;
  }
};

const getCinemaChainAndCinema = async () => {
  try {
    const chainAndCinemaList = await CinemaChains.findAll({
      attributes: ["chainCode", ["name", "chainName"], ["logo", "chainLogo"]],
      include: {
        model: Cinemas,
        as: "cinemaList",
        attributes: [
          ["id", "cinemaId"],
          "cinemaCode",
          ["name", "cinemaName"],
          "address",
        ],
      },
    });

    return chainAndCinemaList;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getCinemaChainsList,
  getChainIdByChainCode,
  getCinemaListByChainId,
  getCinemaInfoByCinemaChain,
  queryCinemaIdByChainId,
  getCinemaChainAndCinema,
};
