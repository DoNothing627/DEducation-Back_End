const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");
const ObjectId = require("mongoose").Types.ObjectId;

class PermissionRelaitonship {
  constructor(opts) {
    this.model = opts.model;
  }

  CreateNewRelationship = async ({
    user,
    powerful_user_id,
    under_power_user_id,
    permission_type,
  }) => {
    try {
      if (user.role != CONSTANTS.EntityConst.ROLE.SCHOOL) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
        );
      }
      var permissionRelaitonship =
        await this.model.PermissionRelaitonship.findOne({
          powerful_user_id: user._id,
          under_power_user_id: under_power_user_id,
        });
      if (
        permissionRelaitonship == null ||
        permissionRelaitonship.permission_type !=
          CONSTANTS.EntityConst.PERMISSION.MANAGE
      ) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.PERMISSION.YOU_HAVE_NO_PERMISSION
        );
      }
      permissionRelaitonship = await this.model.PermissionRelaitonship.findOne({
        powerful_user_id: user._id,
        under_power_user_id: powerful_user_id,
      });
      if (
        permissionRelaitonship == null ||
        permissionRelaitonship.permission_type !=
          CONSTANTS.EntityConst.PERMISSION.MANAGE
      ) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.PERMISSION.YOU_HAVE_NO_PERMISSION
        );
      }

      await this.model.PermissionRelaitonship.CreateOne({
        powerful_user_id: powerful_user_id,
        under_power_user_id: under_power_user_id,
        permission_type: permission_type,
      });
    } catch (error) {
      throw error;
    }
  };

  GetMyRelationships = async ({ user, permission_type, is_powerful }) => {
    try {
      console.log("permission_type", user);
      var permissionRelaitonship;
      var getMyRelationshipsResponse = [];
      if (is_powerful == "true") {
        permissionRelaitonship =
          await this.model.PermissionRelaitonship.findMany(
            {
              powerful_user_id: ObjectId(user._id.toString()),
              permission_type: permission_type,
            },
            "under_power_user_id"
          );
        permissionRelaitonship.forEach((element) => {
          getMyRelationshipsResponse.push({
            _id: element.under_power_user_id._id.toString(),
            wallet: element.under_power_user_id.wallet,
            username: element.under_power_user_id.username,
            date_of_birth: element.under_power_user_id.date_of_birth,
          });
        });
      } else {
        permissionRelaitonship =
          await this.model.PermissionRelaitonship.findMany(
            {
              under_power_user_id: ObjectId(user._id.toString()),
              permission_type: permission_type,
            },
            "powerful_user_id"
          );
        permissionRelaitonship.forEach((element) => {
          getMyRelationshipsResponse.push({
            _id: element.powerful_user_id._id.toString(),
            wallet: element.powerful_user_id.wallet,
            username: element.powerful_user_id.username,
            date_of_birth: element.powerful_user_id.date_of_birth,
          });
        });
      }
      return ResponseFormat.formatResponse(
        200,
        "Ok",
        getMyRelationshipsResponse
      );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = PermissionRelaitonship;
