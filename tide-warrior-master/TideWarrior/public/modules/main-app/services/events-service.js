// This is not a redeclaration. Just referencing the mainApp module
var mainApp = angular.module('mainApp');

/* This is very similar to the PlacesServices for now
 * The thought is it might get very different from the places page
 * and will eventually need its own place later on.
 * However, if it continues to be a bunch of repitition of the Places* code,
 * we can refactor and merge the two later
 */
mainApp.factory('EventsService', [
	'$http',
	function($http) {
		var Service = {};

		/* This function is part of the service
		 * Specifically, it gets all the available event categories
		 * from the server, using the api
		 * Parameter is a callback to invoke once all the categories
		 * have been gotten or an error occured
		 * callback signature is callback(err, data)
		 */
		Service.getAllCategories = function(callback) {
			$http.get('/api/events/categories')
				.error(function() {
					callback({errorMessage: "no response from server"});
				})
				.success(function(data) {
					// if there is no data or the response status in the data says error
					if (!data || data.responseStatus == "error") {
						callback({errorMessage: data.errorMessage ||
							"empty response from server" });
					}
					else {
						callback(null, data.results);
					}
				});
		}

		/* This function is part of the service
		 * Specifically, it gets all the available events in a category
		 * from the server, using the api
		 * Parameter is the id of the category and callback to invoke
		 * once all the places have been gotten or an error occured
		 * callback signature is callback(err, data)
		 */
		Service.getEventsByCategory = function(categoryId, callback) {
			$http.get('/api/events/category/' + categoryId)
				.error(function() {
					callback({errorMessage: "no response from server"});
				})
				.success(function(data) {
					// if there is no data or the response status in the data says error
					if (!data || data.responseStatus == "error") {
						callback({errorMessage: data.errorMessage ||
							"empty response from server" });
					}
					else {
						callback(null, data.results);
					}
				});
		}

		return Service;
	}
]);