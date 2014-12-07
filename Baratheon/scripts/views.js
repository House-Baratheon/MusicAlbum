var app = app || {};

app.views = (function () {
    var $songsContainer = $('#songs');
    var $formContainer = $('main');
    var $playlistsContainer = $('#playlists');

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
            $song.find('.playButton').attr('data-link', song.file.url);
            $songsContainer.append($song);
        });
    }

    function songEditForm(song, saveFunction) {
        var $songForm = $('<div class="forms">').load('htmlElements/songForm.html', function () {
            if (song) {
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
        $songForm.on('click', '#cancelButton', function () {
            $songForm.remove();
        });

        $songForm.on('click', '#saveButton', function () {
            var songObj = {
                name: $songForm.find('#songName').val(),
                album: $songForm.find('#album').val(),
                artist: $songForm.find('#artist').val(),
                genre: $songForm.find('#genre').val()
            };
            saveFunction(songObj);
            $songForm.remove();
        });

        $songForm.show();
    }

    function songUploadForm(yesFunction, noFunction) {
        var $songForm = $('<div class="forms">').load('htmlElements/songUploadForm.html', function () {
            var file,
                files;
            $songForm.find('#edit-forms').hide();
            $formContainer.append($songForm);

            $('#upload').on("change", function (e) {
                files = e.target.files || e.dataTransfer.files;
                file = files[0];
                var url = file.name;
                ID3.loadTags(url, function(){
                    var tags = ID3.getAllTags(url);
                    $songForm.find('#edit-forms').show();
                    $songForm.find('#songName').val(tags.title);
                    $songForm.find('#album').val(tags.album);
                    $songForm.find('#artist').val(tags.artist);
                    $songForm.find('#genre').val(tags.genre);
                }, {tags: ["artist", "title", "album", "year", "comment", "track", "genre", "lyrics", "picture"],
                    dataReader: FileAPIReader(file)});
            });

            $songForm.on('click', '#saveButton', function(){
                var song = {
                    name: $songForm.find('#songName').val(),
                    artist: $songForm.find('#artist').val(),
                    album : $songForm.find('#album').val(),
                    genre: $songForm.find('#genre').val()
                };

                $songForm.remove();
                yesFunction(file, song);
            });

            $songForm.on('click', '#cancelButton', function(){
                $songForm.remove();
                noFunction();
            });
        });
    }

    function getSongsContainer() {
        return $songsContainer;
    }

    function getFormContainer() {
        return $formContainer;
    }

    function getPlaylistsContainer() {
        return $playlistsContainer;
    }

    // Form for adding a comment
    function addComment (songSection) {
        var $addComment = $('<section class="comments">').load('htmlElements/addComment.html',

            function () {
                songSection.append($addComment);
            },

            function () {
                console.log('Can not load addComment.html');
            }
        );
    }

    function showPlaylists(playlists) {

        $.get('htmlElements/playlists.html', function (template) {
            var output = Mustache.render(template, {playlists : playlists});
            $playlistsContainer.html(output);
        });
    }

    // Showing the already entered comments
    function showComment(songSection) {
        //var $showComment = $()
    }

    return {
        song: song,
        playlists: showPlaylists,
        songEditForm: songEditForm,
        songUploadForm: songUploadForm,
        getSongsContainer: getSongsContainer,
        getFormContainer: getFormContainer,
        getPlaylistsContainer : getPlaylistsContainer,
        addComment: addComment
    };
})();
