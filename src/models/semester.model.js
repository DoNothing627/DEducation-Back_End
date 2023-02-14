const BaseModel = require("./base.model");

class Semester extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
  }
}

module.exports = Semester;
