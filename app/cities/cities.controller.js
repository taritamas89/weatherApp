(function() {
    'use strict';

    /**
     * Controller to handle list of cities.
     * @param {Object} citiesService       Service of Cities
     * @param {Object} $mdDialog           Angular material dialog service.
     * @param {Object} notificationService Service of Notifications
     * @param {Object} $interval           Angular service for window.setInterval
     * @param {Object} $cookies            Angular service for cookie handling
     */
    function CitiesController(citiesService, $mdDialog, notificationService, $interval, $cookies) {
        var vm = this;
        var publicProperties = {
            addCriteria: addCriteria,
            removeCriteria: removeCriteria,
            isTemperatureLoaded: false
        };
        angular.extend(vm, publicProperties);

        /**
         * Get cities from a built in json file and also get temperatures for cities.
         * Start an interval to updta temperatures.
         */
        function getCities() {
            citiesService.getCitiesFromJson().then(function(data) {
                vm.cities = data;

                //for the first time
                getTemperatureForCities();

                //call every 10 sec
                var interval = $interval(getTemperatureForCities, 60000);
                //TODO: cancel the interval
            });
        }

        /**
         * Get temperatures for given cities and hide the loading bar. Call the checklimits if the data is provided.
         */
        function getTemperatureForCities() {
            console.log("GET TEMPERATURE");

            notificationService.getTemperatureByGivenCities(vm.cities).then(
                function(data) {
                    console.log("success");
                    vm.isTemperatureLoaded = true;

                    checkLimits();
                },
                function() {
                    console.log("error500");
                    vm.isTemperatureLoaded = true;
                }
            );
        }

        /**
         * Check the preset limits for the given cities and show a notification if the limit is reached.
         * Save the sate is the notification has been triggered for a city.
         */
        function checkLimits() {
            console.log("checking limits");
            if (localStorage.length) {
                var keys = Object.keys(localStorage);
                for (var i = 0; i < keys.length; i++) {
                    var city = citiesService.getCityById(vm.cities, keys[i]);
                    if (city.temperature >= city.criteria) {
                        if (!$cookies.get(city._id)) {
                            showLimitReachedDialog(city);
                            // alert('Temperature of ' + city.name + ' has reached the limit(' + city.criteria + ' Celsius)!');
                            var expireDate = new Date();
                            expireDate.setDate(expireDate.getDate() + 1);
                            $cookies.put(city._id, true, {
                                'expires': expireDate
                            });
                        }
                    }
                }
            }
        }

        /**
         * Show an alert dialog with some data of a city.
         * @param {Object} city Represent a city.
         */
        function showLimitReachedDialog(city) {
            var alert = $mdDialog.alert()
                .title('Limit reached!')
                .textContent('Temperature of ' + city.name + ' has reached the limit (' + city.criteria + ' Celsius)!')
                .ok('Ok');
            $mdDialog.show(alert);
        }

        /**
         * Show a custom dialog to make the user able to set criteria for a city.
         * @param {Object} ev   Event object.
         * @param {Object} city Represent a city.
         */
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

        /**
         * Show a confirmation dialog when user wants to remove criteria.
         * When user confirm, remove saved criteria from localStorage and remove city from cookies.
         * @param {Object} city Represent a city.
         */
        function removeCriteria(city) {
            var confirm = $mdDialog.confirm()
                .title('Would you like to remove the current limit?')
                .textContent('Current limit in ' + city.name + ': ' + city.criteria + ' Celsius')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {
                city.criteria = null;
                localStorage.removeItem(city._id);
                $cookies.remove(city._id);
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
        'notificationService',
        '$interval',
        '$cookies'
    ];

    angular
        .module('app.cities')
        .controller('CitiesController', CitiesController);
})();
