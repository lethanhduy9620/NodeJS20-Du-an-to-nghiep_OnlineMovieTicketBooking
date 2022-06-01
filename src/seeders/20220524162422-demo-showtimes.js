"use strict";
const moment = require("moment");

module.exports = {
  async up(queryInterface, Sequelize) {
    let showTimeData = [];
    let startDate = "2022-05-06";
    for (let filmId = 1; filmId <= 3; filmId++) {
      for (let theaterId = 1; theaterId <= 8; theaterId++) {
        for (let startTime = 8; startTime < 22; startTime += 2) {
          let sampleData = {
            dateTime: moment(
              startDate + "T" + ("0" + startTime).slice(-2) + ":00:00"
            )
              .parseZone()
              .format("YYYY-MM-DD[T]HH:mm:ss"),
            theaterId,
            filmId,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          showTimeData.push(sampleData);
        }
      }
      startDate = moment(startDate).add(1, "day").format("YYYY-MM-DD");
      if (new Date(startDate).getDate() > 9) {
        break;
      }
    }

    return queryInterface.bulkInsert("Showtimes", showTimeData, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Showtimes", null, {});
  },
};
