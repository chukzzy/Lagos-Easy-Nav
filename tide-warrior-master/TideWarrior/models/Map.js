var Model    = require("./Model");
var inherits = require('util').inherits;

var placesTb = 'places',
	categoriesTb = 'places_categories',
	geolocationsTb = 'geolocations',
	categoryName  = 'category_name',
	placeName     = 'place_name',
	address       = 'location_address';


function Map() {
	Model.call(this);
}


inherits(Map, Model);


/* Alias: A temporary name I use to represent the single column so I can use
 * it to pull info from the front end and also it's just a string.
 *
 * Callback: callback is called when it done and checks if it was suceesful,
 * if it was, it ruturns the results , else error */

Map.prototype.getCategoriesAndPlaces = function(alias, callback) {
	if (callback) {
		var queryString = 'SELECT ';

		queryString += categoryName + ' AS ' + alias + 'FROM ' + categoriesTb +' UNION ' +
						'SELECT ' + placeName + ' FROM ' + placesTb + ' UNION '  +
						'SELECT ' + address + ' FROM ' + geolocationsTb;


		this.db.query(queryString, function (err, results) {
			if (err) {
				var errResponse = {};
				errResponse.status = 'Database Error';
				errResponse.message = 'Error retrieving data from database';
				errResponse.databaseError = err;
				callback(errResponse);
			}
			else {
				callback(null, results);
			}
		});
	}
}


/* textField is a string I use to pass info from my textField and check if matches info
 * in the database and probably do something with it. */

 //cant be in this class this query statement probably has to run from some other class to do its comparison
Map.prototype.checkIfItMatchesCategories = function(textField, callback) {
	if(callback) {
		var queryString = 'SELECT ';

		//queryString += 'FROM ' + categoriesTb + ' WHERE ' + categoryName + ' LIKE ' + '%textField'; 
	}
}


module.exports = new Map();
