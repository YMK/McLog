var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    app = express(),
    consolidate = require('consolidate'),
    config = require('./src/config'),
    home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    rootPath = path.join(home, config.rootPath),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    logger = require('morgan');

app.engine('html', consolidate.nunjucks);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'src'));

app.use(express.static('src', {
  redirect: false
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '1233__^32111dd',
  name: 'SessionID',
  resave: false,
  saveUninitialized: true,
  cookie: {
      // secure: true,        // Use in production. Send session cookie only over HTTPS
      httpOnly: true,
  }
}));
app.use(flash());

require('./src/auth')(app);
require('./src/search')(app, rootPath);
require('./src/server/server')(app, rootPath);
require('./src/channel/channel')(app, rootPath);
require('./src/chat/chat')(app, rootPath);

var getPaths = (dir, cb) => fs.readdir(rootPath, cb);
var renderIndex = (servers, user, res) => res.render('../index.html', {servers: servers, user: user});

app.get('/', (req, res) => getPaths(rootPath, (err, servers) => renderIndex(servers, req.user, res)));

app.use( (req, res) => res.sendStatus(404) );

var server = app.listen(config.port, () => {
  var port = server.address().port;
  console.log('YaManicLog started on port %s', port);
});
