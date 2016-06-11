var defaults = require('./defaults.json'),
  _ = require('lodash'),
  path = require('path'),
  fs = require('fs'),
  mkpath = require('mkpath'),
  home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
  configDir = path.join(home, ".config"),
  configPath = path.join(configDir, "ymklogue.json"),
  config = {};

var errorLogger = (err, res, rej) => {
  if (err) {
    console.log(err);
    reject(rej);
  } else {
    resolve(res)
  }
}
var resolve = (res) => res ? res() : undefined;
var reject = (err, rej) => rej ? rej(err) : err;
var saveConfig = (res) => fs.writeFile(configPath, JSON.stringify(config, null, 2), { flag: 'w' }, (err) => errorLogger(err, res));

try {
  config = require(configPath);
} catch (e) {
  console.log("No config file. Writing with defaults.");
  mkpath(configDir, (err) => {
      errorLogger(err);
      fs.writeFile(configPath, JSON.stringify(defaults, null, 2), { flag: 'wx' }, errorLogger);
  });
}

config = _.assign({}, defaults, config);
saveConfig();

module.exports = _.assign({
  setKey: (key) => {
    return new Promise(function (res, rej) {
      config.key = key;
      saveConfig(res);
    });
  }
}, config);
