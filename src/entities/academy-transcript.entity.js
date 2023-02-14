const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academyTranscript = new Schema(
  {
    hashcode: {
      type: String,
      unique: true,
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
      ref: "Class",
      require: true,
    },
  },
  { timestamps: true }
);

const AcademyTranscript = mongoose.model(
  "AcademyTranscript",
  academyTranscript
);

module.exports = AcademyTranscript;
