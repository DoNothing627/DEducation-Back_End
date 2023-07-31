const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academyTranscript = new Schema(
  {
    hashcode: {
      type: String,
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    teacher_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      require: true,
    },
    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      require: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      require: true,
    },
    mark: {
      type: String,
    },
    txHash:{
      type: String,
    },
    transcript_hash_code: {
      type: String,
    },
  },
  { timestamps: true }
);

const AcademyTranscript = mongoose.model(
  "AcademyTranscript",
  academyTranscript
);

module.exports = AcademyTranscript;
