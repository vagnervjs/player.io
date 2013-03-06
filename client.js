function randomId() {
    var newId = "";
    var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        newId += abc.charAt(Math.floor(Math.random() * abc.length));

    return newId;
}

var id = randomId();

var socket = io.connect('http://localhost:8080');
var v = document.getElementById("player");

socket.emit('setId', id);
socket.on('play', function (data) {
    console.log(data);
    
    if (data.action == 'play') {
        v.play();
    } else if (data.action == 'pause'){
        v.pause();
    }
});


document.write('<br/><br/> <a href="http://localhost:8000/mb/' + id + '" target="_blank"><img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=http://localhost:8000/mb/' + id + '&choe=UTF-8" alt="QR Code" /></a>');