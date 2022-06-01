"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Films",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
          type: Sequelize.STRING,
        },
        genre: {
          type: Sequelize.STRING,
        },
        poster: {
          type: Sequelize.STRING,
        },
        trailer: {
          type: Sequelize.STRING,
        },
        rate: {
          type: Sequelize.FLOAT,
        },
        length: {
          type: Sequelize.INTEGER,
        },
        description: {
          type: Sequelize.TEXT,
        },
        director: {
          type: Sequelize.STRING,
        },
        actor: {
          type: Sequelize.STRING,
        },
        releaseDate: {
          type: Sequelize.DATEONLY,
        },
        isReleased: {
          type: Sequelize.BOOLEAN,
        },
        coomingSoon: {
          type: Sequelize.BOOLEAN,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: true,
        paranoid: true,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Films");
  },
};
