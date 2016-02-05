var Model = require('./Model');
var inherits = require('util').inherits;

var placesTb = 'places',
	categoriesTb = 'places_categories',
	geolocationsTb = 'geolocations';

var tbMaps = {
	id: 'place_id',
	name: 'place_name',
	tags: 'place_tags',
	category: 'place_category',
	points: 'AsText(location_points)',
	categoryId: 'category_id',
	categoryName: 'category_name'
};

function Place () {
	Model.call(this);
}

inherits(Place, Model);

/**
 * [getAllCategories Gets all the categories of places in the database]
 * @param  {Function} callback
 *             [
 *                 Function to call once the data
 *                 is retrieved or error occurs.
 *                 Should take parameters:
 *         		      err: null if no error occured
 *         		      	   or contains the error object
 *              	  results:  array of rows of the returned entries
 *              	  	        for places
 *             ]
 * @param  {[Array]} fields <optional>
 *             [
 *                 contains the fields to get for the entries.
 *                 Gets all fields if not specified
 *             ]
 */
Place.prototype.getAllCategories = function (callback, fields) {
	if (callback) {
		var queryString = 'SELECT ';
		if (fields) {
			var tbColumns = [];
			fields.forEach(function (field) {
				if (tbMaps[field]) {
					tbColumns.push(tbMaps[field] + ' AS ' + field);
				}
				else {
					tbColumns.push(field);
				}
			});
			queryString += tbColumns.join(', ') + ' ';
		}
		else {
			queryString += '* ';
		}
		queryString += 'FROM ' + categoriesTb;
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
};


Place.prototype.getAllNames = function (callback, fields) {
	if (callback) {
		//var queryString = 'SELECT * FROM ' + placesTb;
		
		var queryString = 'SELECT ';

		queryString += categoryName + ' AS ' + alias + 'FROM ' + categoriesTb +' UNION ' +
						'SELECT ' + placeName + ' FROM ' + placesTb;
		
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
};

/**
 * [find Gets all the entries for places that match the filters]
 * @param  {Object}  filters
 *         	   [
 *         	       A key=value pair to use to filter the entries
 *         	       returned for places
 *                 The value should be a valid SQL equality string
 *         	   ]
 * @param  {Function} callback
 *             [
 *                 Function to call once the data
 *                 is retrieved or error occurs.
 *                 Should take parameters:
 *         		      err: null if no error occured
 *         		      	   or contains the error object
 *              	  results:  array of rows of the returned entries
 *              	  	        for this model
 *             ]
 * @param  {[Array]} fields <optional>
 *             [
 *                 contains the fields to get for the entries.
 *                 Gets all fields if not specified
 *             ]
 */
Place.prototype.find = function (filters, callback, fields) {
	if (callback) {
		var queryString = 'SELECT ';
		if (fields) {
			var tbColumns = [];
			fields.forEach(function (field) {
				if (tbMaps[field]) {
					tbColumns.push(tbMaps[field] + ' AS ' + field);
				}
				else {
					tbColumns.push(field);
				}
			});
			queryString += tbColumns.join(', ') + ' ';
		}
		else {
			queryString += '* ';
		}

		queryString += 'FROM ' + placesTb + ' INNER JOIN ' +
					   geolocationsTb + ' ON place_location ' +
					   '= location_id ';
		if (filters) {
			queryString += 'WHERE ';
			var first = true;
			for (var field in filters) {
				if (!first) {
					queryString += ' AND ';
				}
				else {
					first = false;
				}
				if (tbMaps[field]) {
					queryString += tbMaps[field];
				}
				else {
					queryString += field;
				}
					queryString += ' ' + filters[field];
			}
		}
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
};

module.exports = new Place();
