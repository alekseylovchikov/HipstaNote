angular.module('appRoutes', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .when('/login', {
                templateUrl: 'app/views/pages/login.html'
            })
            .when('/signup', {
                templateUrl: 'app/views/pages/signup.html'
            })
            .when('/allNotes', {
                templateUrl: 'app/views/pages/notes.html',
                controller: 'AllNotesController',
                controllerAs: 'note',
                resolve: {
                    notes: function(Notes) {
                        return Notes.allNotes();
                    }
                }
            });

        $locationProvider.html5Mode(true);
    });