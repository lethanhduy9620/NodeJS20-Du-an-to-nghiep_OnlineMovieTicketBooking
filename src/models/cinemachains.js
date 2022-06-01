"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CinemaChains extends Model {
    static associate({ Cinemas }) {
      this.hasMany(Cinemas, {
        foreignKey: "cinemaChainId",
        as: "cinemaList",
      });
    }
  }
  CinemaChains.init(
    {
      chainCode: DataTypes.STRING,
      name: DataTypes.STRING,
      logo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CinemaChains",
    }
  );
  return CinemaChains;
};
