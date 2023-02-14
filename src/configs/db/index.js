//remove dotenv config.config()

module.exports = {
  url: process.env[`${process.env.MODE}_MONGO_STRING`],
  options: {
    wtimeout: 10000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 30000,
    // poolSize: 10,
  },
};
