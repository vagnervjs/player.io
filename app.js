/*
    Author: Vagner Santana;
            vagnersantana.com
*/

var express = require("express");

var app = express();

var server = require('http').createServer(app);

app.set('view engine', 'jade');

app.set('view options', {
    layout:false
});

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.render('index.jade', {title:'Player.IO'});
});

app.get('/mb/:id', function (req, res) {
    var id = req.params.id;
    res.render('mobile.jade', {id: id, title:'Player.IO | Control'});
});

var socket = require('socket.io');

var io = socket.listen(server);

var players = {};

io.sockets.on('connection', function (socket) {

    //PLAYER
    socket.on('setId', function (id) {
        console.log("ID: " + id);
        players[id] = {};
        players[id].player = socket;
    });    

    socket.on('setPlaylist', function (data) {
        var id = data.id;
        if(players[id]){
            players[id].playlist = data.playlist;
        } else {
            console.log('Error: No player found');
        }
    });

    socket.on('updatePlaylist', function (data) {
        var id = data.id;
        if(players[id]){
            players[id].mobile.emit('newPlaylist', {playlist: players[id].playlist});
        }
    });

    //MOBILE 
    socket.on('setMobId', function (id) {
        console.log("MOB: " + id);
        players[id].mobile = socket;
        socket.emit('newPlaylist', {playlist: players[id].playlist});
    });

    socket.on('control', function (data) {
        var id = data.id;
        players[id].player.emit('control', data);
    });    

});

server.listen(8080);