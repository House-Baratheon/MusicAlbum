var app = app || {};

app.views = (function () {
    var $songsContainer = $('#songs');

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
            $song.find('.upload-button-link').attr('href', song.file.url);
            $songsContainer.append($song);
       });
    }

    function getSongsContainer(){
        return $songsContainer;
    }

    return {
        song: song,
        getSongsContainer: getSongsContainer
    };
})();
