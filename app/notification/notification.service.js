(function() {
    'use strict';

    /**
     * Service to handle notifications.
     * @param  {Object} $http  Angular service to communictat servers
     * @param  {Object} $q     Angular service to help you run functions asynchronously
     * @param  {String} APP_ID The application id of OpenWeatherMap
     * @return {Object}        The service object.
     */
    function notificationService($http, $q, APP_ID) {
        var srvc = {};
        var publicProperties = {
            getTemperatureByGivenCities: getTemperatureByGivenCities
        };

        angular.extend(srvc, publicProperties);

        var OPEN_WEATHER_GROUP_URL = 'http://api.openweathermap.org/data/2.5/group';
        var CELCIUS_PARAM = 'units=metric';

        /**
         * Get the temperature information for the given cities. Maximum number of cities is 20.
         * @param  {Array} cities List of city objects.
         * @return {Object}       A promise object with the updated city array.
         */
        function getTemperatureByGivenCities(cities) {
            var deferred = $q.defer();
            if (cities.length <= 20) {
                var ids = cities[0]._id;
                for (var i = 1; i < cities.length; i++) {
                    ids = ids + ',' + cities[i]._id;
                }
                $http({
                    url: OPEN_WEATHER_GROUP_URL + '?appid=' + APP_ID + '&' + CELCIUS_PARAM + '&' + 'id=' + ids,
                    method: 'GET'
                }).then(function(response) {
                    console.log("SUCCESS", response);
                    addTemperaturesToCities(cities, response.data);
                    deferred.resolve(cities);
                }, function(error) {
                    console.log("ERROR: ", error);
                    deferred.reject(error);
                });
            } else {
                deferred.reject("More than 20 city");
            }
            return deferred.promise;
        }

        /**
         * Add the temperature data to the cities.
         * @param  {Array} cities   List of city objects.
         * @param {Array} tempArray Array of temperature data. Contains a lot of weather data for a city.
         */
        function addTemperaturesToCities(cities, tempArray) {
            for (var i = 0; i < cities.length; i++) {
                cities[i].temperature = tempArray.list[i].main.temp;
            }
        }

        return srvc;
    }

    notificationService.$inject = [
        '$http',
        '$q',
        'APP_ID'
    ];

    angular
        .module('app.notification')
        .service('notificationService', notificationService);

})();
