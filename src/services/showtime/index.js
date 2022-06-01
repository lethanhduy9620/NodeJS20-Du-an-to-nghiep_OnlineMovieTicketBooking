"use strict";

const {
  Films,
  Showtimes,
  Theaters,
  Cinemas,
  Seats,
  Tickets,
  TicketDetails,
} = require("../../models");

const {
  queryTheaterIdByCinemaId,
  getTheaterNameByTheaterId,
} = require("../theaters");
const { toPlain } = require("../util");
const {
  getCinemaInfoByCinemaChain,
  getCinemaChainAndCinema,
} = require("../cinema");
const { getFilmDetailById } = require("../films");
const moment = require("moment");

const checkShowtimeExist = async (showtimeId) => {
  try {
    const showtime = await Showtimes.findOne({
      where: {
        id: showtimeId,
      },
    });
    return showtime;
  } catch (error) {
    return null;
  }
};

const getShowtimeOfFilmByTheaterId = async (theaterIdArray) => {
  try {
    const filmData = await Films.findAll({
      attributes: [
        ["id", "filmId"],
        ["name", "filmName"],
        "poster",
        "isReleased",
        "coomingSoon",
      ],
      include: {
        model: Showtimes,
        as: "showtimesByFilm",
        attributes: [["id", "showTimeId"], "dateTime", "theaterId"],
        where: {
          theaterId: theaterIdArray,
        },
      },
    });

    return filmData;
  } catch (error) {
    return null;
  }
};

const getShowtimeByCinemaChain = async (chainCode) => {
  // * Get info of cinema chain & cinema
  const cinemaInfo = await getCinemaInfoByCinemaChain(chainCode); //cinemaInfo is type of Sequelize's instance
  if (!cinemaInfo) {
    return null;
  }

  const showTimeData = toPlain(cinemaInfo); //Convert Sequelize's instance to plain object

  //Add list of films shown at specific cinema
  for (let cinema of showTimeData[0].cinemaList) {
    // * Get list of theaters by cinema chain
    const theaterIdArray = await queryTheaterIdByCinemaId(cinema.cinemaId);
    if (!theaterIdArray) {
      return null;
    }

    // * Get list of film's showtime by cinema
    const filmInfo = await getShowtimeOfFilmByTheaterId(theaterIdArray); //filmData is type of Sequelize's instance
    if (!filmInfo) {
      return null;
    }

    const filmData = toPlain(filmInfo);

    // Add theaterName into showtimeByFilm property
    let cacheTheaterName = {};
    for (let film of filmData) {
      for (let showtime of film.showtimesByFilm) {
        if (cacheTheaterName[showtime.theaterId]) {
          showtime["theaterName"] = cacheTheaterName[showtime.theaterId];
        } else {
          showtime["theaterName"] = await getTheaterNameByTheaterId(
            showtime.theaterId
          );
          cacheTheaterName[showtime.theaterId] = showtime["theaterName"];
        }
      }
    }

    //Add filmList into cinemaList
    cinema["filmList"] = filmData;
  }

  return showTimeData;
};

const getShowtimeByTheaterIdAndFilmId = async (theaterIdArray, filmId) => {
  try {
    const showtimeList = await Showtimes.findAll({
      where: {
        filmId,
        theaterId: theaterIdArray,
      },
      attributes: [["id", "showTimeId"], "dateTime", "theaterId"],
    });

    return showtimeList;
  } catch (error) {
    return null;
  }
};

const getShowtimeByFilmId = async (filmId) => {
  const chainAndCinemaListIns = await getCinemaChainAndCinema();
  const showtimeByFilm = toPlain(chainAndCinemaListIns);

  for (let cinemaChain of showtimeByFilm) {
    for (let cinema of cinemaChain.cinemaList) {
      const theaterIdArray = await queryTheaterIdByCinemaId(cinema.cinemaId);
      if (!theaterIdArray) {
        return null;
      }

      const showtimeListIns = await getShowtimeByTheaterIdAndFilmId(
        theaterIdArray,
        filmId
      );
      if (!showtimeListIns) {
        return null;
      }
      const showTimeList = toPlain(showtimeListIns);

      let cacheTheaterName = {};
      for (let showtime of showTimeList) {
        if (cacheTheaterName[showtime.theaterId]) {
          showtime["theaterName"] = cacheTheaterName[showtime.theaterId];
        } else {
          showtime["theaterName"] = await getTheaterNameByTheaterId(
            showtime.theaterId
          );
          cacheTheaterName[showtime.theaterId] = showtime["theaterName"];
        }
      }

      cinema["showtimeList"] = showTimeList;
    }
  }

  const filmDetailIns = await getFilmDetailById(filmId);
  const filmDetailWithShowtime = toPlain(filmDetailIns);

  filmDetailWithShowtime["cinemaChain"] = showtimeByFilm;

  delete filmDetailWithShowtime.director;
  delete filmDetailWithShowtime.actor;

  return filmDetailWithShowtime;
};

const getReservedSeatByShowtimeId = async (showtimeId) => {
  try {
    const reservedSeatListIns = await Tickets.findAll({
      where: {
        showtimeId,
      },
      attributes: ["id"],
      include: {
        model: TicketDetails,
        as: "seatList",
        attributes: ["seatId"],
      },
    });

    const reservedSeatList = toPlain(reservedSeatListIns);
    if (reservedSeatList.length === 0) {
      return [];
    } else {
      return reservedSeatList[0].seatList.map((seat) => seat.seatId);
    }
  } catch (error) {
    return null;
  }
};

const getShowtimeInfoByShowtimeId = async (showtimeId) => {
  try {
    const showtimeRawInfoIns = await Showtimes.findAll({
      where: {
        id: showtimeId,
      },
      attributes: [["id", "showtimeId"], "dateTime"],
      include: [
        {
          model: Films,
          attributes: [["id", "filmId"], ["name", "filmName"], "poster"],
        },
        {
          model: Theaters,
          attributes: [
            ["id", "theaterId"],
            ["name", "theaterName"],
          ],
          include: [
            {
              model: Cinemas,
              attributes: [
                ["id", "cinemaId"],
                ["name", "cinemaName"],
                "address",
              ],
            },
            {
              model: Seats,
              attributes: [
                ["id", "seatId"],
                ["name", "seatName"],
                "price",
                "type",
              ],
            },
          ],
        },
      ],
    });

    const showtimeRawInfo = toPlain(showtimeRawInfoIns);

    const filmInfo = {
      showtimeId: showtimeRawInfo[0].showtimeId,
      cinemaName: showtimeRawInfo[0].Theater.Cinema.cinemaName,
      theaterId: showtimeRawInfo[0].Theater.theaterId,
      theaterName: showtimeRawInfo[0].Theater.theaterName,
      address: showtimeRawInfo[0].Theater.Cinema.address,
      filmName: showtimeRawInfo[0].Film.filmName,
      poster: showtimeRawInfo[0].Film.poster,
      date: moment(showtimeRawInfo[0].dateTime)
        .parseZone()
        .format("YYYY-MM-DD"),
      time: moment(showtimeRawInfo[0].dateTime)
        .subtract(7, "hours")
        .format("HH:mm"), //Returned timezone datetime from database is UTC so need to substract 7 (GMT VN) to get desired time
    };

    const reservedSeatListArray = await getReservedSeatByShowtimeId(showtimeId);

    const seatList = [...showtimeRawInfo[0].Theater.Seats];

    seatList.forEach((seat) => {
      if (reservedSeatListArray.indexOf(Number(seat.seatId)) >= 0) {
        seat.isReserved = true;
      } else {
        seat.isReserved = false;
      }
    });

    const returnShowtimeInfo = {
      filmInfo,
      seatList,
    };

    return returnShowtimeInfo;
  } catch (error) {
    return null;
  }
};

const createShowtime = async (data) => {
  try {
    const showtime = await Showtimes.create(data);
    return showtime;
  } catch (error) {
    return null;
  }
};

module.exports = {
  checkShowtimeExist,
  getShowtimeByCinemaChain,
  getShowtimeByFilmId,
  getShowtimeInfoByShowtimeId,
  createShowtime,
};
