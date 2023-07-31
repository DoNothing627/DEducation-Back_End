const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");
const PDFGenerate = require("../pdf-generate");
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

  UploadStudentTranscript = async ({
    user,
    transcriptStudents,
    classroom_id,
  }) => {
    try {
      console.log(transcriptStudents, "upload class transcript");
      var student_id_code_list = [];
      transcriptStudents.forEach((element) => {
        student_id_code_list.push(element.student_id_code);
      });
      // var classroom = await this.model.Classroom.findOneAndUpdate(
      //   { _id: ObjectId(classroom) },
      //   { root_transcript: root_transcript }
      // );
      var classroom = await this.model.Classroom.findOne({
        _id: ObjectId(classroom_id),
      });

      var teacher = await this.model.User.findOne({
        _id: classroom.teacher,
      });

      var students = await this.model.User.findMany({
        student_id_code: { $in: student_id_code_list },
      });

      console.log("students", students);

      var students_id_list = [];
      var students_wallet_list = [];
      transcriptStudents.forEach((transcriptStudent) => {
        students.forEach((student) => {
          if (student.student_id_code == transcriptStudent.student_id_code) {
            students_id_list.push(student._id);
            students_wallet_list.push(student.wallet);
          }
        });
      });

      // const pdfGenerateResult = await PDFGenerate.generateNormalCertificate(
      //   transcriptStudents,
      //   teacher.username,
      //   classroom.subject
      // );

      const pdfGenerateResult = ['https://bafybeigiobjgh4flkugkxnuu47n2xzzaavmojhavgaeaao7wkdqoi3ydpa.ipfs.dweb.link/0',
                                  'https://bafybeigiobjgh4flkugkxnuu47n2xzzaavmojhavgaeaao7wkdqoi3ydpa.ipfs.dweb.link/1',
                                  'https://bafybeigiobjgh4flkugkxnuu47n2xzzaavmojhavgaeaao7wkdqoi3ydpa.ipfs.dweb.link/2']

      console.log("pdf result", pdfGenerateResult);

      var result = [];

      console.log("students_id_list", students_id_list);

      // students_id_list.forEach(async (student_id, index) => {
      const userTranscripts = await this.model.AcademyTranscript.findMany({
        student_id: { $in: students_id_list },
        class: ObjectId(classroom_id),
      });
      // console.log("user", user);
      // });

      students_id_list.forEach((student_id, index) => {
        userTranscripts.forEach((userTranscript) => {
          console.log(
            "user transcript id",
            userTranscript.student_id == student_id
          );
          if (userTranscript.student_id.toString() == student_id.toString()) {
            console.log("check true");
            userTranscript.hashcode = pdfGenerateResult[index];
          }
        });
      });

      console.log("students_id_list", students_id_list);

      // await this.model.AcademyTranscript.deleteMany({
      //   student_id: { $in: students_id_list },
      //   class: ObjectId(classroom_id),
      // });

      // await this.model.AcademyTranscript.create(userTranscripts);

      students_id_list.forEach((student_id, index) => {
        result.push({
          StudentAddress: students_wallet_list[index],
          Classroom: classroom_id,
          HashCode: pdfGenerateResult[index],
        });
      });

      // console.log("students_wallet_list", students_wallet_list);
      // console.log("pdfGenerateResult", pdfGenerateResult);
      console.log("result", result);

      return ResponseFormat.formatResponse(200, "Ok", result);
    } catch (error) {
      throw error;
    }
  };

  GetMyTranscriptsForTeacher = async ({ user, classroom }) => {
    try {
      // var classrooms = await this.model.Classroom.findOne({
      //   _id: ObjectId(classroom),
      // });
      // console.log(classrooms.teacher, user._id.toString(), "classroom");
      // if (classrooms.teacher.toString() != user._id.toString()) {
      //   throw RestError.NewInvalidInputError(
      //     CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
      //   );
      // }

      var transcripts = await this.model.AcademyTranscript.findMany(
        {
          class: ObjectId(classroom),
        },
        "student_id",
        "class"
      );

      var transcriptsResponse = [];

      transcripts.forEach((transcript) => {
        transcriptsResponse.push({
          root_transcript: transcript?.hashcode,
          student_address: transcript.student_id.wallet,
          student_name: transcript.student_id.username,
          image: transcript.class.image,
          subject: transcript.class.subject,
          code: transcript.class.code,
          mark: transcript.mark,
          tx_hash: transcript.txHash,
          _id: transcript.class._id,
        });
      });

      return ResponseFormat.formatResponse(200, "Ok", transcriptsResponse);
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
        root_transcript: transcript?.hashcode,
        teacher_address: transcript.teacher_id.wallet,
        teacher_name: transcript.teacher_id.username,
        image: transcript.class.image,
        subject: transcript.class.subject,
        code: transcript.class.code,
        mark: transcript.mark,
        tx_hash: transcript.txHash,
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

  GetMyAllTranscriptsForStudent = async ({ user }) => {
    try {
      var transcripts = await this.model.AcademyTranscript.findMany(
        {
          student_id: user._id,
        },
        "teacher_id",
        "class"
      );
      console.log(transcripts, "transcript");
      // if (classrooms.teacher.toString() != user._id.toString()) {
      //   throw RestError.NewInvalidInputError(
      //     CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
      //   );
      // }

      var myAllTranscriptsForStudentResponse = [];

      transcripts.forEach((transcript) => {
        myAllTranscriptsForStudentResponse.push({
          root_transcript: transcript?.hashcode,
          teacher_address: transcript.teacher_id.wallet,
          teacher_name: transcript.teacher_id.username,
          image: transcript.class.image,
          subject: transcript.class.subject,
          code: transcript.class.code,
          mark: transcript.mark,
          tx_hash: transcript.txHash,
          _id: transcript.class._id,
        });
      });

      return ResponseFormat.formatResponse(
        200,
        "Ok",
        myAllTranscriptsForStudentResponse
      );
    } catch (error) {
      throw error;
    }
  };

  GetAllTranscriptsOfAStudent = async ({ userId }) => {
    try {
      var transcripts = await this.model.AcademyTranscript.findMany(
        {
          student_id: userId,
        },
        "teacher_id",
        "class"
      );
      console.log(transcripts, "transcript");
      // if (classrooms.teacher.toString() != user._id.toString()) {
      //   throw RestError.NewInvalidInputError(
      //     CONSTANTS.MessageConst.ROLE.YOU_HAVE_NO_PERMISSION
      //   );
      // }

      var myAllTranscriptsOfAStudentResponse = [];

      transcripts.forEach((transcript) => {
        myAllTranscriptsOfAStudentResponse.push({
          root_transcript: transcript?.hashcode,
          teacher_address: transcript.teacher_id.wallet,
          teacher_name: transcript.teacher_id.username,
          image: transcript.class.image,
          subject: transcript.class.subject,
          code: transcript.class.code,
          mark: transcript.mark,
          tx_hash: transcript.txHash,
          _id: transcript.class._id,
        });
      });

      return ResponseFormat.formatResponse(
        200,
        "Ok",
        myAllTranscriptsOfAStudentResponse
      );
    } catch (error) {
      throw error;
    }
  };

  UpdateTxHashTranscript = async ({list_student, classroom_id, tx_hash}) => {
    try {
      console.log("update txhash transcript", list_student, classroom_id, tx_hash);
      var listStudents = await this.model.User.findMany({
        wallet: { $in: list_student },
      });
      var listStudentId = [];
      listStudents.forEach((element) => {
        listStudentId.push(element._id);
      });

      console.log("listStudentId", listStudentId);

      var transcripts = await this.model.AcademyTranscript.updateMany(
        {
          student_id: { $in: listStudentId },
          class: ObjectId(classroom_id),
        },
        {
          txHash: tx_hash,
        }
      );

      console.log("transcripts", transcripts);

      return ResponseFormat.formatResponse(
        200,
        "Ok",
        transcripts
      );
    } catch (err) {
      throw err;
    }
  };
}

module.exports = AcademyTranscript;
