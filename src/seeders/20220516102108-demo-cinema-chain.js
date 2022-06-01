"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("CinemaChains", [
      {
        id: 1,
        chainCode: "cgv",
        name: "CGV",
        logo: "/images/film/logo/cgv_logo.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        chainCode: "galaxy",
        name: "Galaxy Cinema",
        logo: "/images/film/logo/galaxy_logo.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("CinemaChains", null, {});
  },
};
