/*
  Author: Vagner Santana;
      vagnersantana.com
*/

$(document).ready( function() {
  // Socket.io
  var socket = io.connect(location.origin);
  var id = $('body').attr('id');

  socket.emit('setMobId', {id: id});

  socket.on('newPlaylist', function (data) { 
    if(!data.playlist) return;
    var list = [];
    $("#no").remove();
    for(var i=0, t= data.playlist.length; i<t; i++){
      list.push('<li><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-fileid="' + data.playlist[i].file + '">'+ data.playlist[i].fileName + '</a></li>');
    }
    $('#playlist').html(list.join(''));
  });

  //Events

  // Play / Pause
  $('#play').tap(function() {
    if(!$(this).hasClass('playing')){
      $(this).addClass('playing');
      $(this).html('<img src="/assets/img/icons/pause.svg", alt="Icon">');
      socket.emit('control', {id: id, action: 'play'});
    } else {
      $(this).removeClass('playing');
      $(this).html('<img src="/assets/img/icons/play.svg", alt="Icon">');
      socket.emit('control', {id: id, action: 'pause'});
    }
  });

  // Volume Up
  $('#vol_up').tap(function() {
    socket.emit('control', {id: id, action: 'volup'});
  });

  // Volume Down
  $('#vol_down').tap(function() {
    socket.emit('control', {id: id, action: 'voldown'});
  });

  // Full Screen Toggle
  $('#fullscreen').tap(function() {
    socket.emit('control', {id: id, action: 'fullscreen'});
  });

  // Previous Track
  $('#prev').tap(function() {
    socket.emit('control', {id: id, action: 'prev'});

    $('#play').addClass('playing');
    $('#play').html('<img src="/assets/img/icons/pause.svg", alt="Icon">');
  });

  // Next Track
  $('#next').tap(function() {
    socket.emit('control', {id: id, action: 'next'});

    $('#play').addClass('playing');
    $('#play').html('<img src="/assets/img/icons/pause.svg", alt="Icon">');
  });

  // Change Time
  $("#time").on("change", function(){
    var value = $("#time").val();
    socket.emit('control', {id: id, action: 'seek', val: value});
  });

  // Select Track to play
  $('.playlist-mb').on("tap", "a", function(){
    var value = $(this).attr('data-fileid');
    if(value != "no"){
      $('.playlist-mb a').removeClass('nowplay');
      $(this).addClass("nowplay");

      $('#play').addClass('playing');
      $('#play').html('<img src="/assets/img/icons/pause.svg", alt="Icon">');

      socket.emit('control', {id: id, action: 'change', val: value});
    }
  });
});