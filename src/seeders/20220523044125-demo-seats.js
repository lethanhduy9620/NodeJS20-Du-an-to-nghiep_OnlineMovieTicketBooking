"use strict";

const NUMBER_SEAT_PER_THEATER = 10;

const createTheaterIdArray = (objecArray) => {
  let array = [];
  objecArray.forEach((item) => {
    let itemId = item.id;
    array.push(itemId);
  });
  return array;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const theaterIdQuery = await queryInterface.sequelize.query(
      `SELECT id FROM theaters;`
    );

    const theaterIdList = theaterIdQuery[0];

    const theaterIdArray = createTheaterIdArray(theaterIdList);

    let seatData = [];
    let initialId = 1;
    for (let i = 0; i < theaterIdArray.length; i++) {
      for (let j = 0; j < NUMBER_SEAT_PER_THEATER; j++) {
        let seat = {
          id: initialId,
          name: `${j + 1}`,
          price: 50000,
          type: "economy",
          theaterId: theaterIdArray[i],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        if (j > NUMBER_SEAT_PER_THEATER * (2 / 3)) {
          seat.type = "vip";
          seat.price = 70000;
        }

        seatData.push(seat);
        initialId++;
      }
    }

    // return queryInterface.bulkInsert("Seats", [{}]);
    return queryInterface.bulkInsert("Seats", seatData);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Seats", null, {});
  },
};
