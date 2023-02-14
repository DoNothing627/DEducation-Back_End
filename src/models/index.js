const mongoose = require("mongoose");
const DBSetting = require("../configs/db");

const Entity = require("../entities");

const User = require("./user.model");
const AcademyTranscript = require("./academy-transcript.model");
const PermissionRelaitonship = require("./permission-relationship.model");
const Classroom = require("./classroom.model");
const Semester = require("./semester.model");

module.exports = class ModelRepository {
  constructor() {
    this.dbConfig = DBSetting;
    this.User = new User(Entity.User);
    this.AcademyTranscript = new AcademyTranscript(Entity.AcademyTranscript);
    this.PermissionRelaitonship = new PermissionRelaitonship(
      Entity.PermissionRelaitonship
    );
    this.Classroom = new Classroom(Entity.Classroom);
    this.Semester = new Semester(Entity.Semester);

    this.connect();
  }
  connect = async () => {
    try {
      if (mongoose.connection.readyState === 0) {
        await this.connectMongoDb();
        console.log("Database connected");
      }
    } catch (error) {
      throw error;
    }
  };
  connectMongoDb = async () => {
    if (mongoose.connection.readyState === 0) {
      const debug = process.env.MONGO_DEBUG ? process.env.MONGO_DEBUG : false;
      mongoose.set("debug", false);
      mongoose.set("runValidators", true); // here is your global setting
      try {
        await mongoose.connect(this.dbConfig.url, this.dbConfig.options);
      } catch (error) {
        console.log(error);
        console.log(`reconnect after 3s ...`);
        await this.sleep(3000);
        await this.connectMongoDb();
      }
    }
  };
};
