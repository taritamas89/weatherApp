(function() {
    'use strict';

    function DialogController($mdDialog, citiesService, city) {
        var vm = this;
        var publicProperties = {
            cancel: cancel,
            addCriteria: addCriteria,
            city: city,
            currentTemperature: null
        };
        angular.extend(vm, publicProperties);

        function cancel() {
            $mdDialog.cancel();
        }

        function addCriteria() {
            console.log("ADd criteria: ", vm.temperatureCriteria);

            if (localStorage.getItem(vm.city._id) !== null) {
                var confirm = $mdDialog.confirm()
                    .title('Would you like to change the current limit? (' + vm.city.criteria +') Celsius')
                    .textContent('New limit for ' + vm.city.name + ' city: ' + vm.temperatureCriteria + ' Celsius')
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function() {
                    changeCriteria();
                }, function() {
                    $mdDialog.cancel();
                });
            } else {
                changeCriteria();
                $mdDialog.hide();
            }
        }

        function changeCriteria() {
            vm.city.criteria = vm.temperatureCriteria;
            localStorage.setItem(vm.city._id, vm.temperatureCriteria);
        }

        function setTemperature() {
            citiesService.getWeatherDataByCityId(city._id).then(
                function(data) {
                    vm.currentTemperature = data.main.temp;
                    city.temperature = vm.currentTemperature;
                },
                function(error) {
                    console.log("Error!");
                });

        }
        // function calls
        console.log(vm.city);
        vm.temperatureCriteria = parseFloat(vm.city.criteria);
        setTemperature();
    }

    DialogController.$inject = [
        '$mdDialog',
        'citiesService',
        'city'
    ];

    angular
        .module('app.dialog')
        .controller('DialogController', DialogController);
})();
