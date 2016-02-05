var express = require('express');
var router = express.Router();

var config = require('../../config');
var debug = require('debug')('TideWarrior:eventsAPI');
var Place = require('../../models/Event');

router.get('/categories', function(req, res, next) {
 	var apiResponse = {};
 	var fields = ['categoryId', 'categoryName'];
	Place.getAllCategories(function (err, results) {
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
	}, fields);
});

router.get('/category/:categoryId', function(req, res, next) {
 	var apiResponse = {};
 	var filters = {};
 	filters.category = '= ' + req.params.categoryId;
 	var fields = ['name','points'];
	Place.find(filters, function (err, results) {
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
	}, fields);
});

router.all('*', function(req, res, next) {
	res.json({
		responseStatus: "error",
		errorMessage: "invalid request"
	});
});

module.exports = router;