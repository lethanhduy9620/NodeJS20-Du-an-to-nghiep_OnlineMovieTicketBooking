"use strict";

const express = require("express");
const { validationResult } = require("express-validator");
const { SYSTEM } = require("../../config");
const { authenticate, checkRole } = require("../../middleware/auth");
const { uploadImage } = require("../../middleware/upload");

const {
  keywordValidator,
  filmInputValidator,
  paginationValidator,
} = require("../../middleware/validators/films");
const {
  getFilmList,
  getFilmDetailById,
  createFilm,
  updateFilmById,
  deleteFilmById,
  getFilmListByPagination,
  getFilmQuanity,
  getFilmByReleaseDate,
  storePosterByFilmId,
} = require("../../services/films");
const { responseData, responseError } = require("../../services/response");

const filmRouter = express.Router();

// Get list of films
filmRouter.get("/get-film-list", async (req, res) => {
  const filmList = await getFilmList();

  if (!filmList) {
    return res.status(404).send(responseError("Cannot get film list"));
  }

  return res.status(200).send(responseData("Get film succesfully", filmList));
});

//Get film detail
filmRouter.get("/get-film-detail/:id", async (req, res) => {
  const { id } = req.params;
  const filmDetail = await getFilmDetailById(id);
  if (!filmDetail) {
    return res.status(404).send(responseError("Film doesn't not exist"));
  }
  return res
    .status(200)
    .send(responseData("Get film detail succesfully", filmDetail));
});

//Add film
// Because express-validator does not work well with multer so poster posting will another api
filmRouter.post(
  "/add-film",
  [authenticate, checkRole("ADMIN"), filmInputValidator],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send(responseError("Adding film failed", errors.array()));
    }

    const {
      name,
      genre,
      trailer,
      rate,
      length,
      description,
      director,
      actor,
      releaseDate,
      isReleased,
      coomingSoon,
    } = req.body;

    const film = await createFilm({
      name,
      genre,
      trailer,
      rate,
      length,
      description,
      director,
      actor,
      releaseDate,
      isReleased,
      coomingSoon,
    });

    if (!film) {
      return res.status(500).send(responseError("Cannot add film"));
    }

    return res.status(200).send(responseData("Add film successfully", film));
  }
);

//Update film
filmRouter.patch(
  "/update-film-detail/:id",
  [authenticate, checkRole("ADMIN"), filmInputValidator],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send(responseError("Adding film failed", errors.array()));
    }

    const { id: filmId } = req.params;

    const filmData = await getFilmDetailById(filmId);
    if (!filmData) {
      return res.status(404).send("Film doesn't not exist");
    }

    const {
      name,
      genre,
      trailer,
      rate,
      length,
      description,
      director,
      actor,
      releaseDate,
      isReleased,
      coomingSoon,
    } = req.body;

    const updatedFilm = await updateFilmById(filmId, {
      name,
      genre,
      trailer,
      rate,
      length,
      description,
      director,
      actor,
      releaseDate,
      isReleased,
      coomingSoon,
    });

    if (!updatedFilm) {
      return res.status(500).send(responseError("Cannot update film"));
    }

    return res.status(200).send(responseData("Update film successfully"));
  }
);

//Update film poster
filmRouter.patch(
  "/poster/:filmId",
  [authenticate, checkRole("ADMIN"), uploadImage("poster")],
  async (req, res) => {
    const { filmId } = req.params;

    const film = await getFilmDetailById(filmId);
    if (!film) {
      return res.status(404).send(responseError("Film doesn't exist"));
    }

    const poster = req.file;
    let url = null;
    if (!poster) {
      return res.status(400).send(responseError("File was not uploaded"));
    } else {
      url = `${SYSTEM.DOMAIN}/${poster.path}`;
    }

    const uploadedFilm = await storePosterByFilmId(filmId, url);
    if (!uploadedFilm) {
      return res.status(500).send(responseError("Cannot update film's poster"));
    }

    return res
      .status(200)
      .send(responseData("Update film's poster successfully"));
  }
);

filmRouter.delete(
  "/delete/:id",
  [authenticate, checkRole("ADMIN")],
  async (req, res) => {
    const { id: filmId } = req.params;

    const film = await getFilmDetailById(filmId);
    if (!film) {
      return res.status(404).send(responseError("Film doesn't exist"));
    }

    const deletedFilm = await deleteFilmById(filmId);

    if (!deletedFilm) {
      return res.status(500).send(responseError("Cannot delete film"));
    }

    return res.status(200).send(responseData("Delete film successfully"));
  }
);

filmRouter.get(
  "/get-film-list-pagination",
  [authenticate, checkRole("ADMIN"), paginationValidator],
  async (req, res) => {
    const { page, itemPerPage: limit } = req.query;
    const offset = (page - 1) * limit;
    const filmList = await getFilmListByPagination(
      Number(offset),
      Number(limit)
    );

    if (!filmList) {
      return res.status(500).send(responseError("Server has errors"));
    }

    const filmQuantity = await getFilmQuanity();
    if (!filmQuantity) {
      return res.status(500).send(responseError("Server has errors"));
    }

    const data = {
      currentPage: String(page),
      itemsPerPage: String(limit),
      totalPages: String(Math.ceil(filmQuantity / limit)),
      totalItems: String(filmQuantity),
      items: filmList,
    };

    return res
      .status(200)
      .send(responseData("Get film list successfully", data));
  }
);

filmRouter.get(
  "/get-film-list-by-release-date",
  [authenticate, checkRole("ADMIN"), keywordValidator],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(responseError("Keyword is invalid"));
    }

    const { date } = req.query;
    const filmList = await getFilmByReleaseDate(date);
    if (!filmList) {
      return res.status(500).send(responseError("Server has errors"));
    }

    return res
      .status(200)
      .send(responseData("Get film list successfully", filmList));
  }
);

module.exports = filmRouter;
