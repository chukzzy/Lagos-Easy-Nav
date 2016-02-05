var express = require('express');
var router = express.Router();

var config = require('../../config');
var debug = require('debug')('TideWarrior:mapAPI');
var Map = require('../../models/Map');

router.get('/everything', function(req, res, next) {
 	var apiResponse = {};
 	var alias = 'allCategoriesAndPlaces ';
	Map.getCategoriesAndPlaces(alias, function (err, results) {
		if (err) {
			apiResponse.responseStatus = "error";
	 		apiResponse.errorMessage = err.message;
	 		debug(err.databaseError);
	 		res.json(apiResponse);
		}
		else {
			apiResponse.responseStatus = "success";
		 	apiResponse.responseTime = Date();
			apiResponse.results = results;
			res.json(apiResponse);
		}
	});
});


router.all('*', function(req, res, next) {
	res.json({
		responseStatus: "error",
		errorMessage: "invalid request"
	});
});

module.exports = router;