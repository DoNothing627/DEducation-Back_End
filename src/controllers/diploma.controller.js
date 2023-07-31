const { RestError, ResponseFormat } = require("../utils");
const CONSTANTS = require("../constants");
const ObjectId = require("mongoose").Types.ObjectId;
const PDFGenerate = require("../pdf-generate");

class Diploma {
  constructor(opts) {
    this.model = opts.model;
  }

  CreateDiploma = async ({ user, diplomas, school_id }) => {
    try {
      //   const student = [
      //     {
      //       _id: new ObjectId("638f564e6f12f1c6ef840ae2"),
      //       wallet: "0x5aa7d58C672282D5F10E98dC5f7d31D73135328F",
      //       username: "Đào Xuân An",
      //       role: 2,
      //       nonce: 0.5536305997662816,
      //       date_of_birth: "27/06/2001",
      //       student_id_code: "20190076",
      //       public_status: true,
      //     },
      //     {
      //       _id: new ObjectId("63f37c2e4be086b7f67c5fd6"),
      //       wallet: "0x87b8c058394b16c24C0CaC3a832a7cA62E948dCE",
      //       username: "Naruto",
      //       role: 2,
      //       nonce: 0.6709342132435892,
      //       date_of_birth: "10/10/2001",
      //       student_id_code: "20190002",
      //       public_status: false,
      //     },
      //     {
      //       _id: new ObjectId("63f37ca24be086b7f67c5fd7"),
      //       wallet: "0x78d5663E92600E31099E31E78aEd80f7B96690cB",
      //       username: "Tanjiro",
      //       role: 2,
      //       nonce: 0.2553420528061938,
      //       date_of_birth: "5/5/2001",
      //       student_id_code: "20190003",
      //       public_status: false,
      //     },
      //   ];

      //   var studentCreated = await this.model.User.create(student);
      console.log("diplomas", diplomas);

      var student_id_code_list = [];
      diplomas.forEach((element) => {
        student_id_code_list.push(element.student_id_code);
      });

      var students = await this.model.User.findMany({
        student_id_code: { $in: student_id_code_list },
      });

      console.log("students", students);

      var students_id_list = [];
      var students_wallet_list = [];
      diplomas.forEach((diploma) => {
        students.forEach((student) => {
          if (student.student_id_code == diploma.student_id_code) {
            students_id_list.push(student._id);
            students_wallet_list.push(student.wallet);
          }
        });
      });

      const pdfGenerateResult = await PDFGenerate.generateGraduateCertificate(
        diplomas
      );

      let result = [];
      let diplomasInit = [];

      // console.log("students_id_list", students_id_list);

      // students_id_list.forEach(async (student_id, index) => {
      //   const userTranscripts = await this.model.AcademyTranscript.findMany({
      //     student_id: { $in: students_id_list },
      //     class: ObjectId(school_id),
      //   });
      //   // console.log("user", user);
      //   // });

      // students_id_list.forEach((student_id, index) => {
      //   userTranscripts.forEach((userTranscript) => {
      //     console.log("user transcript id", userTranscript.student_id == student_id)
      //     if (userTranscript.student_id.toString() == student_id.toString()) {
      //       console.log("check true")
      //       userTranscript.hashcode = pdfGenerateResult[index];
      //     }
      //   });
      // });

      //   console.log("students_id_list", students_id_list);

      //   await this.model.AcademyTranscript.deleteMany({
      //     student_id: { $in: students_id_list },
      //     class: ObjectId(school_id),
      //   });

      //   await this.model.AcademyTranscript.create(userTranscripts);

      students_id_list.forEach((student_id, index) => {
        result.push({
          student_address: students_wallet_list[index],
          transcript_hashcode: pdfGenerateResult[index],
        });
        diplomasInit.push({
          hashcode: pdfGenerateResult[index],
          student_id: student_id,
          school_id: school_id,
          txHash: diplomas[index].txHash,
          classification: diplomas[index].classification,
        });
      });

      await this.model.Diploma.deleteMany({
        student_id: { $in: students_id_list },
        school_id: ObjectId(school_id),
      });
      var diplomasCreated = await this.model.Diploma.create(diplomasInit);

      let delete_list_user = [];
      students.forEach((student) => {
        diplomasCreated.forEach((diploma) => {
          if (student._id.toString() == diploma.student_id.toString()) {
            student.diploma = diploma._id;
            delete_list_user.push(student._id);
          }
        });
      });

      await this.model.User.deleteMany({
        _id: { $in: delete_list_user },
      });

      var studentCreated = await this.model.User.create(students);

      console.log("result", result);
      console.log("diplomasInit", diplomasInit);
      console.log("diplomasCreated", diplomasCreated);
      console.log("studentCreated", studentCreated);

      return ResponseFormat.formatResponse(200, "Ok");
    } catch (error) {
      throw error;
    }
  };

  UpdateTxHashDiploma = async (list_student, school_id, tx_hash) => {
    try {
      var listStudents = await this.model.User.findMany({
        wallet: { $in: list_student },
      });
      var listStudentId = [];
      listStudents.forEach((element) => {
        listStudentId.push(element._id);
      });
      var transcripts = await this.model.Diploma.updateMany(
        {
          student_id: { $in: listStudentId },
          school_id: ObjectId(school_id),
        },
        {
          txHash: tx_hash,
        }
      );
      console.log("transcripts", transcripts);
    } catch (err) {
      throw err;
    }
  };
}

module.exports = Diploma;
