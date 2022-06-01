"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    toJSON() {
      const attributes = Object.assign({}, this.get());

      delete attributes.password;
      return attributes;
    }

    static associate({ Tickets }) {
      this.hasMany(Tickets, {
        foreignKey: "userId",
      });
    }
  }
  Users.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      password: DataTypes.STRING,
      DOB: DataTypes.DATE,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Users",
    }
  );
  return Users;
};
