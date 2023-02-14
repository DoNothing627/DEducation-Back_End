const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");
const ethers = require("ethers");
const Utils = require("../utils");

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
}

module.exports = User;
