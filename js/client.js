function randomId() {
    var newId = "";
    var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        newId += abc.charAt(Math.floor(Math.random() * abc.length));

    return newId;
}

var id = randomId();
var socket = io.connect('http://localhost:8080');
var media = document.getElementById("player");

socket.emit('setId', id);
socket.on('play', function (data) {
    console.log(data);
    
    if (data.action == 'play') {
        media.play();
    } else if (data.action == 'pause'){
        media.pause();
    } else if (data.action == 'fullscreen'){
        media.webkitRequestFullScreen();
    }
});

$("#qr").html('<a href="http://localhost:8000/mb/' + id + '" target="_blank"><img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=http://localhost:8000/mb/' + id + '&choe=UTF-8" alt="QR Code" /></a>');