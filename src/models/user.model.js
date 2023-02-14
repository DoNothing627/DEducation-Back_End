const BaseModel = require("./base.model");

class User extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
    // console.log(this.model, "alo");
  }
}

module.exports = User;
