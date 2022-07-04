const jwt = require("jsonwebtoken");

const TODO = require("../models/todo");
const USER = require("../models/user");
const catchHandler = require("../utils/catchHandler");
const ErrorResponse = require("../utils/ErrorResponse");

const findTodoById = catchHandler(async (req, res, next) => {
  const todo = await TODO.findById(req.params.id);

  if (todo == null) {
    return next(new ErrorResponse(404, "Todo not found"));
  }

  req.todo = todo;
  next();
});

const getTodos = catchHandler(async (req, res, next) => {
  const todos = await TODO.find();
  res.json({
    status: "success",
    data: todos,
    succuss: true,
  });
});

const getTodo = catchHandler(async (req, res, next) => {
  res.json({
    status: "success",
    data: req.todo,
    succuss: true,
  });
});

const createTodo = catchHandler(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new ErrorResponse(401, "Unauthorized access"));
  }

  const { id } = jwt.decode(token, process.env.JWT_KEY || "JSONWEBTOKENSECRET");

  const userRelated = await USER.findById(id);

  if (userRelated === null) {
    return next(new ErrorResponse(401, "Unauthorized access"));
  }

  delete req.body.token;
  const todo = await TODO.create({ ...req.body, user: userRelated._id });

  userRelated.todos.push(todo);
  await userRelated.save();

  res.json({
    status: "success",
    data: todo,
    succuss: true,
  });
});

const deleteTodo = catchHandler(async (req, res) => {
  await TODO.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    succuss: true,
  });
});

const updateTodo = catchHandler(async (req, res) => {
  const { body, todo } = req;

  const updatedtodo = await TODO.findByIdAndUpdate(todo._id, body, {
    new: true,
  });
  res.json({
    status: "success",
    data: updatedtodo,
    succuss: true,
  });
});

const moveTodo = catchHandler(async (req, res) => {
  const todo = await TODO.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({
    status: "success",
    data: todo,
    succuss: true,
  });
});

module.exports = {
  findTodoById,
  getTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
  moveTodo,
};
