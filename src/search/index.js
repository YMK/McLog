var fs = require('fs'),
  path = require('path'),
  config = require('../config');

var isChannel = (chan) => chan.includes("#");
var isHiddenChan = (chan) => config.hideForAnonymous.includes(chan);

module.exports = function (app, rootPath) {
  app.get('/search', function (req, res) {
    if (!req.user && !config.allowAnonymous) {
      res.status(403);
      return res.render('403', {
        error: "Sorry, you can't see this. Try and log in."
      });
    }
    walk(rootPath)
    .then(function (files) {
      var promises = [];
      for (var i = 0; i < files.length; i++) {
        promises.push(searchFile(files[i], req.query.s));
      }
      return Promise.all(promises);
    })
    .then(function (results) {
      results = results.filter(res => res !== undefined);
      res.render('search/searchView.html', {
        results: results,
        search: req.query.s,
        user: req.user
      });
    }, function (err) {
      console.log(err);
    });
  });
}

var searchFile = function(file, term) {
  return new Promise(function (resolve, rej) {
    fs.readFile(file, 'utf-8', function(err, contents) {
      if (err) {
        rej(err);
      }
      var lines = inspectFile(contents, term);
      if (lines.length > 0) {
        resolve({
          name: file,
          lines: lines
        });
      } else {
        resolve();
      }
    });
  });
}

var inspectFile = function(contents, term) {
  var results = [];
  if (contents && contents.includes(term)) {
    var lines = contents.split("\n");
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].includes(term)) {
        results.push(lines[i]);
      }
    }
  }
  return results;
}

var walk = function(dir) {
  return new Promise(function (resolve, rej) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return rej(err);
      var pending = list.length;
      if (!pending) return resolve(results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file).then(function(res) {
              results = results.concat(res);
              if (!--pending) resolve(results);
            });
          } else {
            results.push(file);
            if (!--pending) resolve(results);
          }
        });
      });
    });
  });
};
