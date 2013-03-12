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
                    $('.playlist-ul').append('<li><a href=# data-file="' + fileURL + '" data-type="' + type + '" data-fileid="' + randomId() + '" data-filename="' + file.name + '">' + file.name + '</a></li>');
                    getPlaylist();
                }
            };
            $('#fileinp').val('');
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
        $('.playlist-ul').append('<li><a href=# data-file="' + url + '" data-fileid="' + randomId() + '" data-filename="' + url + '">' + url + '</a></li>');

        getPlaylist();
    } else alert("Insert a URL for a file");
});

$('.playlist-ul').on("click", 'a', function(){
    playMedia($(this));
});

function getPlaylist(){
    var pl = $('.playlist-ul a'),
        json = [],
        fl;

    $.each(pl, function(){
        fl = $(this).attr('data-fileid');
        filename = $(this).attr('data-filename');
        json.push({file: fl, fileName: filename});
    });

    if (json.length){
        sendPlaylist(json);
    }
}

function getMedia(id){
    var pl = $('.playlist-ul a');

    $.each(pl, function(){
        if($(this).attr('data-fileid') == id){
            playMedia($(this));
        }
    })
}

function playMedia(obj){
    $('.playlist-ul a').removeClass('nowplay');

    if (obj.attr('type') != undefined) {
        $("#player").html('<source src="' + obj.attr('data-file') + '" type="' + obj.attr('type') + '">');
    } else{
        $("#player").html('<source src="' + obj.attr('data-file') + '">');
    }
    obj.addClass("nowplay");
}