const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CONSTANTS = require("../constants");

const action = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: {
      type: Date,
      default: new Date(),
    },
    action_type: {
      type: String,
      required: true,
      enum: Object.values(CONSTANTS.EntityConst.ACTION.TYPE),
    },
    add_info: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Action = mongoose.model("Action", action);

module.exports = Action;
