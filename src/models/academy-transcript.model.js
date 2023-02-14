const BaseModel = require("./base.model");

class AcademyTranscript extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
  }
}

module.exports = AcademyTranscript;
