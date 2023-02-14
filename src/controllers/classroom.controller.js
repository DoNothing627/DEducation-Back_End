const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");

class Classroom {
  constructor(opts) {
    this.model = opts.model;
  }

  CreateClassroom = async ({ user, teacher, semester, code }) => {
    try {
      var classroom = await this.model.Classroom.findOne({
        school: user._id,
        teacher: teacher_id,
        semester: semester,
        code: code,
      });
      if (classroom != null) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.CLASSROOM.ALREADY_EXISTED
        );
      }
      classroom = await this.model.Classroom.createOne({
        school: user._id,
        teacher: teacher_id,
        semester: semester,
        code: code,
      });
      return ResponseFormat.formatResponse(200, "Ok", classroom);
    } catch (error) {
      throw error;
    }
  };

  GetMyClassrooms = async ({ user, semester }) => {
    try {
      var classroom;
      if (user.role == CONSTANTS.EntityConst.ROLE.SCHOOL) {
        classroom = await this.model.Classroom.findMany({
          school: user._id,
          semester: semester,
        });
      }
      if (user.role == CONSTANTS.EntityConst.ROLE.TEACHER) {
        classroom = await this.model.Classroom.findMany({
          teacher: user._id,
          semester: semester,
        });
      }
      if (user.role == CONSTANTS.EntityConst.ROLE.STUDENT) {
        classroom = await this.model.AcademyTranscript.findMany({
          student: user._id,
          semester: semester,
        }).populate({
          path: "semester",
          select: "_id semester school teacher code subject",
        });
      }
      return ResponseFormat.formatResponse(200, "Ok", classroom);
    } catch (error) {
      throw error;
    }
  };
  GetUserlassrooms = async ({ user_id }) => {
    try {
      var classroom;
      if (user.role == CONSTANTS.EntityConst.ROLE.SCHOOL) {
        classroom = await this.model.Classroom.findMany({
          school: user_id,
          semester: semester,
        });
      }
      if (user.role == CONSTANTS.EntityConst.ROLE.TEACHER) {
        classroom = await this.model.Classroom.findMany({
          teacher: user_id,
          semester: semester,
        });
      }
      if (user.role == CONSTANTS.EntityConst.ROLE.STUDENT) {
        classroom = await this.model.AcademyTranscript.findMany({
          student: user_id,
          semester: semester,
        }).populate({
          path: "semester",
          select: "_id semester school teacher code subject",
        });
      }
      return ResponseFormat.formatResponse(200, "Ok", classroom);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = Classroom;
