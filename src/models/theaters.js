"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Theaters extends Model {
    static associate({ Cinemas, Seats, Showtimes }) {
      this.belongsTo(Cinemas, {
        foreignKey: "cinemaId",
      });

      this.hasMany(Seats, {
        foreignKey: "theaterId",
      });

      this.hasMany(Showtimes, {
        foreignKey: "theaterId",
      });
    }
  }
  Theaters.init(
    {
      name: DataTypes.STRING,
      cinemaId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Theaters",
    }
  );
  return Theaters;
};
