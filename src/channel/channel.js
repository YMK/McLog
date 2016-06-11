var fs = require('fs'),
  config = require('../config');

var isChannel = (chan) => chan.includes("#");
var isHiddenChan = (chan) => config.hideForAnonymous.includes(chan);

module.exports = function (app, rootPath) {
  app.get('/chan', function (req, res) {
    if (!req.user && (
      !config.allowAnonymous ||
      (config.filterUsersForAnonymous && !isChannel(req.query.chan)) ||
      isHiddenChan(req.query.chan)
    )) {
      res.status(403);
      return res.render('403', {
        error: "Sorry, you can't see this. Try and log in."
      });
    }
    fs.readdir(rootPath + "/" + req.query.server + "/" + req.query.chan, function (err, dates) {
    	res.render('channel/chanView.html',{
          server: req.query.server,
          chan: req.query.chan,
          dates: dates ? dates.reverse() : [],
          user: req.user
      });
    });
  });
}
