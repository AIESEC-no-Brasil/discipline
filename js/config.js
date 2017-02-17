/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/login");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'We dare, we do it!' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "views/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.analysis', {
            url: "/analysis",
            templateUrl: "views/analysis.html",
            data: { pageTitle: 'OD Analytics' },
            controller: 'AnalysisCtrl'
        })
        .state('index.people', {
            url: "/people",
            templateUrl: "views/people_list.html",
            data: { pageTitle: 'People Management' },
            controller: 'PeopleCtrl'
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: { pageTitle: 'Login on EXPA' }
        })
}
angular
    .module('inspinia')
    .config(config)
    .filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return (input != null) ? input.split(splitChar)[splitIndex] : '';
        }
    })
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
