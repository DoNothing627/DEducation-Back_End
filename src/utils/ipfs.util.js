// import { encode as base64_encode } from "base-64";
// import {
//   REACT_APP_INFURA_PROJECT_ID,
//   REACT_APP_INFURA_PROJECT_SECRET,
// } from "../../const/common.const";

const { create } = import("ipfs-http-client");
const CONSTANTS = require("../constants");
let secrets =
  CONSTANTS.InfuraConst.REACT_APP_INFURA_PROJECT_ID +
  ":" +
  CONSTANTS.InfuraConst.REACT_APP_INFURA_PROJECT_SECRET;

let encodedSecrets = Buffer.from(secrets).toString("base64");
// const ipfs = new IPFS({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
//   headers: {
//     Authorization: "Basic " + encodedSecrets,
//   },
// });

async function ipfsClient() {
  // const { create } = await import("ipfs-core");
  const ipfs = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      Authorization: "Basic " + encodedSecrets,
    },
  });
  console.log(ipfs, "ipfs");
  return ipfs;
}

module.exports = { ipfsClient };
