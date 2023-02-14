const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CONSTANTS = require("../constants");

const semester = new Schema(
  {
    school: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    semester_name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Semester = mongoose.model("Semester", semester);

module.exports = Semester;
