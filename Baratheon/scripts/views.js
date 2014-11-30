var app = app || {};

app.views = (function () {
    function song(song) {
        var $song = $('<article class="song">').load('htmlElements/song.html', function () {
            $song.find('.songName').text(song.artist + ' - ' + song.name);
            $song.find('.uploaderName').text(song.uploader.username);
            $song.find('.duration').text(song.duration);
            // $song.children('.').text();
            //$song.children('.').text();
            //$song.children('.').text();
            $('body').append($song);
       });
    }

    return {
        song: song
    };
})();
