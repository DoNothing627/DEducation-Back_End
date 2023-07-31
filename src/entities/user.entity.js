const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Constant = require("../constants/entity.const");

const user = new Schema(
  {
    wallet: {
      type: String,
      unique: true,
      require: true,
    },
    username: {
      type: String,
      unique: true,
      require: true,
    },
    student_id_code: {
      type: String,
      // unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    date_of_birth: {
      type: String,
    },
    public_status: {
      type: Boolean,
    },
    role: {
      type: Number,
      enum: Object.values(Constant.ROLE),
      require: true,
    },
    diploma: {
      type: Schema.Types.ObjectId,
      ref: "Diploma",
    },
    nonce: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", user);

module.exports = User;
