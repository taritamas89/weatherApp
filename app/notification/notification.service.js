(function() {
    'use strict';

    function notificationService($http, $q, APP_ID) {
        var srvc = {};
        var publicProperties = {
            getTemperatureByGivenCities: getTemperatureByGivenCities
        };

        angular.extend(srvc, publicProperties);

        var OPEN_WEATHER_GROUP_URL = 'http://api.openweathermap.org/data/2.5/group';
        var CELCIUS_PARAM = 'units=metric';

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
