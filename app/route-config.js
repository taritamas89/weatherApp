(function() {
    'use strict';

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/cities'
            })
            .when('/cities', {
                templateUrl: 'app/cities/cities.html',
                controller: 'CitiesController',
                controllerAs: 'vm',
                reloadOnSearch: false
            });
    }

    angular
        .module('app')
        .config(config);
})();
