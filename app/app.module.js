(function() {
    'use strict';

    angular
        .module('app', [
            'ngMaterial',
            'ngRoute',
            'ngCookies',
            'app.cities',
            'app.dialog',
            'app.notification'
        ])
        .constant('APP_ID', '6b674fa53aa09143381e38d57c81f333');


})();
