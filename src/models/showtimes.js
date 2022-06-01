"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Showtimes extends Model {
    static associate({ Theaters, Films }) {
      this.belongsTo(Theaters, {
        foreignKey: "theaterId",
      });

      this.belongsTo(Films, {
        foreignKey: "filmId",
      });
    }
  }
  Showtimes.init(
    {
      dateTime: DataTypes.DATE,
      theaterId: DataTypes.INTEGER,
      filmId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Showtimes",
    }
  );
  return Showtimes;
};
