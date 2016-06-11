var fs = require('fs'),
  config = require('../config');

var isChannel = (chan) => chan.includes("#");

module.exports = function (app, rootPath) {
  app.get('/:server/:chan', function (req, res) {
    if (!req.user && (!config.allowAnonymous || (config.filterUsersForAnonymous && !isChannel(req.params.chan)))) {
      res.status(403);
      return res.render('403', {
        error: "Sorry, you can't see this. Try and log in."
      });
    }
    fs.readdir(rootPath + "/" + req.params.server + "/" + req.params.chan, function (err, dates) {
    	res.render('channel/chanView.html',{
          server: req.params.server,
          chan: req.params.chan,
          dates: dates ? dates.reverse() : []
      });
    });
  });
}
