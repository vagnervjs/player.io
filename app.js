/*
  Author: Vagner Santana;
      vagnersantana.com
*/

//load requirements
var express = require("express");
var app = express();
var server = require('http').createServer(app);

//set options
app.set('view engine', 'jade');
app.set('view options', { layout:false });
app.use(express.static(__dirname));

//default view
app.get('/', function (req, res) {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' https://chart.googleapis.com; " +
    "connect-src 'self' ws://localhost:8080/; "+
    "script-src 'self' http://www.google-analytics.com; "+
    "image-src 'self' https://chart.googleapis.com; "+
    "style-src 'self' http://fonts.googleapis.com; "+
    "font-src 'self' http://themes.googleusercontent.com ");
  res.render('index.jade', {title:'Player.IO'});
});

//mobile view
app.get('/mb/:id', function (req, res) {
  var id = req.params.id;
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; "+
    "connect-src 'self' ws://localhost:8080/ ");
  res.render('mobile.jade', {id: id, title:'Player.IO | Control'});
});

//load sockets
var socket = require('socket.io');
var io = socket.listen(server);
var players = {};

io.sockets.on('connection', function (socket) {

  //PLAYER
  socket.on('setId', function (data) {
    var id = data.id;
    console.log("ID: " + id);
    players[id] = {};
    players[id].player = socket;
  });  

  //TODO save playlists and users in database
  socket.on('setPlaylist', function (data) {
    var id = data.id;
    if(players[id]){
      players[id].playlist = data.playlist;
      socket.emit('newPlaylist', {id: id, playlist: players[id].playlist});
    } else {
      console.log('Error: No player ID found: ' + id);
    }
  });

  //MOBILE 
  socket.on('setMobId', function (data) {
    var id = data.id;
    console.log("MOB: " + id);
    players[id].mobile = socket;
    socket.emit('newPlaylist', {id: id, playlist: players[id].playlist});
  });

  //controls
  socket.on('control', function (data) {
    var id = data.id;
    players[id].player.emit('control', data);
  }); 

});

server.listen(8080);