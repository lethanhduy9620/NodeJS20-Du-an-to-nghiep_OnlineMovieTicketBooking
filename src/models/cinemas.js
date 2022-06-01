"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cinemas extends Model {
    toJSON() {
      const attributes = Object.assign({}, this.get());

      delete attributes.createdAt;
      delete attributes.deteletedAt;
      delete attributes.updatedAt;
      return attributes;
    }

    static associate({ CinemaChains, Theaters }) {
      this.belongsTo(CinemaChains, {
        foreignKey: "cinemaChainId",
      });

      this.hasMany(Theaters, {
        foreignKey: "cinemaId",
        as: "theaterList",
      });
    }
  }
  Cinemas.init(
    {
      cinemaCode: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      cinemaChainId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cinemas",
    }
  );
  return Cinemas;
};
