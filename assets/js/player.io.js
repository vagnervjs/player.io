/*
  Author: Vagner Santana;
      vagnersantana.com
*/

PlayerIO = function(){

  this.player = $('#player').get(0);
  this.id = this.randomId();

  //enable local files
  var URL = window.URL || window.webkitURL;
  if(!URL){
    $('#open').attr('disabled')
  } else { 
    $('#open').click( function(){ 
      $('#fileinp').click();
    });
  };
  
  //get local files   
  var playerContext= this;                       
  $('#fileinp').change( function(){ 
    var arrFile = this.files[0];
    var size = (this.files.length);
    for (var i = 0; i < size; i++) {
      var file = this.files[i];
      playerContext.checkFileType(file);
    };
    $('#fileinp').val(null);
  });

  //add input url
  $('#add').click( function(){
    var url = $("#mediaurl").val();
    var validateURL = '';
    //TODO validateURL
    if(!url) {
      playerContext.displayMessage('URL');
    } else {
      $('#no_file').hide();
      playerContext.addToPlayList(url);
      $('#mediaurl').val(null);
    }
  });

  //clear input on click
  $('#mediaurl').click( function(){ this.value = '' } );

  //screen ratio
  $('#screenratio').change( function(event){ 
    playerContext.changeRatio(event.target.value)
  });

  //fullscreen
  $('#fullscreen').click( function(event){ 
    playerContext.fullScreenToggle(event); 
  });
  $(document).keydown( function(event) {
    if(event.which == 122){ //F11
      playerContext.fullScreenToggle(event);
    }
  });

  //language
  $('#language').attr('href', 'http://translate.google.com/translate?u=' + escape(location.origin) );

  //connect sockets
  this.connect(this.id);

  //draw QR code
  this.drawQR(this.id);

}

// Helper Functions

PlayerIO.prototype.displayMessage = function(type, message) {
  var messages = {
    'Clear': '',
    'Browser': '<a href="http://caniuse.com/bloburls">Your browser is not supported</a>!',
    'URL': 'Insert a valid media URL',
    'Type': 'Unable to play file type: ',
    'Duration': 'Unable to play this file.'
  }
  $('#message').html(messages[type] + (message || ''));
};

PlayerIO.prototype.randomId = function() {
  var newId = "";
  var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ )
    newId += abc.charAt(Math.floor(Math.random() * abc.length));

  return newId;
}

//Screen
//TODO auto resize
PlayerIO.prototype.changeRatio = function(ratio){ 
  var w = $('#player').width();
  switch(ratio){
    case 'auto':
      $('#player').width('100%');
      $('#player').height('auto');
      break;
    case 'standard':
      $('#player').width(w + 'px');
      $('#player').height((0.75 * w) + 'px');
      break;
    case 'widescreen':
      $('#player').width(w + 'px');
      $('#player').height((0.5625 * w) + 'px');
      break;
  }
}

PlayerIO.prototype.checkFullScreenSupport = function(){ 
  this.browserPrefix = '';
  if(document.cancelFullScreen) return true;
  var browserPrefixes = ['webkit', 'moz', 'o', 'ms', 'khtml'];
  for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
    this.browserPrefix = browserPrefixes[i];
    if (document[browserPrefixes[i] + 'CancelFullScreen']) {
      return true;
    }    
  }
  return false;
}

PlayerIO.prototype.fullScreenToggle = function(event){
  event.preventDefault();
  if(this.checkFullScreenSupport()){
    this.html5FullScreenToggle();
  } else {
    this.cssFullScreenToggle();
  }
}

PlayerIO.prototype.html5FullScreenToggle = function(){ 
  if(!this.fullScreen){
    this.fullScreen = true;
    (this.browserPrefix == '') ? this.player.requestFullScreen() : this.player[this.browserPrefix + 'RequestFullScreen']();
  } else {
    this.fullScreen = false;
    (this.browserPrefix == '') ? document.cancelFullScreen() : document[this.browserPrefix + 'CancelFullScreen']();
  }
}

PlayerIO.prototype.cssFullScreenToggle = function(){ 
  if (!this.fullScreen) {
    this.fullScreen = true;
    $('video').addClass('fullScreen');
  } else {
    this.fullScreen = false;
    $('video').removeClass('fullScreen');
  }
};