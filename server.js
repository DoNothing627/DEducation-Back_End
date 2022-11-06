require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const container = require("./src/configs/dependencies/container");
const ErrorHandler = require("./src/utils/error_handler.util");
let morgan = require("morgan");
const cors = require("cors");
const app = express();
if (process.env.NODE_ENV !== "PROD" && process.env.NODE_ENV !== "MAINNET") {
  //use morgan to log at command line
  app.use(morgan("combined"));
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.MODE === "MAINNET" ? "*" : "*",
  })
);
// app.use(function (req, res, next) {
//   res.setHeader("X-Powered-By", "DEsports");
//   next();
// });
setTimeout(async () => {
  // Init database
  const DatabaseInit = require("./src/inits");
  await DatabaseInit.init();
}, 5000);
// load routes
app.use("/", container.resolve("router").routerApi());

// health check
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(ErrorHandler);

const port = process.env.PORT || "9009";
const host = process.env.HOST || "localhost";
app.set("port", port);
app.set("host", host);

// Create HTTP server.
app.listen(port, host, () => console.log(`http://${host}:${port}`));

module.exports = app;
