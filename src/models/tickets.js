"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    static associate({ Users, Showtimes, TicketDetails }) {
      this.belongsTo(Users, {
        foreignKey: "userId",
      });
      this.belongsTo(Showtimes, {
        foreignKey: "showtimeId",
      });
      this.hasMany(TicketDetails, {
        foreignKey: "ticketId",
        as: "seatList",
      });
    }
  }
  Tickets.init(
    {
      userId: DataTypes.INTEGER,
      showtimeId: DataTypes.INTEGER,
      payment: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Tickets",
    }
  );
  return Tickets;
};
