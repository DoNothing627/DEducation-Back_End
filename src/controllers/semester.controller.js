const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");

class Semester {
  constructor(opts) {
    this.model = opts.model;
  }

  CreateSemester = async ({ user, semester_name }) => {
    try {
      var semester = await this.model.Semester.findOne({
        semester_name: semester_name,
        school: user._id,
      });
      if (semester != null) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.SEMESTER.ALREADY_EXISTED
        );
      }
      if (user.role != CONSTANTS.EntityConst.ROLE.SCHOOL) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
        );
      }
      semester = await this.model.Semester.createOne({
        school: user._id,
        semester_name: semester_name,
      });
      return ResponseFormat.formatResponse(200, "Ok", semester);
    } catch (error) {
      throw error;
    }
  };

  GetMySemester = async ({ user }) => {
    try {
      var semester = await this.model.Semester.findMany({
        school: user._id,
      });
      return ResponseFormat.formatResponse(200, "Ok", semester);
    } catch (error) {
      throw error;
    }
  };
  GetUserSemester = async ({ user_id }) => {
    try {
      var semester = await this.model.Semester.findMany({
        school: user._id,
      });
      return ResponseFormat.formatResponse(200, "Ok", semester);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = Semester;
