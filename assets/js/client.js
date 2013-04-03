/*
    Author: Vagner Santana;
            vagnersantana.com
*/

var socket = io.connect(location.origin);

var media = $("#player").get(0);
var pl = $('.playlist-ul li');

var id = randomId();
socket.emit('setId', id);

socket.on('control', function (data) { 
    switch(data.action) {
        case 'play':
            media.play();
            break;
        case 'playfile':
            playerIO.playFile(data);
            break;
        case 'pause':
            media.pause();
            break;
        case 'fullscreen':
            fullScreenToggle();
            break;
        case 'volup':
            media.volume += 0.1;
            break;
        case 'voldown':
            media.volume -= 0.1;
            break;
        case 'prev':
            var filePrev;
            $.each(pl, function(){
                if($(this).hasClass('nowplay')){
                    if ($(this).prev() != undefined) {
                        filePrev = $(this).prev().attr('data-fileid');
                    }
                }
            });
            getMedia(filePrev);
            break;
        case 'next':
            var fileNext;
            $.each(pl, function(){
                if($(this).hasClass('nowplay')){
                    if ($(this).next() != undefined) {
                        fileNext = $(this).next().attr('data-fileid');
                    }
                }
            });
            getMedia(fileNext);
            break;
        case 'seek':
            var total = media.duration;
            var newTime =  (total * data.val) / 100;
            media.currentTime = newTime;
            break;
        case 'change':
            playerIO.getMedia(data.val);
            break;
        case 'playlist':
            updatePlaylist();
            break;
    }
});

//Draw QR Code
$("#qr").html('<a href="/mb/' + id + '" target="_blank"><img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=http://localhost:8000/mb/' + id + '&choe=UTF-8" alt="QR Code" /><p>mb/' + id + '</p></a>');

function updatePlaylist(){
    var pl = $('.playlist-ul li'),
        list = [],
        fl, fn;

    $.each(pl, function(){
        fl = $(this).attr('data-fileid');
        fn = $(this).attr('data-filename');
        list.push({file: fl, fileName: fn});
    });

    if (list.length){
        sendPlaylist(list);
    }
}

function sendPlaylist(list){
    var data = [];
    data = {
        id: id,
        playlist: list
    };
    socket.emit('setPlaylist', data);
}

// Helper Functions
function randomId() {
    var newId = "";
    var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        newId += abc.charAt(Math.floor(Math.random() * abc.length));

    return newId;
}