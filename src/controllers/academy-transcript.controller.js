const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");
const fs = require("fs");
const ipfs = require("../utils/ipfs.util");

class AcademyTranscript {
  constructor(opts) {
    this.model = opts.model;
  }

  CreateNewTranscript = async ({
    user,
    student_id,
    school,
    semester,
    classroom_id,
  }) => {
    try {
      if (user.role != CONSTANTS.EntityConst.ROLE.TEACHER) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
        );
      }
      var classroom = await this.model.Classroom.findOne(classroom_id);
      if (classroom == null) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.CLASSROOM.NOT_EXISTED
        );
      }
      if (classroom.teacher != user._id) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
        );
      }
      classroom = await this.model.AcademyTranscript.CreateOne({
        student_id: student_id,
        teacher_id: teacher,
        school_id: school,
        semester: semester,
        class: classroom_id,
      });
      return ResponseFormat.formatResponse(200, "Ok", classroom);
    } catch (error) {
      throw error;
    }
  };

  GetMyTranscripts = async ({
    user,
    teacher_id,
    school_id,
    semester,
    classroom_id,
  }) => {
    try {
      let filters = { student_id: user._id };
      if (teacher_id) {
        filters = {
          ...filters,
          teacher_id: teacher_id,
        };
      }
      if (school_id) {
        filters = {
          ...filters,
          school_id: school_id,
        };
      }
      if (semester) {
        filters = {
          ...filters,
          semester: semester,
        };
      }
      if (classroom_id) {
        filters = {
          ...filters,
          classroom_id: classroom_id,
        };
      }
      var transcripts = await this.model.AcademyTranscript.findMany(filters);
      return ResponseFormat.formatResponse(200, "Ok", transcripts);
    } catch (error) {
      throw error;
    }
  };

  GetUserTranscripts = async ({
    user_id,
    teacher_id,
    school_id,
    semester,
    classroom_id,
  }) => {
    try {
      let filters = { student_id: user_id };
      if (teacher_id) {
        filters = {
          ...filters,
          teacher_id: teacher_id,
        };
      }
      if (school_id) {
        filters = {
          ...filters,
          school_id: school_id,
        };
      }
      if (semester) {
        filters = {
          ...filters,
          semester: semester,
        };
      }
      if (classroom_id) {
        filters = {
          ...filters,
          classroom_id: classroom_id,
        };
      }
      var transcripts = await this.model.AcademyTranscript.findMany(filters);
      return ResponseFormat.formatResponse(200, "Ok", transcripts);
    } catch (error) {
      throw error;
    }
  };

  UpdateTranscripts = async ({ user, student_id, classroom_id, hashcode }) => {
    var transcript = await this.model.AcademyTranscript.findOneAndUpdate(
      ((teacher_id = user._id),
      (student_id = student_id),
      (classroom_id = classroom_id)),
      (hashcode = hashcode)
    );
    return ResponseFormat.formatResponse(200, "Ok", transcript);
    try {
    } catch (error) {
      throw error;
    }
  };

  UploadClassReport = async ({ user, classroom_id, class_reports }) => {
    try {
      // if (user.role != CONSTANTS.EntityConst.ROLE.TEACHER) {
      //   throw RestError.NewInvalidInputError(
      //     CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
      //   );
      // }
      // var classroom = await this.model.Classroom.findOne({
      //   class: classroom_id,
      // });
      // if (classroom == null) {
      //   throw RestError.NewInvalidInputError(
      //     CONSTANTS.MessageConst.CLASSROOM.NOT_EXISTED
      //   );
      // }
      // if (classroom.teacher != user._id) {
      //   throw RestError.NewInvalidInputError(
      //     CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
      //   );
      // }

      class_reports.map((e) => {
        const content = "Some content!";
        var writeStream = fs.createWriteStream(
          `./public/transcripts/${classroom_id}_${e[0]}.txt`
        );
        writeStream.write(e[1]);
        writeStream.write("\n");
        writeStream.write(e[2]);
        writeStream.end();

        var buffer = fs.readFileSync(
          `./public/transcripts/${classroom_id}_${e[0]}.txt`
        ).buffer;

        // console.log("buffer", buffer);

        ipfs.files.add(buffer, (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          setIpfsHash(res[0].hash);
          console.log("ipfsHash", res[0].hash);
        });

        //   ,
        //   content,
        //   (err) => {
        //     if (err) {
        //       console.error(err);
        //     }
        //     // file written successfully
        //   }
        // );
      });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AcademyTranscript;
