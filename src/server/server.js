var fs = require('fs'),
  config = require('../config');

var isChannel = (chan) => chan.includes("#");
var isHiddenChan = (chan) => config.hideForAnonymous.includes(chan);

module.exports = function (app, rootPath) {
  app.get('/server', function (req, res) {
    if (!req.user && !config.allowAnonymous) {
      res.status(403);
      return res.render('403', {
        error: "Sorry, you can't see this. Try and log in."
      });
    }

    fs.readdir(rootPath + "/" + req.query.server, function (err, chans) {
      chans = chans || [];
      if (!req.user && config.filterUsersForAnonymous) {
        chans = chans.filter(isChannel);
      }
      if (!req.user) {
        chans = chans.filter((chan) => !isHiddenChan(chan));
      }
    	res.render('server/serverView.html',{
          server: req.query.server,
          chans: chans,
          user: req.user
      });
    });
  });
}
