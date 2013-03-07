(function localFileVideoPlayerInit(win) {
    var URL = win.URL || win.webkitURL,
        displayMessage = (function displayMessageInit() {
            var node = document.querySelector('#message');

            return function displayMessage(message, isError) {
                node.innerHTML = message;
                node.className = isError ? 'error' : 'info';
            };
        }()),
        playSelectedFile = function playSelectedFileInit(event) {
            var file = this.files[0];
            var type = file.type;
            var videoNode = document.querySelector('video');
            var canPlay = videoNode.canPlayType(type);
                canPlay = (canPlay === '' ? 'no' : canPlay);
            var isError = canPlay === 'no';
            var message = '';

            if (canPlay == 'no') {
                message = 'Unable to play file type: "' + type + '"';
                displayMessage(message, isError);
            } else {
                message = "";
                displayMessage(message);
            }
            if (isError) {
                return;
            } else{
                //var fileURL = URL.createObjectURL(file);
                var fileURL = URL.createObjectURL(file);
                playMedia(fileURL, type);

            }
        },
        inputNode = document.querySelector('input');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    if (!URL) {
        displayMessage('Your browser is not ' + 
           '<a href="http://caniuse.com/bloburls">supported</a>!', true);
        
        return;
    }                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    inputNode.addEventListener('change', playSelectedFile, false);
}(window));

function playMedia(url, type){
    fv.load([
    {
      src:  url,
      type: type
    }
    ]);
}

jQuery(document).ready(function($) {
    fv = $("#player").flareVideo();
});