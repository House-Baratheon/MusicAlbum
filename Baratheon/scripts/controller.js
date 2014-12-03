var app = app || {};

app.controller = (function () {
    function Controller(data, views) {
        this._data = data;
        this._views = views;
    }

    Controller.prototype.load = function () {
        loadSongs.call(this);
        attachEvents.call(this);
    };

    function loadSongs(column, value) {
        var _this = this;
        _this._views.getSongsContainer().html('');
        function successSongFunction(dataSongs) {
            _this._data.users.readAllRows(function (dataUploader) {
                    var uploaders = [];

                    dataUploader.forEach(function (uploader) {
                        uploaders[uploader.objectId] = uploader;
                    });

                    dataSongs.forEach(function (song) {
                        song.uploader = uploaders[song.uploader.objectId];
                        _this._views.song(song);
                    });
                },
                function () {
                    console.log('Can not read users');
                });
        }

        function errorSongsFunction() {
            console.log('Can not read songs');
        }

        if (column && value) {
            _this._data.songs.readAllRowsWhere(column, value, successSongFunction, errorSongsFunction);
        } else {
            _this._data.songs.readAllRows(successSongFunction, errorSongsFunction);
        }
    }

    function attachEvents() {
        var _this = this;
        _this._views.getSongsContainer().on('click', '.album', function (e) {
            var album = $(e.target).text();
            loadSongs.call(_this, 'album', album);
        });

        _this._views.getSongsContainer().on('click', '.uploaderName', function (e) {
            var uploaderId = $(e.target).attr('data-id'),
                uploader = {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": uploaderId
                };

            loadSongs.call(_this, 'uploader', uploader);
        });

        _this._views.getSongsContainer().on('click', '.genre', function (e) {
            var genre = $(e.target).text();
            loadSongs.call(_this, 'genre', genre);
        });

        _this._views.getSongsContainer().on('click', '.deleteSong', function (e) {
            var songId = $(e.target).parent().attr('id');
            app.confirmationForm.show('#' + songId, 'Do you want to delete this song?', function () {
                _this._data.songs.deleteRow(songId, function () {
                        console.log('The song was deleted successful.');
                        loadSongs.call(_this);
                    },
                    function () {
                        console.log('Can not delete song.');
                    });
            });
        });

        _this._views.getSongsContainer().on('click', '.editSong', function (e) {
            var $form = $(e.target).parent();
            var songId = $form.attr('id');
            _this._data.songs.readAllRowsWhere('objectId', songId, function (song) {
                    _this._views.songForm(song[0], function(songObj){
                        _this._data.songs.editRow(songId, songObj, function () {
                            console.log('The song is edited.');
                            loadSongs.call(_this);
                        }, function () {
                            console.log('The song is not edited.');
                        });
                    });

                },
                function () {
                    console.log('Can not read songData.');
                });
        });

        $('#showAll').on('click', function (e) {
            var genre = $(e.target).text();
            loadSongs.call(_this);
        });
    }

    return {
        get: function (data, views) {
            return new Controller(data, views);
        }
    }
})();