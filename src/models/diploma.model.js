const BaseModel = require("./base.model");

class Diploma extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
  }
}

module.exports = Diploma;
