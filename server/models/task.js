const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isChecked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

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
      type: [checklistItemSchema],
      required: true,
    },
    dueDate: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentStatus: {
      type: String,
      required: true,
      enum: ["TODO", "BACKLOG", "PROGRESS", "DONE"],
      default: "TODO",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
