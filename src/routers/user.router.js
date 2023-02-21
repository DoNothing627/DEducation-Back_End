const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

//middleware
const TokenAuthenticate = require("../middleware/authenticate");
const RequireJsonContent = require("../middleware/json-content");

const { jsonValidate } = require("../middleware/json-validate");
// const { ApplyRequestSchema } = require("../middleware/validate/index");

//utils
// const { responseHandle } = require("../utils/response-handle.util");
// const { USER } = require("../constants/entity.constant");

const { apiHandler, apiFilesHandler } = require("../middleware/handler");

class User {
  constructor(opts) {
    this.ctrl = opts.ctrl;
    this.router = express.Router();

    this.router.post(
      "/",
      jsonParser,
      RequireJsonContent,
      apiHandler(this.ctrl.User.Register)
    );

    this.router.get(
      "/nonce/:wallet",
      jsonParser,
      RequireJsonContent,
      apiHandler(this.ctrl.User.GetNonce)
    );

    this.router.put(
      "/",
      jsonParser,
      RequireJsonContent,
      apiHandler(this.ctrl.User.VerifySignature)
    );
    this.router.get(
      "/profile",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.User.GetMyProfile)
    );
  }
  getRouter = () => {
    return this.router;
  };
}

module.exports = User;
