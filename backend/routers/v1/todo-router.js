const express = require("express");
const {
  getTodos,
  createTodo,
  findTodoById,
  getTodo,
  deleteTodo,
  updateTodo,
  moveTodo,
} = require("../../controller/todoController");

const todoRouter = express.Router();

todoRouter.route("/").get(getTodos).post(createTodo);

todoRouter.patch("/move/:id", moveTodo);

todoRouter
  .route("/:id")
  .all(findTodoById)
  .get(getTodo)
  .delete(deleteTodo)
  .patch(updateTodo);

module.exports = todoRouter;
