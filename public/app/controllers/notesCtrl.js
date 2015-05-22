angular.module('notesCtrl', ['noteService'])
    .controller('NotesController', function(Notes, socketio) {
        var vm = this;

        Notes.all()
            .success(function(data) {
                vm.notes = data;
            });

        vm.createNote = function() {
            vm.message = '';

            Notes.create(vm.noteData)
                .success(function(data) {
                    vm.noteData = '';

                    vm.message = data.message;
                });
        };

        socketio.on('note', function(data) {
            vm.notes.push(data);
        });
    })

    .controller('AllNotesController', function(notes, socketio) {
        var vm = this;

        vm.notes = notes.data;

        socketio.on('note', function(data) {
            vm.notes.push(data);
        });
    });