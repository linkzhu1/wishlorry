const path = require("path");
const webpackPath = __dirname;
const assetsPath = path.resolve(webpackPath, "assets");
const utilPath = path.resolve(webpackPath, "util");
module.exports = {
  resolve: {
    alias: {
      "@assets": assetsPath,
      "@css": path.resolve(assetsPath, "css"),
      "@util": utilPath
    },
    extensions: ["*", ".vue", ".json", ".js", ".css"]
  }
};
