const jwt = require("jsonwebtoken");
const catchHandler = require("../../utils/catchHandler");
const USER = require("../../models/user");
const TODO = require("../../models/todo");

const getCurrentUser = catchHandler(async (req, res) => {
  const token = req.cookies.token_uid;
  if (!token) {
    return res.send({
      success: true,
      data: { currentUser: null },
      message: "token is not available.",
    });
  }
  const { id } = jwt.verify(token, process.env.JWT_KEY || "JSONWEBTOKENSECRET");
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.send({
      success: true,
      data: { currentUser: null },
      message: "token is not valid.",
    });
  }
  const user = await USER.findById(id);

  if (!user) {
    return res.send({
      success: true,
      data: { currentUser: null },
      message: "token is not valid.",
    });
  }

  res.send({
    success: true,
    data: { currentUser: user },
    message: "valid token",
  });
});

const listUserTodos = catchHandler(async (req, res, next) => {
  const { todos } = req.user;

  const todoList = await TODO.find({ _id: { $in: todos } });

  res.status(200).json({
    success: true,
    data: todoList,
    message: "user todos are fetched",
  });
});

const getUsers = catchHandler(async (req, res, next) => {
  const users = await USER.find();
  res.json({
    status: "success",
    data: users,
    succuss: true,
  });
});

module.exports = { getCurrentUser, listUserTodos, getUsers };
