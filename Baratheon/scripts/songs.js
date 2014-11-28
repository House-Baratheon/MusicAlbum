var Songs = (function () {
    function Songs(requester) {
        this._requester = requester;
    }

    function getSong(song) {
        var $song = $('<article class="song">').load('htmlElements/song.html', function () {
            $song.find('.songName').text(song.artist + ' - ' + song.name);
            $song.find('.uploaderName').text(song.uploader.username);
            $song.find('.duration').text(song.duration);
            // $song.children('.').text();
            //$song.children('.').text();
            //$song.children('.').text();
            $body = $('body').append($song);
       });
    }

    Songs.prototype.getAll = function () {
        _this = this;
        _this._requester.setTableName('Songs');
        _this._requester.readAllRows(function (dataSongs) {
            _this._requester.readAllUsers(function (dataUploader) {
                var uploaders = [];

                dataUploader.forEach(function (uploader) {
                    uploaders[uploader.objectId] = uploader;
                 });

                dataSongs.forEach(function (song) {
                    song.uploader = uploaders[song.uploader.objectId];
                    getSong(song);
                });
            });
        });
    };

    return Songs;
})();

var r = new ParseComDB('R9zGRvhWmcjTARZq5MFxBUB3P1RULW3aumZG4ALm', 'aXcHxh3r16S0aF11lfxwassPTkZb5ztq5CwtiU7X');
var songs = new Songs(r);
songs.getAll();