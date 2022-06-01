"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Showtimes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dateTime: {
        type: Sequelize.DATE,
      },
      theaterId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Theaters",
          key: "id",
        },
      },
      filmId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Films",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Showtimes");
  },
};
