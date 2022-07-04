const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const TodeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["todo", "inProgress", "underReview", "rework", "completed"],
      default: "todo",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = model("Todo", TodeSchema);

module.exports = Todo;
