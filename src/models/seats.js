"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seats extends Model {
    static associate({
      Theaters,
      TicketDetails
    }) {
      this.belongsTo(Theaters, {
        foreignKey: "theaterId",
      });
      this.hasMany(TicketDetails, {
        foreignKey: "seatId",
      });
    }
  }
  Seats.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    type: DataTypes.STRING,
    theaterId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: "Seats",
  });
  return Seats;
};