var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    consolidate = require('consolidate'),
    config = require('./src/config'),
    home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    rootPath = path.join(home, config.rootPath);

app.engine('html', consolidate.nunjucks);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'src'));

require('./src/server/server')(app, rootPath);
require('./src/channel/channel')(app, rootPath);
require('./src/chat/chat')(app, rootPath);

var getPaths = (dir, cb) => fs.readdir(rootPath, cb);
var renderIndex = (servers, res) => res.render('../index.html', {servers: servers});

app.get('/', function (req, res) {
  getPaths(rootPath, (err, servers) => renderIndex(servers, res));
});

app.use( (req, res) => res.sendStatus(404) );

var server = app.listen(config.port, () => {
  var port = server.address().port;
  console.log('YMKLogue started on port %s', port);
});
