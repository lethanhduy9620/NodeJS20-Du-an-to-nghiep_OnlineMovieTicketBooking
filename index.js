"use strict";

const express = require("express");
const { sequelize } = require("./src/models");
const rootRouter = require("./src/routers");
const config = require("./src/config");

const app = express();

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to econnect to the database:", err);
  });

app.use("", rootRouter);

app.listen(config.SYSTEM.PORT, () => {
  console.log(`Server running on port ${config.SYSTEM.PORT}`);
});
