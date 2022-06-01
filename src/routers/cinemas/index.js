"use strict";

const express = require("express");
const {
  getCinemaChainsList,
  getCinemaListByChainId,
  getChainIdByChainCode,
} = require("../../services/cinema");
const { responseData, responseError } = require("../../services/response");
const {
  getShowtimeInfoByShowtimeId,
  checkShowtimeExist,
} = require("../../services/showtime");

const cinemaRouter = express.Router();

// Get list of cinema chains
cinemaRouter.get("/get-cinema-chain-list", async (req, res) => {
  const { chainCode } = req.query;

  const cinemaChainList = await getCinemaChainsList(chainCode);
  if (!cinemaChainList) {
    return res.status(500).send(responseError("Server has errors"));
  }

  return res
    .status(200)
    .send(responseData("Get cinema chains list successfully", cinemaChainList));
});

//Get list of cinemas by chain code
cinemaRouter.get("/get-cinema-by-cinema-chain", async (req, res) => {
  const { chainCode } = req.query;

  const chainId = await getChainIdByChainCode(chainCode);
  if (!chainId) {
    return res
      .status(404)
      .send(
        responseError(`Cinema chain with chain code ${chainCode} doesn't exist`)
      );
  }

  const cinemaList = await getCinemaListByChainId(chainId);
  if (!cinemaList) {
    return res.status(500).send(responseError("Server has errors"));
  }

  return res
    .status(200)
    .send(responseData("Get cinema list successfully", cinemaList));
});

cinemaRouter.get("/get-seat-list-by-showtime", async (req, res) => {
  const { showtimeId } = req.query;

  const showtimeExist = await checkShowtimeExist(showtimeId);
  if (!showtimeExist) {
    return res.status(404).send(responseError("Showtime doesn't exist"));
  }

  const showtimeInfo = await getShowtimeInfoByShowtimeId(showtimeId);
  if (!showtimeInfo) {
    return res.status(500).send(responseError("Server has errors"));
  }

  return res
    .status(200)
    .send(responseData("Get info successfully", showtimeInfo));
});

module.exports = cinemaRouter;
