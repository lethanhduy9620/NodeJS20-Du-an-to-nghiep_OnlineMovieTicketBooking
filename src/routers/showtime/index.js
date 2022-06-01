"use strict";

const express = require("express");
const showtimeRouter = express.Router();
const { responseData, responseError } = require("../../services/response");
const {
  getShowtimeByCinemaChain,
  getShowtimeByFilmId,
  createShowtime,
} = require("../../services/showtime");

const { authenticate, checkRole } = require("../../middleware/auth");
const { getFilmDetailById } = require("../../services/films");
const { getTheaterByTheaterId } = require("../../services/theaters");
const { getCinemaChainsList } = require("../../services/cinema");

showtimeRouter.get("/get-showtime-by-cinema-chain", async (req, res) => {
  const { chainCode } = req.query;

  const cinemaChainList = await getCinemaChainsList(chainCode);
  if (cinemaChainList.length === 0) {
    return res.status(404).send(responseError("Cinema chain doesn't exist"));
  }

  const showtimeList = await getShowtimeByCinemaChain(chainCode);
  if (!showtimeList) {
    return res.status(500).send(responseError("Server has errors"));
  }

  return res
    .status(200)
    .send(responseData("Get list of showtime successfully", showtimeList));
});

showtimeRouter.get("/get-showtime-by-film", async (req, res) => {
  const { filmId } = req.query;

  const film = await getFilmDetailById(filmId);
  if (!film) {
    return res.status(404).send(responseError("Film does not exist"));
  }

  const showtimeList = await getShowtimeByFilmId(filmId);
  if (!showtimeList) {
    return res.status(500).send(responseError("Server has errors"));
  }

  return res
    .status(200)
    .send(responseData("Get list of showtime successfully", showtimeList));
});

showtimeRouter.post(
  "/creat-showtime",
  [authenticate, checkRole("ADMIN")],
  async (req, res) => {
    const { filmId, theaterId, dateTime } = req.body;

    const film = await getFilmDetailById(filmId);
    if (!film) {
      return res.status(404).send(responseError("Film doesn't exist"));
    }

    const theater = await getTheaterByTheaterId(theaterId);
    if (!theater) {
      return res.status(404).send(responseError("Theater doesn't exist"));
    }

    const showtime = await createShowtime({
      filmId,
      theaterId,
      dateTime,
    });
    if (!showtime) {
      return res.status(500).send(responseError("Cannot create showtime"));
    }

    return res.status(200).send(responseData("Create showtime successfully"));
  }
);

module.exports = showtimeRouter;
