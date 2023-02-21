const BaseModel = require("./base.model");

class User extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
    // console.log(this.model, "alo");
  }

  getListUser = async ({ listStudentsWallet }) => {
    console.log("model transcript", listStudentsWallet);
    try {
      let data = await this.model.aggregate([
        {
          $match: {
            wallet: { $in: listStudentsWallet },
          },
        },
      ]);
      return data;
    } catch {}
  };
}

module.exports = User;
