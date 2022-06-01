"use strict";

const NUMBER_CLONE_USER = 2;

module.exports = {
  async up(queryInterface, Sequelize) {
    const userData = [];

    for (let i = 0; i < NUMBER_CLONE_USER; i++) {
      let user = {
        firstName: `Thomas ${i}`,
        lastName: `Le ${i}`,
        DOB: "1996-06-30",
        email: `lethanhduy${i}@gmail.com`,
        password: "password",
        phoneNumber: "0123456789",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      userData.push(user);
    }

    return queryInterface.bulkInsert("Users", userData);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
