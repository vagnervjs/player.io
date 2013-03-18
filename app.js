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

app.get('/mb/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    res.render('mobile.jade', {id:id, title:'Player.IO | Control'});

    setTimeout(function(){
        sockets[id].emit('play', {action:'playlist'});
    }, 5000)
});

app.get('/player/:id/:action/:val?', function (req, res) {
    var id = req.params.id;
    var action = req.params.action;
    var val = req.params.val;
    sockets[id].emit('play', {action:action, val:val});
    res.send('ok');
});

var socket = require('socket.io');

var io = socket.listen(server);

var sockets = {};

io.sockets.on('connection', function (socket) {
    socket.on('setId', function (id) {
        console.log("THE ID: " + id);
        sockets[id] = socket;
    });

    socket.on('setPlaylist', function (data) {
        if(sockets[data[0].id] != undefined){
            sockets[data[0].id].emit('newPlaylist', {pl:data[1].pl});
        }
    });
});

server.listen(8080);