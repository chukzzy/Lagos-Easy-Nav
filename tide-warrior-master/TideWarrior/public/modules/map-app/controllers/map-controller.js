var app = angular.module('mapApp');


app.controller('MapController', [
    '$scope',
    'MapService',
    function($scope, MapService) {

        $scope.getAllPlacesAndCategories = function() {
            MapService.getAllPlacesAndCategories(function(err, data) {
                if (err) {
                    $scope.error = true;
                    $scope.errorMessage = err.errorMessage;
                }
                else {
                    $scope.placesAndCategoriesAndAddresses = data;
                }
            });
        };


        $scope.setSelected  = function(selected, id) {
            $scope.slected  = selected;
            var inputId     = document.getElementById(id);

            inputId.value   = selected;

        };


        // first get all categories once loaded
        $scope.getAllPlacesAndCategories();
    }
]);