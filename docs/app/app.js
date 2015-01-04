angular.module('docs', ['ngMaterial', 'ui.router'])
    .config(function($urlRouterProvider) {
        $urlRouterProvider.when('', '/');
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "app/templates/home.html"
            })
            .state('examples', {
                url: "/examples",
                templateUrl: 'app/templates/examples.html',

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
                        },
                        {
                            title: 'Pattern #2',
                            className: 'pixel-pattern-2',
                            fileName: 'less/pixel-pattern-2.less'
                        }
                    ];
                }
            })
        ;
    })
    .config(function($stateProvider) {
        function getApiController(options) {
            return function ($scope){
                $scope.data = $scope.data || {};
                $scope.data.selectedIndex = options.index;
                $scope.data.ref = null;
            };
        }

        function getApiItemController() {
            return function ($scope, $stateParams) {
                $scope.data = $scope.data || {};
                $scope.data.ref = $stateParams.ref;
            };
        }

        $stateProvider
            .state('api', {
                url: '/api',
                templateUrl: 'app/templates/api.html',

                controller: function ($scope, $state) {
                    var currentStateName = $state.$current.self.name;

                    if (currentStateName === 'api') {
                        $state.go('api.less');
                        return;
                    }

                    $scope.data = {};
                    $scope.data.selectedIndex = ['api.less', 'api.js'].indexOf(currentStateName);
                }
            })
            .state('api.less', {
                url: '/less',
                templateUrl: 'app/templates/api/less.html',
                controller: getApiController({ index: 0 })
            })
            .state('api.less.item', {
                url: '/?ref',
                controller: getApiItemController()
            })
            .state('api.js', {
                url: '/js',
                templateUrl: 'app/templates/api/js.html',
                controller: getApiController({ index: 1 })
            })
            .state('api.js.item', {
                url: '/?ref',
                controller: getApiItemController()
            })
        ;
    })
;
