var fs = require('fs');

module.exports = function (app, rootPath) {
  app.get('/:server', function (req, res) {
    fs.readdir(rootPath + "/" + req.params.server, function (err, chans) {
    	res.render('server/serverView.html',{
          server: req.params.server,
          chans: chans
      });
    });
  });
}
