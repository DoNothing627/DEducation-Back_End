const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Constant = require("../constants/entity.const");

const permissionRelaitonship = new Schema(
  {
    powerful_user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    under_power_user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    permission_type: {
      type: Number,
      enum: Object.values(Constant.PERMISSION),
      require: true,
    },
  },
  { timestamps: true }
);

const PermissionRelaitonship = mongoose.model(
  "PermissionRelationship",
  permissionRelaitonship
);

module.exports = PermissionRelaitonship;
