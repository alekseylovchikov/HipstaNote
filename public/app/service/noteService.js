angular.module('noteService', [])
    .factory('Notes', function($http) {
        var notesFactory = {};

        notesFactory.create = function(noteData) {
            return $http.post('/api/', noteData);
        };

        notesFactory.allNotes = function() {
            return $http.get('/api/all_notes');
        };

        notesFactory.all = function() {
            return $http.get('/api/');
        };

        return notesFactory;
    })

    .factory('socketio', function($rootScope) {
        var socket = io.connect();

        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.apply(function() {
                        if(callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    });