const express = require("express");

const login = require("../../controller/authController/login");
const logout = require("../../controller/authController/logout");
const { register } = require("../../controller/authController/register");
const isEmailVertify = require("../../middlwares/isEmailVertify");

const authRouter = express.Router();

authRouter
  .post("/register", register)
  .post("/login", isEmailVertify, login)
  .post("/logout", logout);

module.exports = authRouter;
