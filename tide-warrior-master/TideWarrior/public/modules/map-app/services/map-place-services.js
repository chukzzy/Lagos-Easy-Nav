var app = angular.module('mapApp');

/* This is the service (or factory) that takes care of getting
 * the places from the backend server using the api the server provides
 */
app.factory('MapService', [
	'$http',
	function($http) {
		var Service = {};

		/* This function is part of the service
		 * Specifically, it gets all the available place categories
		 * from the server, using the api
		 * Parameter is a callback to invoke once all the categories
		 * have been gotten or an error occured
		 * callback signature is callback(err, data)
		 */
		Service.getAllPlacesAndCategories = function(callback) {
			$http.get('/api/maps/everything')
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