const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"],
    },
    checklist: {
      type: [String],
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
