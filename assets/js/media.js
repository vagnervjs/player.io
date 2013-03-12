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
            var arrFile = this.files[0];
            var size = (this.files.length);

            for (var i = 0; i < size; i++) {
                var file = this.files[i];
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
                } else {
                    var fileURL = URL.createObjectURL(file);
                    $('.no').remove();
                    $('.playlist-ul').append('<li><a href=# data-file="' + fileURL + '" data-type="' + type + '">' + file.name + '</a></li>');
                    getPlaylist();
                }
            };
        },
        inputNode = document.querySelector('input');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    if (!URL) {
        displayMessage('Your browser is not ' + 
           '<a href="http://caniuse.com/bloburls">supported</a>!', true);
        
        return;
    }                
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    inputNode.addEventListener('change', playSelectedFile, false);
}(window));

$("#add").on("click", function(){
    var url = $("#mediaurl").val();
    $("#mediaurl").val(null);

    if (url != '') {
        $('.no').remove();
        $('.playlist-ul').append('<li><a href=# data-file="' + url + '">' + url + '</a></li>');

        getPlaylist();
    } else alert("Insert a URL for a file");
});

$('.playlist-ul').on("click", 'a', function(){
    var file = $(this).attr("data-file");
    var type = $(this).attr("data-type");
    
    $('.playlist-ul a').removeClass('nowplay');
    
    if (type != undefined) {
        playMedia(file, type);
    } else{
        playMedia(file, '');
    }

    $(this).addClass('nowplay');
});

function getPlaylist(){
    var pl = $('.playlist-ul a'),
        json = [],
        fl;

    $.each(pl, function(){
        fl = $(this).attr('data-file');
        json.push({file: fl});
    });

    sendPlaylist(json);
}

function playMedia(url, type){
    $("#player").html('<source src="' + url + '" type="' + type + '">');
}

$('#gofull').on("click", function(){
    var media = document.getElementById("player");
    media.webkitRequestFullScreen();
    console.log(media);
});