const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");

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
      var permissionRelaitonship;
      if (is_powerful) {
        permissionRelaitonship =
          await this.model.PermissionRelaitonship.findMany({
            powerful_user_id: user._id,
            permission_type: permission_type,
          });
      } else {
        permissionRelaitonship =
          await this.model.PermissionRelaitonship.findMany({
            under_power_user_id: user._id,
            permission_type: per,
          });
      }
      return ResponseFormat.formatResponse(200, "Ok", permissionRelaitonship);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = PermissionRelaitonship;
