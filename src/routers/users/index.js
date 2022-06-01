"use strict";
const express = require("express");
const { validationResult } = require("express-validator");
const { authenticate, checkRole } = require("../../middleware/auth");
const {
  signInValidator,
  signUpValidator,
  searchKeywordValidator,
  updateValitor,
} = require("../../middleware/validators/users");

const {
  scriptPassword,
  comparePassword,
  generateToken,
} = require("../../services/auth");

const {
  responseData,
  responseDataWithToken,
  responseError,
} = require("../../services/response");

const {
  createUser,
  getUserByEmail,
  updateUserById,
  getUserById,
  deleteUserById,
  getUserListAll,
  searchUserByKeyword,
  getUserListByPagination,
  getUserQuantity,
} = require("../../services/users");

const userRouter = express.Router();

//Sign-up
userRouter.post("/sign-up", [signUpValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send(responseError("Sign up failed", errors.array()));
  }

  const { firstName, lastName, DOB, email, password, phoneNumber } = req.body;

  const alreadyAccount = await getUserByEmail(email);
  if (alreadyAccount) {
    return res.status(400).send(responseError("This email has aldready used"));
  }

  //  Add data into database
  const data = await createUser({
    firstName,
    lastName,
    DOB,
    email,
    password: scriptPassword(password),
    phoneNumber,
    role: "USER",
  });

  if (!data) {
    return res.status(500).send(responseError("Cannot create account"));
  }

  return res
    .status(200)
    .send(responseData("Successfully created account", data));
});

//Sign-in
userRouter.post("/sign-in", [signInValidator], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send(responseError("Sign in failed", errors.array()));
  }

  const { email, password } = req.body;

  //Check email is available in database
  const user = await getUserByEmail(email);

  // Response deny message if email is invalid
  if (!user) {
    return res.status(404).send(responseError(`Email ${email} not found`));
  }

  //Compare input password with user's password stored in database
  const isMatch = comparePassword(password, user.password);

  if (!isMatch) {
    return res.status(401).send(responseError("Password is not match"));
  }

  const token = generateToken({ data: user.id });

  //Response successful message with identification token
  return res
    .status(200)
    .send(responseDataWithToken("Successful log in", user, token));
});

//Update user info
/**
 * !User cannot change email
 */
userRouter.patch("/update", [authenticate, updateValitor], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .send(responseError("User's infomation update failed", errors.array()));
  }

  const { user } = req;
  const { firstName, lastName, DOB, phoneNumber } = req.body;

  const isUpdate = await updateUserById(user.id, {
    firstName,
    lastName,
    DOB,
    phoneNumber,
  });

  if (!isUpdate) {
    return res.status(500).send(responseError("Cannot update user info"));
  }

  return res
    .status(200)
    .send(responseData("Update user information successfully"));
});

//Delete user (soft detele)
userRouter.delete(
  "/delete/:id",
  [authenticate, checkRole("ADMIN")],
  async (req, res) => {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).send(responseError("User doesn't exist"));
    }

    const isDeleted = await deleteUserById(userId);

    if (!isDeleted) {
      return res.status(500).send(responseError("Cannot delete user"));
    }

    return res.status(200).send(responseData("Delete user successfully"));
  }
);

// Get user list for admin dashboard
userRouter.get(
  "/get-user-list-all",
  [authenticate, checkRole("ADMIN")],
  async (req, res) => {
    const userList = await getUserListAll();

    if (!userList) {
      return res.status(500).send(responseError("Cannot get user list"));
    }
    return res
      .status(200)
      .send(responseData("Get user list succesfully", userList));
  }
);

//Get user by keyword
userRouter.get(
  "/search-user",
  [authenticate, checkRole("ADMIN"), searchKeywordValidator],
  async (req, res) => {
    //Sample url: /search-user?keyword=user1
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(responseError("Keyword is invalid"));
    }

    const searchedData = await searchUserByKeyword(req.query.keyword);
    if (!searchedData) {
      return res.status(500).send(responseError("Server has errors"));
    }

    return res
      .status(200)
      .send(responseData("Search data successfully", searchedData));
  }
);

userRouter.get(
  "/get-user-list-by-pagination",
  [authenticate, checkRole("ADMIN")],
  async (req, res) => {
    const { page, itemPerPage: limit } = req.query;
    const offset = (page - 1) * limit;
    const userList = await getUserListByPagination(
      Number(offset),
      Number(limit)
    );
    if (!userList) {
      return res.status(500).send(responseError("Server has errors"));
    }

    const userQuantity = await getUserQuantity();
    if (!userQuantity) {
      return res.status(500).send(responseError("Server has errors"));
    }

    const data = {
      currentPage: String(page),
      itemsPerPage: String(limit),
      totalPages: String(Math.ceil(userQuantity / limit)),
      totalItems: String(userQuantity),
      items: userList,
    };

    return res
      .status(200)
      .send(responseData("Get user list successfully", data));
  }
);

module.exports = userRouter;
