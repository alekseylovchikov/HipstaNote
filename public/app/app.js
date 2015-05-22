angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'noteService', 'notesCtrl'])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });