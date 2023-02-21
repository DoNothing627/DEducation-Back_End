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

class AcademyTranscript {
  constructor(opts) {
    this.ctrl = opts.ctrl;
    this.router = express.Router();

    this.router.post(
      "/",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.AcademyTranscript.CreateNewTranscript)
    );
    this.router.get(
      "/student",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.AcademyTranscript.GetMyTranscripts)
    );
    // this.router.get(
    //   "/:user_id",
    //   jsonParser,
    //   RequireJsonContent,
    //   TokenAuthenticate,
    //   apiHandler(this.ctrl.AcademyTranscript.GetUserTranscripts)
    // );
    // academy-transcript/class-transcript
    this.router.post(
      "/class-transcript",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.AcademyTranscript.UploadClassTranscript)
    );
    this.router.post(
      "/student-transcript",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.AcademyTranscript.UploadStudentTranscript)
    );
    this.router.get(
      "/teacher",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.AcademyTranscript.GetMyTranscriptsForTeacher)
    );
    this.router.get(
      "/self",
      jsonParser,
      RequireJsonContent,
      TokenAuthenticate,
      apiHandler(this.ctrl.AcademyTranscript.GetMyTranscriptsForStudent)
    );
  }
  getRouter = () => {
    return this.router;
  };
}

module.exports = AcademyTranscript;
