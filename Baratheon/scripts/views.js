var app = app || {};

app.views = (function () {
    var $songsContainer = $('#songs');
    var $formContainer = $('main');

    function song(song) {
        var $song = $('<article class="song">').load('htmlElements/song.html', function () {
            $song.find('.songName').text(song.artist + ' - ' + song.name);
            $song.find('.uploaderName')
                .text(song.uploader.username)
                .attr('data-id', song.uploader.objectId);
            $song.find('.duration').text(song.duration);
            $song.find('.genre').text(song.genre);
            $song.find('.album').text(song.album);
            $song.find('.rating').text(song.rating);
            $song.find('.controls').attr('id', song.objectId)
            $song.find('.upload-button-link').attr('href', 'data:application/octet-stream,' + song.file.url);
            $song.find('.upload-button-link').attr('download', song.name + '.mp3');
            $song.find('.comments').attr('data-id', song.objectId);
            $songsContainer.append($song);
        });
    }

    function songForm(song, saveFunction){
        var $songForm = $('<div class="forms">').load('htmlElements/songForm.html', function () {
            if(song){
                $songForm.find('h1').text('Edit Song');
                $songForm.find('#songName').val(song.name);
                $songForm.find('#artist').val(song.artist);
                $songForm.find('#genre').val(song.genre);
                $songForm.find('#album').val(song.album);
                $songForm.find('.controls').attr('id', song.objectId)
            }
        }, function () {
            console.log('Can not load songForm.html');
        });

        $songForm.hide();
        $formContainer.append($songForm);
        $songForm.on('click', '#cancelButton', function() {
            $songForm.remove();
        });

        $songForm.on('click', '#saveButton', function() {
            var songObj = {
                name: $songForm.find('#songName').val(),
                album: $songForm.find('album').val(),
                artist:  $songForm.find('artist').val(),
                genre:  $songForm.find('genre').val()
            };
            saveFunction(songObj);
            $songForm.remove();
        });

        $songForm.show();
    }

    function getSongsContainer() {
        return $songsContainer;
    }

    function getFormContainer() {
        return $formContainer;
    }

    return {
        song: song,
        songForm: songForm,
        getSongsContainer: getSongsContainer,
        getFormContainer: getFormContainer
    };
})();
