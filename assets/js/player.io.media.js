/*
  Author: Vagner Santana;
      vagnersantana.com
*/

//checks if video element can play the media
PlayerIO.prototype.checkFileType = function(file){
  if(!file.type) file.type = file.name.slice(file.name.lastIndexOf('.') + 1);
  var canPlay = this.player.canPlayType(file.type).replace(/(no)/i, '');
  if(canPlay) {
    var fileURL = URL.createObjectURL(file);
    this.addToPlayList(fileURL, file.name);
  } else {
    this.displayMessage('Type', file.type);
  }
}

//create list item and send new list
PlayerIO.prototype.addToPlayList = function(url, name){  
  $('#no_file').remove();
  this.displayMessage('Clear');
  if(!name) name = url.slice(url.lastIndexOf('/') + 1);
  var li = $('<li data-file="' + url + '" data-fileid="' + this.randomId() + '" data-filename="' + name + '" class="playlist-li">' + name + '</li>')
  var playerContext = this;
  li.click( function(){
    playerContext.playMedia($(this));
  });

  $('.playlist-ul').append(li);
  this.updatePlaylist();
}

//
PlayerIO.prototype.playMedia = function(obj){
  var playerContext = this;
  
  this.player.remove();
  var p = $('<video>');

  p.attr({
    src: obj.attr('data-file'),
    autobuffer: 'autobuffer',
    autoplay: 'autoplay',
    controls: 'controls',
    id: 'player'
  });
  $('.content').append(p);
  this.player = p.get(0);
  this.player.play();

  $('.playlist-ul li').removeClass('nowplay');
  obj.addClass('nowplay');

  this.displayMessage('Clear');

  //RESET
  $('#audio_only').hide();
  if(HTML5AudioSpectre.timer) clearTimeout(HTML5AudioSpectre.timer)

  this.player.addEventListener('canplay', function(){
    playerContext.checkAudioOnly()
  });
  //TODO use event instead of timeout (loadedmetadata, loadeddata, canplay, loadstart, progress -- none work)
  setTimeout(this.checkVideoDuration, 5000, this)
}

PlayerIO.prototype.checkVideoDuration = function(playerContext){
  var d = $('#player').get(0).duration;
  if(d <= 0 || isNaN(d)) {
    playerContext.displayMessage('Duration');
  }
}

PlayerIO.prototype.checkAudioOnly = function(){
  var w = $('#player').get(0).videoWidth;
  var h = $('#player').get(0).videoHeight;
  if(!w && !h) HTML5AudioSpectre();
}

$(document).ready(function() {
  window.playerIO = new PlayerIO();
});






