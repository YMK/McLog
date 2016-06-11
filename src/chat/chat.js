var fs = require('fs'),
  config = require('../config');

var isChannel = (chan) => chan.includes("#");
var isHiddenChan = (chan) => config.hideForAnonymous.includes(chan);

module.exports = function (app, rootPath) {
  app.get('/:server/:chan/:date', function (req, res) {
    var server = req.params.server,
      chan = req.params.chan,
      date = req.params.date;


    if (!req.user && (
      !config.allowAnonymous ||
      (config.filterUsersForAnonymous && !isChannel(req.params.chan)) ||
      isHiddenChan(req.params.chan)
    )) {
      res.status(403);
      return res.render('403', {
        error: "Sorry, you can't see this. Try and log in."
      });
    }

    if (!date.includes(".log")) {
      date = date + ".log";
    }
    fs.readFile(rootPath + "/" + server + "/" + chan + "/" + date, 'utf8', function(err, contents) {
      if (err) {
        res.render('chat/chatView.html', {err: err});
      } else {
      	res.render('chat/chatView.html', {
          logs: contents ? contents.split("\n") : [],
          server: server,
          chan: chan,
          date: date
        });
      }
    });
  });
}
