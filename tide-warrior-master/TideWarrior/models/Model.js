var dbClient = require('../dbClient');

function Model () {
	this.db = dbClient;
}

// Functions all models should support
// The functions just return an err object
// stating the activity is not supported
// Most of these will be overriden in
// the subclasses of Model

/**
 * [getAll Gets all the entries for this model]
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
Model.prototype.getAll = function (callback, fields) {
	if (callback) {
		var errResponse = {};
		errResponse.status = 'Invalid action';
		errResponse.message = 'This model does not support retrieving all entries';
		callback(errResponse);
	}
};

/**
 * [find Gets all the entries for this model that match the filters]
 * @param  {Object}  filters
 *         	   [
 *         	       A key=value pair to use to filter the entries
 *         	       returned for this model
 				   The value should be a valid SQL equality string
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
Model.prototype.find = function (filters, callback, fields) {
	if (callback) {
		var errResponse = {};
		errResponse.status = 'Invalid action';
		errResponse.message = 'This model does not support searching all entries';
		callback(errResponse);
	}
};

/**
 * [save Saves the new data in the table for this model]
 * @param  {[Object]} newData
 *             [
 *                 Contains the new data to save
 *                 in key=value pairs
 *             ]
 * @param  {Function} callback <optional>
 *             [
 *                 Function to call once the data
 *                 is saved or error occurs.
 *                 Should take parameters:
 *         		      err: null if no error occured
 *         		      	   or contains the error object
 *              	  id:  id of the newly added data in
 *              	  	   the table for this model
 *             ]
 */
Model.prototype.save = function (newData, callback) {
	if (callback) {
		var errResponse = {};
		errResponse.status = 'Invalid action';
		errResponse.message = 'This model does not support saving new entries';
		callback(errResponse);
	}
};

/**
 * [update Updates an existing data in the table for this model
 * 		   with new data]
 * @param  {[Object]} newData
 *             [
 *                 Contains the new data to update with
 *                 in key=value pairs
 *             ]
 * @param  {[Object]} oldData
 *             [
 *                 Contains information about the existing
 *                 data to update in key=value pairs
 *             ]
 * @param  {Function} callback <optional>
 *             [
 *                 Function to call once the data
 *                 is saved or error occurs.
 *                 Should take parameters:
 *         		      err: null if no error occured
 *         		      	   or contains the error object
 *              	  id:  id of the updated data in
 *              	  	   the table for this model
 *             ]
 */
Model.prototype.update = function (newData, oldData, callback) {
	if (callback) {
		var errResponse = {};
		errResponse.status = 'Invalid action';
		errResponse.message = 'This model does not support updating entries';
		callback(errResponse);
	}
};

module.exports = Model;