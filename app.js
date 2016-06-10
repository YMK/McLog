var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    consolidate = require('consolidate'),
    home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    rootPath = path.join(home, "logs", "/yamanickill");

if(process.argv.length > 2) {
  rootPath = process.argv[2];
}
console.log(rootPath);

app.engine('html', consolidate.nunjucks);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'src'));

require('./src/server/server')(app, rootPath);
require('./src/channel/channel')(app, rootPath);
require('./src/chat/chat')(app, rootPath);

app.get('/', function (req, res) {
  fs.readdir(rootPath, function (err, servers) {
  	res.render('../index.html',{
        servers: servers
    });
  });
});

app.use(function (req, res) {
  res.sendStatus(404);
});

var server = app.listen(3003, function () {
  var port = server.address().port;
  console.log('Server started on port %s', port);
});
