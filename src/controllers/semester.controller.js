const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");
const ObjectId = require("mongoose").Types.ObjectId;

class Semester {
  constructor(opts) {
    this.model = opts.model;
  }

  CreateSemester = async ({ user, semester_name }) => {
    try {
      console.log("semester");
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
      // var semester = await this.model.Semester.findMany({
      //   _id: ObjectId("63ef7e3475a3774cd9833096"),
      // });
      var semester = [
        {
          _id: new ObjectId("63ef7e3475a3774cd9833096"),
          school: new ObjectId("637e364cc1c652e106a6a8c2"),
          semester_name: "2022.1",
          description: "Học kì 1 năm học 2022-2023",
        },
      ];

      await this.model.Semester.create(semester);
      console.log("semester", semester);
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
