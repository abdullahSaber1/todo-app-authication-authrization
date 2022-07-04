const express = require("express");
const { vertifyEmail } = require("../../controller/authController/register");
const {
  getUsers,
  listUserTodos,
  getCurrentUser,
} = require("../../controller/userController");
const {
  resetPassword,
  forgotPasswordToken,
} = require("../../controller/userController/resetPassword");

const { authGaurd } = require("../../middlwares/authGuard");

const userRouter = express.Router();

userRouter
  .get("/", getUsers)
  .get("/verify-email", vertifyEmail)
  .get("/todoList", authGaurd, listUserTodos)
  .get("/currentuser", getCurrentUser)
  .post("/forgot-password", forgotPasswordToken)
  .put("/reset-password", resetPassword);

module.exports = userRouter;
