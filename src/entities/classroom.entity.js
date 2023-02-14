const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CONSTANTS = require("../constants");

const classroom = new Schema(
  {
    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
    },
    subject: {
      type: String,
    },
  },
  { timestamps: true }
);

const Classroom = mongoose.model("Classroom", classroom);

module.exports = Classroom;
