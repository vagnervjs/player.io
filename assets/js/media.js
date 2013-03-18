(function localFileVideoPlayerInit(win) {
    var URL = win.URL || win.webkitURL,
        manipulateFile = function manipulateFileInit(event) {
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
                    if(!type) type = file.name.slice(file.name.lastIndexOf('.') + 1);
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
                    addToPlayList(fileURL, file.name)
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    inputNode.addEventListener('change', manipulateFile, false);
}(window));

$("#add").on("click", function(){
    var url = $("#mediaurl").val();
    $("#mediaurl").val(null);

    if (url != '') {
        $('.no').remove();
        addToPlayList(url)
        getPlaylist();
    } else alert("Insert a URL for a file");
});

$('.playlist-ul').on("click", 'li', function(){
    playMedia($(this));
});

function addToPlayList(url, name){
    if(!name) var name = url.slice(url.lastIndexOf('/') + 1);
    var type = url.type ? 'data-type="' + url.type + '" ' : '';
    $('.playlist-ul').append('<li data-file="' + url + '" data-fileid="' + randomId() + '" data-filename="' + name + '" class="playlist-li" '+ type +'>' + name + '</li>');
}

function displayMessage(message, isError) {
    $("#message").html(message);
    $("#message").get(0).className = isError ? 'error' : 'info';
};

function getPlaylist(){
    var pl = $('.playlist-ul li'),
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
    var pl = $('.playlist-ul li');

    $.each(pl, function(){
        if($(this).attr('data-fileid') == id){
            playMedia($(this));
        }
    })
}

function playMedia(obj){
    $('.playlist-ul li').removeClass('nowplay');

    $("#player").attr({'src': obj.attr('data-file')});
    
    $("#player").get(0).play();
    
    obj.addClass("nowplay");
    displayMessage("");
    
    setTimeout(checkVideoDuration, 100)
}

function checkVideoDuration(){
    var d = $("#player").get(0).duration;
    if(d <= 0 || isNaN(d)) {
        message = 'Unable to play this file.'
        displayMessage(message, 'error');
    }
}

function fullScreenToggle(){
    var docWidth = $(window).width(),
        docHeight = $(window).height();
    
    if (! $('video').hasClass('fullScreen')) {
        $('video').addClass('fullScreen');
        $('video').css({
           width :  docWidth,
           height : docHeight
        });
    } else {
        $('video').removeClass('fullScreen');
        $('video').css({
           width :  '800px',
           height : '480px'
        });
    }
}