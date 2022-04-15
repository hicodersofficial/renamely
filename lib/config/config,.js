const packageJson = require("../../package.json");

const CONFIG = {
  VERSION: packageJson.version,
  DISPLAY_NAME: packageJson.displayName,
  APP_NAME: packageJson.name,
};

module.exports = CONFIG;
