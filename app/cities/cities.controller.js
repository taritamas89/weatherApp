(function() {
    'use strict';

    function CitiesController(citiesService, $mdDialog, notificationService) {
        var vm = this;
        var publicProperties = {
            addCriteria: addCriteria,
            removeCriteria: removeCriteria,
            isTemperatureLoaded: false
        };
        angular.extend(vm, publicProperties);

        function getCities() {
            citiesService.getCitiesFromJson().then(function(data) {
                vm.cities = data;

                getTemperatureForCities();
            });
        }

        function getTemperatureForCities() {
            notificationService.getTemperatureByGivenCities(vm.cities).then(function(data) {
                console.log("success");
                vm.isTemperatureLoaded = true;

                // checkLimits();
            });
        }

        function checkLimits() {
            if (localStorage.length) {
                var keys = Object.keys(localStorage);
                for (var i = 0; i< keys.length; i++) {
                    var city = citiesService.getCityById(vm.cities, keys[i]);
                    if(city.temperature >= city.criteria) {
                        alert('Temperature of '+ city.name + ' has reached the limit('+city.criteria+' Celsius)!');
                    }
                }
            }
        }

        function addCriteria(ev, city) {
            console.log(city);

            $mdDialog.show({
                    controller: 'DialogController as dialog',
                    templateUrl: 'app/dialog/add-criteria-dialog.html',
                    // parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    resolve: {
                        city: function() {
                            return city;
                        }
                    }
                })
                .then(function(answer) {
                    console.log("confirm");
                    // checkLimits();
                    // $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    console.log("Cancel");
                    // $scope.status = 'You cancelled the dialog.';
                });
        }

        function removeCriteria(city) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to remove the current limit?')
                .textContent('Current limit in ' + city.name + ': ' + city.criteria + ' Celsius')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                city.criteria = null;
                localStorage.removeItem(city._id);
            }, function() {
                $mdDialog.cancel();
            });
        }

        // function calls
        getCities();
    }

    CitiesController.$inject = [
        'citiesService',
        '$mdDialog',
        'notificationService'
    ];

    angular
        .module('app.cities')
        .controller('CitiesController', CitiesController);
})();