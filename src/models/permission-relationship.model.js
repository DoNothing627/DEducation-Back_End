const BaseModel = require("./base.model");

class PermissionRelaitonship extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
  }
}

module.exports = PermissionRelaitonship;
