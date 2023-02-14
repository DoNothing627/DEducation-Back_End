const express = require("express");

const User = require("./user.router");
const AcademyTranscript = require("./academy-transcript.router");
const PermissionRelaitonship = require("./permission-relationship.router");
const Classroom = require("./classroom.router");
const Semester = require("./semester.router");

module.exports = class RouterRepository {
  constructor(opts) {
    this.app = express();
    this.User = new User(opts);
    this.AcademyTranscript = new AcademyTranscript(opts);
    this.PermissionRelaitonship = new PermissionRelaitonship(opts);
    this.Classroom = new Classroom(opts);
    this.Semester = new Semester(opts);
  }
  routerApi = () => {
    this.app.use("/user", this.User.getRouter());
    this.app.use("/academy-transcript", this.AcademyTranscript.getRouter());
    this.app.use(
      "/permission-relationship",
      this.PermissionRelaitonship.getRouter()
    );
    this.app.use("/class", this.Classroom.getRouter());
    this.app.use("/semester", this.Semester.getRouter());
    return this.app;
  };
};
