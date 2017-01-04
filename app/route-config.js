(function() {
    'use strict';

    /**
     * This is the routeconfig.
     * @param  {Object} $routeProvider Angular service to configuring routes.
     */
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
