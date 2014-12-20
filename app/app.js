angular.module('docs', ['ngMaterial', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/');

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "app/templates/home.html"
            })
            .state('example', {
                url: "/example",
                templateUrl: "app/templates/example.html"
            })
        ;
    })
;
