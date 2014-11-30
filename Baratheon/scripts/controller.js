var app = app || {};

app.controller = (function () {
    function Controller(data, views) {
        this._data = data;
        this._views = views;
    }

    Controller.prototype.load = function () {
        loadSongs.call(this, 'body');
        attachEvents.call(this);
    };

    function loadSongs(column, value) {
        var _this = this;
        _this._views.getSongsContainer().html('');
        function successSongFunction (dataSongs) {
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

        if(column && value){
            _this._data.songs.readAllRowsWhere(column, value, successSongFunction, errorSongsFunction);
        } else {
            _this._data.songs.readAllRows(successSongFunction, errorSongsFunction);
        }
    }

    function attachEvents(){
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

        $('#showAll').on('click', function (e) {
            var genre = $(e.target).text();
            loadSongs.call(_this);
        });
    }

    return {
        get: function(data, views){
           return  new Controller(data, views);
        }
    }
})();