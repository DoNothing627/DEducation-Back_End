const BaseModel = require("./base.model");
const ObjectId = require("mongoose").Types.ObjectId;

class AcademyTranscript extends BaseModel {
  constructor(model) {
    super(model);
    this.model = model;
  }

  getListTranscript = async ({ listStudentsId, classroom }) => {
    console.log("model transcript", listStudentsId, classroom);
    try {
      let data = await this.model.aggregate([
        {
          $match: {
            student_id: { $in: listStudentsId },
            class: ObjectId(classroom),
          },
        },
      ]);
      return data;
    } catch {}
  };
}

module.exports = AcademyTranscript;
