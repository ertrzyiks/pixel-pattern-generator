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
        ;
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('examples', {
                url: '/examples',
                templateUrl: 'app/templates/examples.html',

                controller: function ($scope, $state) {
                    var getExampleById = function (id) {
                        return $scope.data.examples.filter(function (example) {
                            return example.id === id;
                        }).shift();
                    };

                    $scope.data = {};
                    $scope.data.ref = '';

                    $scope.$watch(function ($scope) {
                        return $scope.data.ref;
                    }, function (id) {
                        $scope.data.example = getExampleById(id);
                    });

                    $scope.data.examples = [
                        {
                            id: 'pattern1',
                            title: 'Pattern #1',
                            className: 'pixel-pattern-1',
                            fileName: 'less/pixel-pattern-1.less',
                            description: 'Chessboard pattern'
                        },
                        {
                            id: 'sch-pattern',
                            title: 'Branding pattern',
                            className: 'sch-pixel-pattern',
                            fileName: 'less/sch-pixel-pattern.less',
                            description: 'Example of pixel pattern used for Schibsted Tech Polska branding.'
                        },
                        {
                            id: 'pattern2',
                            title: 'Pattern #2',
                            className: 'pixel-pattern-2',
                            fileName: 'less/pixel-pattern-2.less',
                            description:
                                'Minion from template for minecraft players,' +
                                ' supposed to be build with wool or something.'
                        }
                    ];

                    if ($state.$current.self.name === 'examples') {
                        $state.go('examples.item', { ref: 'pattern1' });
                        return;
                    }
                }
            })
            .state('examples.item', {
                url: '/?ref',
                controller: function ($scope, $stateParams) {
                    $scope.data = $scope.data || {};
                    $scope.data.ref = $stateParams.ref;
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
