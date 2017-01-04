(function() {
    'use strict';

    /**
     * Controller for add dialog.
     * @param {Object} $mdDialog     Angular material dialog service.
     * @param {Object} citiesService Service of Cities
     * @param {Object} city          One city object.
     */
    function DialogController($mdDialog, citiesService, city) {
        var vm = this;
        var publicProperties = {
            cancel: cancel,
            addCriteria: addCriteria,
            city: city,
            currentTemperature: null,
            temperatureCriteria: null
        };
        angular.extend(vm, publicProperties);

        /**
         * Cancel the modal window with angular material dialog service.
         */
        function cancel() {
            $mdDialog.cancel();
        }

        /**
         * Check the already set criteria and show a confirm modal.
         * Change the values if the user wants to update the current criteria.
         */
        function addCriteria() {
            console.log("ADd criteria: ", vm.temperatureCriteria);
            console.log("old criteria: ", vm.city.criteria);

            if (localStorage.getItem(vm.city._id) !== null && (vm.city.criteria != vm.temperatureCriteria)) {
                var confirm = $mdDialog.confirm()
                    .title('Would you like to change the current limit? (' + vm.city.criteria + ' Celsius)')
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

        /**
         * Update the criteria for a city and store an item to localStorage.
         */
        function changeCriteria() {
            vm.city.criteria = vm.temperatureCriteria;
            localStorage.setItem(vm.city._id, vm.temperatureCriteria);
        }

        /**
         * Get temperature information for the current city and set the temperature for the city object.
         */
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
        if (vm.city.criteria) {
            vm.temperatureCriteria = parseFloat(vm.city.criteria);
        }
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
