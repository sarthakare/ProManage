const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Add any other fields you might need
  },
  { timestamps: true }
);

const AssignUser = mongoose.model("AssignUser", assignUserSchema);

module.exports = AssignUser;
