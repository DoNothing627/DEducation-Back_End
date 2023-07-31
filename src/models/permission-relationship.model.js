const BaseModel = require("./base.model");

class PermissionRelaitonship extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
  }

  // getListStudentsOfASchool = async(school_id) => {
  //   try{
  //     let data = await this.model.aggreate([
  //       {
  //         '$match': {
  //           'powerful_user_id': new ObjectId(school_id)
  //         }
  //       },{

  //       }
  //     ])
  //   }catch(error){
  //     throw error;
  //   }
  // }
}

module.exports = PermissionRelaitonship;
