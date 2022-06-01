"use strict";

const { Op, QueryTypes } = require("sequelize");
const { Users, sequelize } = require("../../models");

const createUser = async (data) => {
  try {
    const user = await Users.create(data);
    return user;
  } catch (error) {
    return null;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await Users.findOne({
      where: {
        email, // = email: email,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

const getUserById = async (id) => {
  try {
    const user = await Users.findOne({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

const updateUserById = async (id, data) => {
  try {
    const userUpdated = await Users.update(data, {
      where: {
        id,
      },
    });
    return userUpdated;
  } catch (error) {
    return null;
  }
};

const deleteUserById = async (id) => {
  try {
    const userDeleted = await Users.destroy({
      where: {
        id,
      },
    });

    return userDeleted;
  } catch (error) {
    return null;
  }
};

const getUserListAll = async () => {
  try {
    const userList = await Users.findAll();
    return userList;
  } catch (error) {
    return null;
  }
};

const searchUserByKeyword = async (keyword) => {
  try {
    const searchedData = await Users.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${keyword}%` } },
          { lastName: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
          { phoneNumber: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });

    return searchedData;
  } catch (error) {
    return null;
  }
};

const getUserListByPagination = async (offset, limit) => {
  try {
    const userList = await Users.findAll({
      offset,
      limit,
    });

    return userList;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserQuantity = async () => {
  try {
    const userQuantityQuery = await sequelize.query(
      "SELECT COUNT(id) AS userQuanity FROM users",
      {
        type: QueryTypes.SELECT,
      }
    );
    return userQuantityQuery[0].userQuanity;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserListAll,
  searchUserByKeyword,
  getUserListByPagination,
  getUserQuantity,
};
