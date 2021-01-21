module.exports = {
  Util: require("./Util"),
  MusicClient: require("./MusicClient"),
  ...require("./music"),
  ...require("./loaders"),
};
