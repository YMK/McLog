var config = require('../config'),
	utils = require('../utils'),
	base32 = require('thirty-two'),
	passport = require('passport'),
	TwoFAStartegy = require('passport-2fa-totp').Strategy;

module.exports = function (app) {

 	passport.use(new TwoFAStartegy({
    usernameField: 'username',
    passwordField: 'password',
    codeField: 'code'
  }, function (username, password, done) {
		return done(null, {});
	}, function (user, done) {
		var key = config.key;
		if (!key) {
			return done("No key set.");
		}
		return done(null, config.key, 30);
	}));

	passport.serializeUser(function (user, done) {
		return done(null, "hardcoded");
	});

	passport.deserializeUser(function (id, done) {
		return done(null, {id: "hardcoded"})
	});

  app.use(passport.initialize());
  app.use(passport.session());

	app.get('/setup', function(req, res, next){
		var key = config.key;
    if (key) {
			// To stop other users getting the QR, we only show it on the first try
		  res.render('./auth/setup.html', {
				errors: req.flash('error')
			});
    } else {
      var key = utils.randomKey(10);
      var encodedKey = base32.encode(key);

      var otpUrl = 'otpauth://totp/' + "YMKLogue" + '?secret=' + encodedKey + '&period=30';
      var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);

      config.setKey(key).then(function () {
	      res.render('./auth/setup.html', { user: req.user, key: encodedKey, qrImage: qrImage });
      });
    }
	});

	app.get('/login', function(req, res){
	  res.render('./auth/setup.html', {
			errors: req.flash('error')
		});
	});

	app.post('/login', passport.authenticate('2fa-totp', { failureRedirect: '/login', successRedirect: '/', failureFlash: true}));
};
