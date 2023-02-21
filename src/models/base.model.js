const { RestError, ResponseFormat, PubSub } = require("../utils");

class BaseModel {
  constructor(model) {
    this.model = model;
  }

  getModel = () => {
    return this.model;
  };

  async create(body, opts = {}) {
    try {
      const data = await this.model.insertMany(body, opts);
      return data;
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  async createOne(body, opts = {}) {
    try {
      // console.log(this.model);
      const data = await this.model.create(body);
      return data;
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  async updateOne(cond, query, opts = { new: true }) {
    try {
      const data = await this.model.updateOne(cond, query, opts).exec();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateMany(cond, query, opts = { new: true }) {
    try {
      const data = await this.model.updateMany(cond, query, opts).exec();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOneAndUpdate(cond, query, opts = { new: true }, lock_version) {
    try {
      const data = await this.model.findOneAndUpdate(cond, query, opts).exec();
      // console.log(`findOneAndUpdate = `, data)
      if (lock_version && data && data.lock_version) {
        if (
          convertNumber(lock_version) + 1 !=
          convertNumber(data.lock_version)
        ) {
          throw RestError.NewTooManyRequestError(
            Lang.getLang("en", "YOU_HAVE_OTHER_TRANSACTION_PROCESSING")
          );
        }
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAndModify(query, update, sort = { createdAt: -1 }, upsert = true) {
    try {
      const data = await this.model
        .findAndModify({
          query: query,
          sort: sort,
          update: update,
          upsert: upsert,
        })
        .exec();
      console.log(`findAndModify = `, data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteOne(cond, opts = {}) {
    try {
      const data = await this.model.deleteOne(cond, opts).exec();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteMany(cond, opts = {}, session = null) {
    try {
      const data = await this.model
        .deleteMany(cond, opts)
        .session(session)
        .exec();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findMany(
    cond,
    populate1 = "",
    populate2 = "",
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
    opts = {},
    select = "",
    session = null
  ) {
    // console.log(page, limit, sort, opts, populate, "populate");
    try {
      limit = parseInt(limit);
      page = parseInt(page);
      let skip = limit * (page - 1);
      let data = null;
      if (session) {
        data = await this.model
          .find(cond, opts)
          .lean()
          .collation({ locale: "en" })
          .populate(populate1)
          .populate(populate2)
          .sort(sort)
          .select(select)
          .session(session)
          .skip(skip)
          .limit(limit)
          .exec();
      } else {
        data = await this.model
          .find(cond, opts)
          .lean()
          .collation({ locale: "en" })
          .populate(populate1)
          .populate(populate2)
          .sort(sort)
          .select(select)
          .skip(skip)
          .limit(limit)
          .exec();
      }
      if (data == null) {
        return [];
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findManyAndSelect(cond, select, page = 1, limit = 20, sort = -1) {
    try {
      limit = parseInt(limit);
      page = parseInt(page);
      let skip = limit * (page - 1);
      const data = await this.model
        .find(cond)
        .lean()
        .select(select)
        .sort({ createdAt: sort })
        .skip(skip)
        .limit(limit)
        .exec();
      if (data == null) {
        return [];
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(cond, populate1 = "", populate2 ="", opts = {}, select = "", session) {
    try {
      const data = await this.model
        .findOne(cond, opts)
        .lean()
        .populate(populate1)
        .populate(populate2)
        .select(select)
        .session(session)
        .exec();
      return data;
    } catch (error) {
      throw Error(error);
    }
  }

  async findOneAndSort(
    cond,
    opts = {},
    sort = {},
    populate1 = "",
    populate2 = "",
    select = "",
    session
  ) {
    try {
      const data = await this.model
        .findOne(cond, opts)
        .lean()
        .populate(populate1)
        .populate(populate2)
        .select(select)
        .sort(sort)
        .session(session)
        .exec();
      return data;
    } catch (error) {
      throw Error(error);
    }
  }

  async total(cond = {}) {
    try {
      return await this.model.countDocuments(cond);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = BaseModel;
