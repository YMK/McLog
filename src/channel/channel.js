var fs = require('fs');

module.exports = function (app, rootPath) {
  app.get('/:server/:chan', function (req, res) {
    fs.readdir(rootPath + "/" + req.params.server + "/" + req.params.chan, function (err, dates) {
    	res.render('channel/chanView.html',{
          server: req.params.server,
          chan: req.params.chan,
          dates: dates ? dates.reverse() : []
      });
    });
  });
}
