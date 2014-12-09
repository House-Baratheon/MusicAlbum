var app = app || {};

app.controller = (function () {
    function Controller(data, views) {
        this._data = data;
        this._views = views;
    }


    Controller.prototype.load = function () {
        loadSongs.call(this);
        attachEvents.call(this);
        //loadComments.call(this);
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


    function addSongToPlayer(ev) {
        var $song = $(ev.target).parent();
        var song = {
            title: $.trim($song.find('.songName').text().split(/[-]+/)[1]),
            artist: $.trim($song.find('.songName').text().split(/[-]+/)[0]),
            url: $song.find('.addToPlayerList').attr('data-link')
        };
        <!-- add to list-->
        addToPlayerUI('.sm2-playlist-wrapper .sm2-playlist-bd');

        function addToPlayerUI(selector) {
            var $domElement = $(selector);
            var $wrapper = $('<div>').attr('id', 'wrapper');
            var $songLi = $('<li>');
            var $songLink = $('<a href="' + song.url + '">')
                .html('<b>' + song.artist + '</b>' + ' - ' + song.title)
                .attr('title', 'play');

            var $btnSongRemove = $('<div>')
                .append($('<a href="#">x</a>')
                    .attr({'id': 'removeSong', 'title': 'remove'})
                    .on('click', function (ev) {
                        $(ev.target).parent()
                            .parent().remove();
                    }));

            $songLi.append($songLink);
            $songLi.append($btnSongRemove);
            $wrapper.append($songLi);
            $($wrapper).appendTo($domElement);
        }
    }


    function loadPlaylists() {
        var _this = this;
        $('main > *').hide();
        _this._views.getPlaylistsContainer().html('');
        _this._views.getPlaylistsContainer().show();
        _this._data.playlists.readAllRows(function (playlists) {
            playlists.forEach(function (playlist) {
                playlist.number = playlist.songs.length;
            });

            _this._views.playlists(playlists);
        }, function () {
            console.log('Cannot load play lists.')
        });
    }


    function loadSongsOfPlaylist(e) {
        var _this = this;
        var playlistTitle = $(e.target).text();
        var songs = $(e.target).attr('data-songs').split(',');
        $('main > *').hide();
        _this._views.getCurrentPlaylistsContainer().html('');
        _this._views.getCurrentPlaylistsContainer().show();
        songs.forEach(function (song) {
            if ($('article #' + song).length) {
                var songHtml = $('article #' + song).parent().parent().parent().html();
                var $song = $('<article class="song">').html(songHtml);
                _this._views.getCurrentPlaylistsContainer().append($song);
            } else {
                var index = songs.indexOf(song);
                var playlistId = $(e.target).parent().parent().parent().find('.controls').attr('id');
                songs.splice(index, 1);
                _this._data.playlists.editRow(playlistId, {songs: songs}, function (data) {
                }, function (error) {
                    console.log(error);
                });
            }
        });
    }


    function addSongToPlaylist(songId, playlistId, playlistSongs) {
        _this = this;
        _this._data.playlists.editRow(playlistId, {songs: playlistSongs}, function (data) {
            var songHtml = $('article #' + songId).parent().parent().parent().html();
            var $song = $('<article class="song">').html(songHtml);
            _this._views.getCurrentPlaylistsContainer().append($song);
        }, function (error) {
            console.log(error);
        });
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
                    _this._views.songEditForm(song[0], function (songObj) {
                        _this._data.songs.editRow(songId, songObj, function () {
                            console.log('The song is edited.');
                            loadSongs.call(_this);
                        }, function (error) {
                            console.log('The song is not edited.');
                            console.log('Error: ' + error.error);
                        });
                    }, function () {
                        console.log('Click cancel button.')
                    });

                },
                function () {
                    console.log('Can not read songData.');
                });
        });

        _this._views.getSongsContainer().on('click', '.addToPlayerList', addSongToPlayer);

        _this._views.getSongsContainer().on('click', '.addSongToPlaylistButton', function (e) {
            var songId = $(e.target).parent().attr('id');
            sessionStorage.setItem('songId', songId);
            loadPlaylists.call(_this);
        });

        _this._views.getPlaylistsContainer().on('click', 'h1', function (e) {
            var songId = sessionStorage['songId'];
            var playlistSongs = $(e.target).attr('data-songs').split(',');
            var playlistId = $(e.target).parent().parent().parent().find('.controls').attr('id');
            if (songId) {
                playlistSongs.push(songId);
                addSongToPlaylist.call(_this, songId, playlistId, playlistSongs);
                delete sessionStorage['songId'];
            }
            loadSongsOfPlaylist.call(_this, e)
        })

        $('body').on('click', '#upload-button', function (e) {
            _this._views.songUploadForm(function (file, song) {
                _this._data.files.upload(file, function (data) {
                    var fileObj =
                    {
                        "__type": "File",
                        "name": data.name,
                        "url": data.url
                    };

                    var uploader =
                    {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": "jmq0dTOLUO"
                    };

                    var songObj =
                    {
                        "album": song.album,
                        "artist": song.artist,
                        "duration": "2:46",
                        "file": fileObj,
                        "genre": song.genre,
                        "name": song.name,
                        "plays": 0,
                        "rating": 0,
                        "uploader": uploader
                    };

                    _this._data.songs.addRow(songObj, function () {
                        loadSongs.call(_this);
                        console.log('The song is added.')
                    }, function (error) {
                        console.log('The song is not added.');
                        console.log('Error: ' + error.error);

                    });

                    _this._data.files.delete(data.name, file.type);
                    console.log('Success upload.')
                }), function () {
                    console.log('The song is not uploaded.');
                };
            });
        });

        $('body').on('click', '#playlists-button', function (e) {
            loadPlaylists.call(_this);
        });

        $('body').on('click', '#create-playlists-button', function (e) {
            _this._views.showPlaylistForm(function (e) {
                var $form = $(e.target).parent().parent().parent();
                var playlistName = $form.find('input').val();
                _this._data.playlists.addRow({name: playlistName, songs: []}, function () {
                    console.log('The playlist is added.');
                }, function () {
                    console.log('The playlist is not added.');
                });

                $form.remove();
            });
        });

        // Comments section appear after clicking the comments button
        _this._views.getSongsContainer().on('click', '.commentsButton', function (event) {
            var isClicked = $(event.target).attr('clicked');

            var $songSection = $(event.target).parent();

            if (isClicked === "false" || isClicked === undefined) {
                _this._views.addComment($songSection);
                $(event.target).attr('clicked', 'true');

            } else {
                $(event.target).attr('clicked', 'false');
                $songSection.find('.comments').remove()
            }

            _this._views.getSongsContainer().on('click', '#submit', function (e) {
                if ($(e.target).is("#submit")) {
                    var textComments = $('#text-comments').val();
                    if(textComments) {
                        console.log(textComments);
                    }
                    textComments = $('#text-comments').val('');
                    console.log("Here we were supposed to send the comments to the parse.com table :)")
                }
            });


        });

        //function loadComments(column, value) {
        //    var _this = this;
        //    _this._views.getSongsContainer().html('');
        //    function successCommentFunction(dataSongs) {
        //        _this._data.users.readAllRows(function (dataUploader) {
        //                var uploaders = [];
        //
        //                dataUploader.forEach(function (uploader) {
        //                    uploaders[uploader.objectId] = uploader;
        //                });
        //
        //                dataSongs.forEach(function (song) {
        //                    song.uploader = uploaders[song.uploader.objectId];
        //                    _this._views.song(song);
        //                });
        //            },
        //            function () {
        //                console.log('Can not read users');
        //            });
        //    }
        //
        //    function errorSongsFunction() {
        //        console.log('Can not read comments');
        //    }
        //
        //    if (column && value) {
        //        _this._data.songsComments.readAllRowsWhere(column, value, successSongFunction, errorSongsFunction);
        //    } else {
        //        _this._data.songsComments.readAllRows(successSongFunction, errorSongsFunction);
        //    }
        //}


        _this._views.getPlaylistsContainer().on('click', '.commentsButton', function (event) {
            var isClicked = $(event.target).attr('clicked');

            var $playlistSection = $(event.target).parent();

            if (isClicked === "false" || isClicked === undefined) {
                _this._views.addComment($playlistSection);
                $(event.target).attr('clicked', 'true');
            } else {
                $(event.target).attr('clicked', 'false');
                $playlistSection.find('.comments').remove()
            }

            _this._views.getPlaylistsContainer().on('click', '#submit', function (e) {
                if ($(e.target).is("#submit")) {
                    var textPlaylistComments = $('#text-comments').val();
                    if(textPlaylistComments) {
                        console.log(textPlaylistComments);
                    }
                    textPlaylistComments = $('#text-comments').val('');
                    console.log("Here we were supposed to send the comments to the parse.com table :)")
                }
            });

        })
    }

    return {
        get: function (data, views) {
            return new Controller(data, views);
        }
    }
})();