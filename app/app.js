angular.module('docs', ['ngMaterial', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/');

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "app/templates/home.html"
            })
            .state('examples', {
                url: "/examples",
                templateUrl: "app/templates/examples.html",
                
                controller: function ($scope) {
                    $scope.data = {};
                    $scope.data.examples = [
                        {
                            title: 'Pattern #1',
                            className: 'pixel-pattern-1',
                            fileName: 'less/pixel-pattern-1.less'
                        },
                        {
                            title: 'Schibsted pixel pattern',
                            className: 'sch-pixel-pattern',
                            fileName: 'less/sch-pixel-pattern.less'
                        }
                    ];
                }
            })
        ;
    })
;
