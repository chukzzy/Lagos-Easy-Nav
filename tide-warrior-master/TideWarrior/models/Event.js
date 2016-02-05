var Model = require('./Model');
var inherits = require('util').inherits;

var eventsTb = 'events',
	categoriesTb = 'events_categories',
	geolocationsTb = 'geolocations';

var tbMaps = {
	id: 'event_id',
	name: 'event_name',
	tags: 'event_tags',
	category: 'event_category',
	points: 'AsText(location_points)',
	categoryId: 'category_id',
	categoryName: 'category_name'
};

function Event () {
	Model.call(this);
}

inherits(Event, Model);

/**
 * [getAllCategories Gets all the categories of events in the database]
 * @param  {Function} callback
 *             [
 *                 Function to call once the data
 *                 is retrieved or error occurs.
 *                 Should take parameters:
 *         		      err: null if no error occured
 *         		      	   or contains the error object
 *              	  results:  array of rows of the returned entries
 *              	  	        for events
 *             ]
 * @param  {[Array]} fields <optional>
 *             [
 *                 contains the fields to get for the entries.
 *                 Gets all fields if not specified
 *             ]
 */
Event.prototype.getAllCategories = function (callback, fields) {
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

/**
 * [find Gets all the entries for events that match the filters]
 * @param  {Object}  filters
 *         	   [
 *         	       A key=value pair to use to filter the entries
 *         	       returned for events
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
Event.prototype.find = function (filters, callback, fields) {
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

		queryString += 'FROM ' + eventsTb + ' INNER JOIN ' +
					   geolocationsTb + ' ON event_location ' +
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

module.exports = new Event();