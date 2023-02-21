const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");
const fs = require("fs");
const ipfsClient = require("../utils/ipfs.util");
const ObjectId = require("mongoose").Types.ObjectId;

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

  UploadClassTranscript = async ({ user, classroom_id, root_transcript }) => {
    try {
      console.log(classroom_id, root_transcript, "upload class transcript");
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
      // class_reports.map((e) => {
      // var writeStream = fs.createWriteStream(
      //   `./public/transcripts/${classroom_id}_${e[0]}.txt`
      // );
      // writeStream.write(e[1]);
      // writeStream.write("\n");
      // writeStream.write(e[2]);
      // writeStream.end();
      // var buffer = fs.readFileSync(
      //   `./public/transcripts/${classroom_id}_${e[0]}.txt`
      // ).buffer;
      // const ipfs = ipfsClient.add("Hello World");
      // let result = ipfs.add(buffer);
      // console.log(result, "result");
      // ipfsClient.files.add(buffer, (err, res) => {
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }
      //   console.log("ipfsHash", res[0].hash);
      // });
      //   ,
      //   content,
      //   (err) => {
      //     if (err) {
      //       console.error(err);
      //     }
      //     // file written successfully
      //   }
      // );
      // });
      var classroom = await this.model.Classroom.findOneAndUpdate(
        { _id: ObjectId(classroom_id) },
        { root_transcript: root_transcript }
      );
      return ResponseFormat.formatResponse(200, "Ok", classroom);
    } catch (error) {
      throw error;
    }
  };

  UploadStudentTranscript = async ({ user, transcriptStudents }) => {
    try {
      console.log(transcriptStudents, "upload class transcript");

      // var classroom = await this.model.Classroom.findOneAndUpdate(
      //   { _id: ObjectId(classroom_id) },
      //   { root_transcript: root_transcript }
      // );
      var listStudentsWallet = [];
      var listStudentsId = [];
      var classroom = transcriptStudents[0].Classroom;

      // var students = await this.model.User.findMany({})
      transcriptStudents.forEach((transcriptStudent) =>
        listStudentsWallet.push(transcriptStudent.StudentAddress)
      );

      var users = await this.model.User.getListUser({ listStudentsWallet });

      users.forEach((user) => {
        listStudentsId.push(user._id);
        transcriptStudents.forEach((transcriptStudent) => {
          if (transcriptStudent.StudentAddress == user.wallet) {
            transcriptStudent.studentId = user._id;
          }
        });
      });

      var transcripts = await this.model.AcademyTranscript.getListTranscript({
        listStudentsId,
        classroom,
      });

      // transcripts.forEach((transcript) => {
      //   transcriptStudents.forEach((transcriptStudent) => {
      //     if (transcriptStudents.studentId == transcript.student_id) {
      //       transcript.transcript_hash_code = transcriptStudent.hashcode;
      //     }
      //   });
      // });

      // transcripts = await this.model.AcademyTranscript.updateMany(transcripts);

      transcriptStudents.forEach((transcriptStudent) => {
        users.forEach(async (user) => {
          if (transcriptStudent.StudentAddress == user.wallet) {
            await this.model.AcademyTranscript.findOneAndUpdate(
              { student_id: user._id, class: ObjectId(classroom) },
              { transcript_hash_code: transcriptStudent.Hashcode }
            );
          }
        });
      });

      console.log("transcripts", transcripts);

      return ResponseFormat.formatResponse(200, "Ok", transcripts);
    } catch (error) {
      throw error;
    }
  };

  GetMyTranscriptsForTeacher = async ({ user, classroom }) => {
    try {
      var classrooms = await this.model.Classroom.findOne({
        _id: ObjectId(classroom),
      });
      console.log(classrooms.teacher, user._id.toString(), "classroom");
      if (classrooms.teacher.toString() != user._id.toString()) {
        throw RestError.NewInvalidInputError(
          CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
        );
      }
      return ResponseFormat.formatResponse(200, "Ok", classrooms);
    } catch (error) {
      throw error;
    }
  };
  GetMyTranscriptsForStudent = async ({ user, classroom }) => {
    try {
      var transcript = await this.model.AcademyTranscript.findOne(
        {
          student_id: user._id,
          class: ObjectId(classroom),
        },
        "teacher_id",
        "class"
      );
      console.log(transcript, "transcript");
      // if (classrooms.teacher.toString() != user._id.toString()) {
      //   throw RestError.NewInvalidInputError(
      //     CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
      //   );
      // }

      var myTranscriptsForStudentResponse = {
        root_transcript: transcript?.transcript_hash_code,
        teacher_address: transcript.teacher_id.wallet,
        image: transcript.class.image,
        subject: transcript.class.subject,
        code: transcript.class.code,
        _id: transcript.class._id,
      };

      return ResponseFormat.formatResponse(
        200,
        "Ok",
        myTranscriptsForStudentResponse
      );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = AcademyTranscript;
