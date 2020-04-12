angular.module('myApp')
    .config(function ($urlRouterProvider, $stateProvider) {

        $urlRouterProvider.otherwise('404');

        $stateProvider
            .state('root', {
                url: '',
                templateUrl: '/home/home.html'
            })
            .state('home', {
                url: '/',
                templateUrl: '/home/home.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: '/register/register.html'
            })
            .state('404', {
                url: '/404',
                templateUrl: '/404.html'
            })

    });