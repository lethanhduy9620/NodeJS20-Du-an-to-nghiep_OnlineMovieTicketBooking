"use strict";

const express = require("express");
const userRouter = require("./users");
const filmRouter = require("./films");
const cinemaRouter = require("./cinemas");
const showtimeRouter = require("./showtime");
const ticketRouter = require("./tickets");

const rootRouter = express.Router();

rootRouter.use("/users", userRouter);
rootRouter.use("/films", filmRouter);
rootRouter.use("/cinema", cinemaRouter);
rootRouter.use("/showtime", showtimeRouter);
rootRouter.use("/ticket", ticketRouter);

module.exports = rootRouter;
