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

class PermissionRelaitonship {
  constructor(opts) {
    this.ctrl = opts.ctrl;
    this.router = express.Router();

    this.router.post(
      "/",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.PermissionRelaitonship.CreateNewRelationship)
    );

    this.router.get(
      "/:permission_type",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.PermissionRelaitonship.GetMyRelationship)
    );
  }
  getRouter = () => {
    return this.router;
  };
}

module.exports = PermissionRelaitonship;
