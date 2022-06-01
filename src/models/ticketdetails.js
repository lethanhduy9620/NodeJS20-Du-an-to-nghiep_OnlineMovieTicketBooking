"use strict";
const {
  Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TicketDetails extends Model {
    static associate({
      Tickets,
      Seats
    }) {
      this.belongsTo(Tickets, {
        foreignKey: "ticketId",
      });

      this.belongsTo(Seats, {
        foreignKey: "seatId",
      });
    }
  }
  TicketDetails.init({
    ticketId: DataTypes.INTEGER,
    seatId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: "TicketDetails",
  });
  return TicketDetails;
};