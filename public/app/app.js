angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'noteService', 'notesCtrl', 'reverseDirective'])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });