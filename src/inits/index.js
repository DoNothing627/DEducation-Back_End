require("dotenv").config();

//Entity
const Entity = require("../entities");

//constant
// const CONSTANTS = require('../constants')

//utils
const Utils = require("../utils");

const container = require("../configs/dependencies/container");
const model = container.resolve("model");
// const ctrl = container.resolve('ctrl')

const init = async () => {
  try {
    await initTasks();
  } catch (error) {
    console.log(error);
  }
};

const initTasks = async () => {
  try {
    console.log("start - init task");
    // let inputs = require("./task.init.json");
    // // console.log('inputs', inputs)

    // inputs.map(async (ele) => {
    //   try {
    //     await model.Task.createOne(ele);
    //   } catch (error) {
    //     // console.log(error)
    //   }
    // });

    console.log("end - init task");
  } catch (error) {
    throw error;
  }
};

module.exports = {
  init,
};
