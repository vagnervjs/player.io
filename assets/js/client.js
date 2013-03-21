/*
    Author: Vagner Santana;
            vagnersantana.com
*/

var id = randomId();
var socket = io.connect('http://vagnersantana.com:8080');
var media = document.getElementById('player');

socket.emit('setId', id);
socket.on('play', function (data) {
    'use strict';
    var pl = $('.playlist-ul li');
    console.log(data);

    if (data.action === 'play') {
        media.play();
    } else if (data.action === 'pause'){
        media.pause();
    } else if (data.action === 'fullscreen'){
        fullScreenToggle();
    } else if (data.action === 'volup'){
        media.volume+=0.1;
    } else if (data.action === 'voldown'){
        media.volume-=0.1;
    } else if (data.action === 'prev'){
        var filePrev;
        $.each(pl, function(){
            if($(this).hasClass('nowplay')){
                if ($(this).prev() !== undefined) {
                    filePrev = $(this).prev().attr('data-fileid');
                }
            }
        });
        getMedia(filePrev);
    } else if (data.action === 'next'){
        var fileNext;
        $.each(pl, function(){
            if($(this).hasClass('nowplay')){
                if ($(this).next() !== undefined) {
                    fileNext = $(this).next().attr('data-fileid');
                }
            }
        });
        getMedia(fileNext);
    } else if (data.action === 'seek'){
        var total = media.duration;
        var newTime =  (total * data.val) / 100;
        media.currentTime = newTime;
    } else if (data.action === 'change'){
        getMedia(data.val);
    } else if (data.action === 'playlist'){
        getPlaylist();
    }
});

function sendPlaylist(playlist){
    'use strict';
    var data = [];
    data.push({id: id + 'mb'});
    data.push({pl: playlist});
    socket.emit('setPlaylist', data);
}

$("#qr").html('<a href="http://vagnersantana.com:8080/mb/' + id + '" target="_blank"><img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=http://vagnersantana.com:8080/mb/' + id + '&choe=UTF-8" alt="QR Code" /></a>');

// Helper Functions
function randomId() {
    'use strict';
    var newId = '';
    var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for( var i=0; i < 5; i++ )
        newId += abc.charAt(Math.floor(Math.random() * abc.length));

    return newId;
}