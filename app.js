var express = require('express'),
    app = express()
    consolidate = require('consolidate'),
    path = process.env['HOME'] + "/logs/yamanickill",
    fs = require('fs');

if(process.argv.length > 2) {
  path = process.argv[2];
}

app.engine('html', consolidate.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get('/', function (req, res) {
  fs.readdir(path, function (err, servers) {
  	res.render('index.html',{
        servers: servers
    });
  });
});

app.get('/:server', function (req, res) {
  fs.readdir(path + "/" + req.params.server, function (err, chans) {
  	res.render('serverView.html',{
        server: req.params.server,
        chans: chans
    });
  });
});

app.get('/:server/:chan', function (req, res) {
  fs.readdir(path + "/" + req.params.server + "/" + req.params.chan, function (err, dates) {
  	res.render('chanView.html',{
        server: req.params.server,
        chan: req.params.chan,
        dates: dates ? dates.reverse() : []
    });
  });
});

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
  fs.readFile(path + "/" + server + "/" + chan + "/" + date, 'utf8', function(err, contents) {
    if (err) {
      res.render('chatView.html', {err: err});
    } else {
    	res.render('chatView.html', {
        logs: contents ? contents.split("\n") : [],
        server: server,
        chan: chan,
        date: date
      });
    }
  });
});

app.use(function (req, res) {
  res.sendStatus(404);
});

var server = app.listen(3003, function () {
  var port = server.address().port;
  console.log('Server started on port %s', port);
});
