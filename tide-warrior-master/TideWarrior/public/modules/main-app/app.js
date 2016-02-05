// This is the actual declaration of the mainApp module
var mainApp = angular.module('mainApp', [
	'ngRoute'
]);

// this creates a rootScope to hold variables
// and functions that should be available to all
// controllers
mainApp.run(['$rootScope',
  function($rootScope) {
      $rootScope.getCoordinates = function(points) {
        return points.match(/\d+\.\d+/g);
      };
  }
]);

/* This takes care of the routing on the homepage
 * by loading the appropriate controller and view
 * on each subpage
 */
mainApp.config(['$routeProvider',
	function($routeProvider) {
    	$routeProvider.
      		when('/', {
        		templateUrl: 'partials/home.html',
        		controller: 'HomepageController'
      		}).
      		when('/events', {
        		templateUrl: 'partials/events.html',
        		controller: 'EventsController'
      		}).
      		when('/places', {
        		templateUrl: 'partials/places.html',
        		controller: 'PlacesController'
      		}).
					when('/login-page', {
        		templateUrl: 'partials/login-page.html'
      		}).
      		otherwise({
        		redirectTo: '/'
      		});
    }
]);
