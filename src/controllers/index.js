const User = require("./user.controller");
const AcademyTranscript = require("./academy-transcript.controller");
const PermissionRelaitonship = require("./permission-relationship.controller");
const Classroom = require("./classroom.controller");
const Semester = require("./semester.controller");

module.exports = class ControllerRepository {
  constructor(opt) {
    this.User = new User(opt);
    this.AcademyTranscript = new AcademyTranscript(opt);
    this.PermissionRelaitonship = new PermissionRelaitonship(opt);
    this.Classroom = new Classroom(opt);
    this.Semester = new Semester(opt);
  }
};
