var express = require('express');
var router = express.Router();

var config = require('../config.js');

router.get('/', function(req, res, next) {
	res.render('index', {
	  	title: config.appName,
	  	partials: {
	  		head: 'partials/head',
	  		navigation: 'partials/navigation',
	  		footer: 'partials/footer',
	  		scripts:  'partials/scripts'
	  	}
	});
});

module.exports = router;
