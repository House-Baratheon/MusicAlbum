var app = app || {};

app.controller = (function () {
    function Controller(data, views) {
        this._data = data;
        this._views = views;
    }

    Controller.prototype.load = function () {
        loadSongs.call(this);
    };

    function loadSongs() {
        var _this = this;
        _this._data.songs.readAllRows(function (dataSongs) {
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

            },
            function () {
                console.log('Can not read songs');
            });
    }

    //Songs.prototype.getAll = function () {
    //    _this = this;
    //    _this._requester.setTableName('Songs');
    //    _this._requester.readAllRows(function (dataSongs) {
    //        _this._requester.readAllUsers(function (dataUploader) {
    //            var uploaders = [];
    //
    //            dataUploader.forEach(function (uploader) {
    //                uploaders[uploader.objectId] = uploader;
    //            });
    //
    //            dataSongs.forEach(function (song) {
    //                song.uploader = uploaders[song.uploader.objectId];
    //                getSong(song);
    //            });
    //        });
    //    });
    //};

    return {
        get: function(data, views){
           return  new Controller(data, views);
        }
    }
})();