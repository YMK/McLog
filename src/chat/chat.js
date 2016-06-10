var fs = require('fs');

module.exports = function (app, rootPath) {
  app.get('/:server/:chan/:date', function (req, res) {
    var server = req.params.server,
      chan = req.params.chan,
      date = req.params.date;

    if (!chan.includes("#")) {
      chan = "#" + chan;
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
