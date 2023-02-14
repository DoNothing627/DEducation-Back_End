const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const CONSTANTS = require("../constants");
const privateKEY = fs.readFileSync(`./src/keys/private.key`, "utf8");

function createRefreshToken(user_id) {
  const timeCreate = new Date().getTime();
  const data = user_id + timeCreate;

  const value = crypto
    .createHash(CONSTANTS.UtilsConst.ENCRYPT.HASH_ALGORITHMS)
    .update(data)
    .digest("base64");

  //return refresh token
  return value;
}

function createAccessToken(user_id, payload = null, email, username) {
  var signOptions = {
    expiresIn: CONSTANTS.UtilsConst.JWT_TOKEN_DURATION, // 10 minute validity
    algorithm: CONSTANTS.UtilsConst.ENCRYPT_ALGORITHMS,
  };
  let expiredTime =
    new Date().getTime() + CONSTANTS.UtilsConst.JWT_TOKEN_DURATION * 1000;
  var accessToken = "";
  if (payload) {
    accessToken = jwt.sign(
      {
        ...payload,
        user_id: user_id,
        expired_time: expiredTime,
        email,
        username,
      },
      privateKEY,
      signOptions
    );
  } else {
    accessToken = jwt.sign(
      {
        user_id: user_id,
        expired_time: expiredTime,
        email,
        username,
      },
      privateKEY,
      signOptions
    );
  }

  return { accessToken, expiredTime };
}

module.exports = {
  createRefreshToken,
  createAccessToken,
};
