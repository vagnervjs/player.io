/*
  Author: Vagner Santana;
      vagnersantana.com
*/

//connect socket
PlayerIO.prototype.connect = function(id){

  this.socket = io.connect(location.origin);

  this.socket.emit('setId', {id: id});

  var playerContext = this;
  this.socket.on('control', function (data) { 
    console.log('Received control: ' + data.action);
    switch(data.action) {
      case 'play':
        playerContext.player.play();
        break;
      case 'playfile':
        playerContext.playFile(data);
        break;
      case 'pause':
        playerContext.player.pause();
        break;
      case 'fullscreen':
        playerContext.cssFullScreenToggle();
        break;
      case 'volup':
        playerContext.player.volume += 0.1;
        break;
      case 'voldown':
        playerContext.player.volume -= 0.1;
        break;
      case 'prev':
        var pl = $('.playlist-ul li');
        var lo
        $.each(pl, function(){
          if($(this).hasClass('nowplay')){
            if ($(this).prev() != undefined) {
              playerContext.playMedia($(this).prev());
            }
          }
        });
        break;
      case 'next':
        var pl = $('.playlist-ul li');
        $.each(pl, function(){
          if($(this).hasClass('nowplay')){
            if ($(this).next() != undefined) {
              playerContext.playMedia($(this).next());
            }
          }
        });
        break;
      case 'seek':
        var total = player.duration;
        var newTime =  (total * data.val) / 100;
        playerContext.player.currentTime = newTime;
        break;
      case 'change':
        $.each($('.playlist-ul li'), function(){
          if($(this).attr('data-fileid') == data.val){
            playerContext.playMedia($(this));
          }
        })
        break;
      case 'playlist':
        playerContext.updatePlaylist();
        break;
    }
  });
}


//Draw QR Code
PlayerIO.prototype.drawQR = function(id) {
  var qr = [
    '<a href="/mb/' + id + '" target="_blank">',
      '<img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=',
        location.origin +'/mb/'+ id,
      '&choe=UTF-8" alt="QR Code" />',
      '<p class="qr-link">mb/' + id + '</p>',
    '</a>'
  ].join('');
  $("#qr").html(qr);
}

//send new lists to the server
PlayerIO.prototype.updatePlaylist = function(){
  var pl = $('.playlist-ul li'),
    list = [];

  $.each(pl, function(){
    list.push({
      file: $(this).attr('data-fileid'), 
      fileName: $(this).attr('data-filename')
    });
  });

  if (list.length){
    var data = {
      id: this.id,
      playlist: list
    };
    this.socket.emit('setPlaylist', data);
  }
}