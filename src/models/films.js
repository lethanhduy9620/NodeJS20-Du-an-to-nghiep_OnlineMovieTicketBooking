"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Films extends Model {
    static associate({ Showtimes }) {
      this.hasMany(Showtimes, {
        foreignKey: "filmId",
        as: "showtimesByFilm",
      });
    }
  }
  Films.init(
    {
      name: DataTypes.STRING,
      genre: DataTypes.STRING,
      poster: DataTypes.STRING,
      trailer: DataTypes.STRING,
      rate: DataTypes.FLOAT,
      length: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      director: DataTypes.STRING,
      actor: DataTypes.STRING,
      releaseDate: DataTypes.DATE,
      isReleased: DataTypes.BOOLEAN,
      coomingSoon: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Films",
      paranoid: true,
    }
  );
  return Films;
};
