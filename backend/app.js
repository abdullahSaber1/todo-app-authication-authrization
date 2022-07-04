const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const app = express();

const todoRouter = require("./routers/v1/todo-router");
const errorHandler = require("./middlwares/errorHandler");
const authRouter = require("./routers/v1/auth-router");
const userRouter = require("./routers/v1/user-router");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/todos", todoRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// handle Previous URL Of middleware
app.all("*", (req, res) => {
  res.json({
    status: "Failure",
    message: "wrong url",
  });
});

// global error Handler
app.use(errorHandler);

module.exports = app;
