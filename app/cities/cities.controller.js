(function() {
    'use strict';

    function CitiesController(citiesService, $mdDialog, notificationService, $interval, $cookies) {
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

                //for the first time
                getTemperatureForCities();

                //call every 10 sec
                var interval = $interval(getTemperatureForCities, 60000);
                //TODO: cancel the interval

            });
        }

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

            // notificationService.getTemperatureByGivenCities(vm.cities).then(
            //     function(data) {
            //         console.log("success");
            //         vm.isTemperatureLoaded = true;
            //
            //         // checkLimits();
            //     },
            //     function() {
            //         console.log("error500");
            //         vm.isTemperatureLoaded = true;
            //     }
            // );
        }

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

        function showLimitReachedDialog(city) {
            var alert = $mdDialog.alert()
                .title('Limit reached!')
                .textContent('Temperature of ' + city.name + ' has reached the limit (' + city.criteria + ' Celsius)!')
                .ok('Ok');
            $mdDialog.show(alert);
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
