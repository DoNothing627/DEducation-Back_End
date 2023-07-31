const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diploma = new Schema(
  {
    hashcode: {
      type: String,
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    school_id:{
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    classification: {
      type: String,
    },
    txHash: {
      type: String,
    }
  },
  { timestamps: true }
);

const Diploma = mongoose.model("Diploma", diploma);

module.exports = Diploma;
