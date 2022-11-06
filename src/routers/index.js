const express = require("express");

module.exports = class RouterRepository {
  constructor(opts) {
    this.app = express();
  }
  routerApi = () => {
    return this.app;
  };
};
