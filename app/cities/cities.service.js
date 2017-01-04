(function() {
    'use strict';

    /**
     * Service to get cities and temperatures with API call.
     * @param  {Object} $http  Angular service to communictat servers
     * @param  {Object} $q     Angular service to help you run functions asynchronously
     * @param  {String} APP_ID The application id of OpenWeatherMap
     * @return {Object}        The service object.
     */
    function citiesService($http, $q, APP_ID) {
        var srvc = {};
        var publicProperties = {
            getCitiesFromJson: getCitiesFromJson,
            getWeatherDataByCityId: getWeatherDataByCityId,
            getCityById: getCityById
        };

        angular.extend(srvc, publicProperties);

        var OPEN_WEATHER_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
        var CELCIUS_PARAM = 'units=metric';

        /**
         * Get citites from a json file. Modify the JSON to be able to parse it.
         * @return {Array} List of city objects.
         */
        function getCitiesFromJson() {
            return $http({
                    url: '/assets/city.example2.json',
                    method: 'GET',
                    transformResponse: [function(data) {
                        var cities = data.split('\n');
                        for (var i = 0; i < cities.length; i++) {
                            // console.log(cities[i]);
                            cities[i] = JSON.parse(cities[i]);
                            console.log(cities[i]);
                            var criteria = localStorage.getItem(cities[i]._id);
                            if (criteria !== null) {
                                cities[i].criteria = criteria;
                            }
                        }
                        return cities;
                    }]
                })
                .then(function(response) {
                    return response.data;
                })
                .catch(function(error) {
                    console.log('XHR Failed for getCitiesFromJson.' + error.data);
                });
        }

        /**
         * Get weather data of a city by ID of the city.
         * @param  {Number} cityId Id of the city.
         * @return {Object}        A promise object with the weather data of a city.
         */
        function getWeatherDataByCityId(cityId) {
            var deferred = $q.defer();

            $http({
                url: OPEN_WEATHER_BASE_URL + '?appid=' + APP_ID + '&' + CELCIUS_PARAM + '&' + 'id=' + cityId,
                method: 'GET'
            }).then(function(response) {
                console.log("SUCCESS");
                deferred.resolve(response.data);
            }, function(error) {
                console.log("ERROR: ", error);
                deferred.reject(error);
            });

            return deferred.promise;
        }

        /**
         * Get a city from given array by the given cityId.
         * @param  {Array} List of city objects.
         * @param  {Number} cityId Id of the city.
         * @return {Object}        A city object.
         */
        function getCityById(cities, id) {
            var city = null;
            for (var i = 0; i < cities.length; i++) {
                if (cities[i]._id == id) {
                    city = cities[i];
                    break;
                }
            }
            return city;
        }

        return srvc;
    }

    citiesService.$inject = [
        '$http',
        '$q',
        'APP_ID'
    ];

    angular
        .module('app.cities')
        .service('citiesService', citiesService);
})();
