//remove dotenv config.config()
const { createContainer, asClass, asValue, InjectionMode } = require("awilix");

//model
const ModelRepository = require("../../models");

//controllers
const ControllerRepository = require("../../controllers");

//routers
const RouterRepository = require("../../routers");

//actions
// const ActionRepository = require("../../actions");

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  router: asClass(RouterRepository),
  model: asClass(ModelRepository),
  ctrl: asClass(ControllerRepository),
  // action: asClass(ActionRepository),
});

module.exports = container;
