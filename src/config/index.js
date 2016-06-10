var defaults = require('./defaults.json'),
  _ = require('lodash'),
  path = require('path'),
  fs = require('fs'),
  mkpath = require('mkpath'),
  home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
  configDir = path.join(home, ".config"),
  configPath = path.join(configDir, "ymklogue.json"),
  config = {};


try {
  config = require(configPath);
} catch (e) {
  console.log("No config file. Writing with defaults.");
  mkpath(configDir, (err) => {
      errorLogger(err);
      fs.writeFile(configPath, JSON.stringify(defaults), { flag: 'wx' }, errorLogger);
  });
}

var errorLogger = (err) => err ? console.log(err) : err;

module.exports = _.merge({}, defaults, config);
