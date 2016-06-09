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
	res.render('index.html');
});

app.get('/:server/:chan/:date', function (req, res) {
  var server = req.params.server,
    chan = req.params.chan,
    date = req.params.date;

  if (!chan.includes("#")) {
    chan = "#" + chan;
  }
  fs.readFile(path + "/" + server + "/" + chan + "/" + date + ".log", 'utf8', function(err, contents) {
    if (err) {
      res.render('index.html', {err: err});
    } else {
    	res.render('index.html', {
        logs: contents ? contents.split("\n") : []
      });
    }
  });
});

app.use(function (req, res) {
  res.sendStatus(404);
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server started on port %s', port);
});
