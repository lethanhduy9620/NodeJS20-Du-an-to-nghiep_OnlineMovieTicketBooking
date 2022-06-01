"use strict";

const NUMBER_THEATER_PER_CINEMA = 2;

module.exports = {
  async up(queryInterface, Sequelize) {
    //Get quantity of Cinema in cinemas table
    const numerCinemaQuery = await queryInterface.sequelize.query(
      `SELECT COUNT(id) AS numberCinema FROM cinemas;`
    );

    const { numberCinema } = numerCinemaQuery[0][0];

    //Clone and assign theater for each cinema
    const theaterData = [];
    let intialId = 1;
    for (let i = 0; i < numberCinema; i++) {
      for (let j = 0; j < NUMBER_THEATER_PER_CINEMA; j++) {
        let theater = {
          id: intialId,
          name: `Rạp ${j + 1}`,
          cinemaId: i + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        theaterData.push(theater);
        intialId++;
      }
    }

    return queryInterface.bulkInsert("Theaters", theaterData, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Theaters", null, {});
  },
};
