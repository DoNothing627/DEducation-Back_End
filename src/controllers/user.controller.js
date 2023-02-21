const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");
const ethers = require("ethers");
const Utils = require("../utils");
const ObjectId = require("mongoose").Types.ObjectId;

class User {
  constructor(opts) {
    this.model = opts.model;
  }

  Register = async ({
    user,
    wallet,
    username,
    password,
    date_of_birth,
    school_id,
    role_type,
  }) => {
    try {
      if (user.role != CONSTANTS.EntityConst.ROLE.SCHOOL) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
        );
      }
      var user = await this.model.User.findOne({ wallet: wallet });
      if (user != null) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.USER.WALLET_IN_USE
        );
      }
      if (user.role != CONSTANTS.Entity.ROLE.SCHOOL) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.USER.YOU_HAVE_NO_PERMISSION
        );
      }
      user = await this.model.User.createOne({
        wallet,
        username,
        password,
        date_of_birth,
        school_id,
        role_type,
      });
    } catch (error) {
      throw error;
    }
  };

  GetNonce = async ({ wallet }) => {
    try {
      console.log(wallet, "wallet");
      var user = await this.model.User.findOne({ wallet: wallet });
      if (user == null) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.USER.INVALID_WALLET
        );
      }
      var data = {
        nonce: user.nonce,
      };
      return ResponseFormat.formatResponse(200, "Ok", data);
    } catch (error) {
      throw error;
    }
  };

  VerifySignature = async ({ wallet, signature }) => {
    try {
      var user = await this.model.User.findOne({ wallet: wallet });
      if (user == null) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.USER.INVALID_WALLET
        );
      }
      // verify signature
      const publicKey = ethers.utils.verifyMessage(
        `I am signing my one-time nonce: ${user.nonce}`,
        signature
      );

      console.log(publicKey, "publicKey");
      if (publicKey != user.wallet) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.Message.USER.SIGNATURE_VERIFICATION_FAILED
        );
      }

      await this.model.User.findOneAndUpdate(
        { wallet: wallet },
        { nonce: Math.random(1, 1000000) }
      );

      const token = Utils.Token.createAccessToken(
        user._id,
        {
          method: "basic",
        },
        user.wallet,
        user.username
      );

      return ResponseFormat.formatResponse(
        200,
        "Login Successfully",
        {
          token: token,
          user_id: user._id,
          wallet: user.wallet,
          role: user.role,
        },
        200
      );
    } catch (error) {
      throw error;
    }
  };
  GetMyProfile = async (user) => {
    try {
      // var user = await this.model.User.findOne({ _id: user._id });
      // if (user == null) {
      //   throw RestError.NewInvalidInputError(
      //     CONSTANTS.MessageConst.USER.NOT_EXISTED
      //   );
      // }

      user = user.user;
      console.log(user._id.toString(), "user");

      var user_relationship = await this.model.PermissionRelaitonship.findOne({
        under_power_user_id: ObjectId(user._id.toString()),
        permission_type: CONSTANTS.EntityConst.PERMISSION.MANAGE,
      });

      if (user_relationship == null) {
        return ResponseFormat.formatResponse(
          200,
          "Successfully",
          {
            wallet: user.wallet,
            username: user.username,
            date_of_birth: user.date_of_birth,
            role: user.role,
          },
          200
        );
      }

      console.log(user_relationship, "user_relationship");
      var school = await this.model.User.findOne({
        _id: user_relationship.powerful_user_id,
      });

      console.log(user_relationship, "user_relationship");

      return ResponseFormat.formatResponse(
        200,
        "Successfully",
        {
          wallet: user.wallet,
          username: user.username,
          date_of_birth: user.date_of_birth,
          role: user.role,
          school: school.username,
        },
        200
      );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = User;
