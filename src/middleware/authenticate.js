let jwt = require("jsonwebtoken");
const HttpStatus = require("http-status-codes");
const CONSTANTS = require("../constants");
const UserEntity = require("../entities/user.entity");
const ActionEntity = require("../entities/action.entity");
const Utils = require("../utils");
const fs = require("fs");
var publicKEY = fs.readFileSync(`src/keys/public.key`, "utf8");

const authorization = async (req, res, next) => {
  try {
    let token = req.headers["x-auth"];
    if (token) {
      token = token.split(" ");
      if (token[1] && token[0].toLowerCase() === "bearer") {
        jwt.verify(
          token[1],
          publicKEY,
          { algorithms: CONSTANTS.EncryptConst.ENCRYPT_ALGORITHMS },
          async (err, payload) => {
            if (err) {
              // console.log(err)
              return res
                .status(HttpStatus.UNAUTHORIZED)
                .send({ msg: "Token expired" });
            }
            // console.log(`payload = `, payload);

            //check in blacklist token
            // const blacklistTokens = await Utils.Redis.getDataBlacklistTokens(
            //   payload.user_id
            // );

            // if (blacklistTokens && blacklistTokens.includes(token)) {
            //   return res.status(HttpStatus.UNAUTHORIZED).send({
            //     success: false,
            //     message: "User is logged out.",
            //   });
            // }

            // req.payload = payload
            const user = await UserEntity.findOne({
              _id: payload.user_id,
            });
            // console.log(user, "user");
            if (!user)
              return res
                .status(HttpStatus.UNAUTHORIZED)
                .send({ msg: "Token incorrect" });
            // if (user.status !== CONSTANTS.EntityConst.USER.STATUS.COMPLETED)
            //   return res
            //     .status(HttpStatus.UNAUTHORIZED)
            //     .send({ msg: "user inactive" });
            req.user = user;
            // req.auth_provider = payload.method;

            // if (!(await Utils.Redis.getDailyLogin(user._id.toString()))) {
            let nextDate = Utils.Convert.getCurrentDate(
              new Date().getTime() + 86400000
            );
            //   let now = new Date().getTime();
            //   await Utils.Redis.saveDailyLogin(
            //     user._id.toString(),
            //     Math.round((nextDate > now ? nextDate - now : 0) / 1000)
            //   );
            //   await ActionEntity.create({
            //     user: payload.user_id,
            //     time: new Date(nextDate - 86400000),
            //     action_type: CONSTANTS.EntityConst.ACTION.TYPE.DAILY_LOGIN,
            //   });
            // }

            await ActionEntity.create({
              user_id: payload.user_id,
              time: new Date(nextDate - 86400000),
              action_type: CONSTANTS.EntityConst.ACTION.TYPE.DAILY_LOGIN,
            });

            //write log action
            // await _writeLogAction(req)

            next();
          }
        );
      } else {
        // return Promise.reject('Token incorrect')
        // console.log(`here = `)
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ msg: "Token incorrect" });
      }
    } else {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send({ msg: "Token is required" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .send({ msg: "Token is required" });
  }
};

module.exports = authorization;
