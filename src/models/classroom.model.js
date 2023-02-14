const BaseModel = require("./base.model");

class Classroom extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
  }
}

module.exports = Classroom;
