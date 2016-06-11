var fs = require('fs'),
  config = require('../config');

var isChannel = (chan) => chan.includes("#");

module.exports = function (app, rootPath) {
  app.get('/:server', function (req, res) {
    if (!req.user && !config.allowAnonymous) {
      res.status(403);
      return res.render('403', {
        error: "Sorry, you can't see this. Try and log in."
      });
    }

    fs.readdir(rootPath + "/" + req.params.server, function (err, chans) {
      if (!req.user && config.filterUsersForAnonymous) {
        chans = chans.filter(isChannel)
      }
    	res.render('server/serverView.html',{
          server: req.params.server,
          chans: chans
      });
    });
  });
}
