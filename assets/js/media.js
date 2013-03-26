LocalFileVideoPlayer = function(m){
    var localContext = this;
    this.messages = m;

    var URL = window.URL || window.webkitURL;
    if (!URL) {
        displayMessage(messages['Browser'], 'error');
        return;
    }  

    $("#open").click( function(){ 
        $("#fileinp").click();
    });
                                                      
    $("#fileinp").get(0).addEventListener('change', function(){ 
        var arrFile = this.files[0];
        var size = (this.files.length);
        for (var i = 0; i < size; i++) {
            var file = this.files[i];
            localContext.checkFileType(file);
        };
        $("#fileinp").val(null);
    }, false);

    $("#add").click( function(){
        var url = $("#mediaurl").val();
        //TODO validate URL 
        if(!url) {
            localContext.displayMessage(messages['URL'], 'error');
        } else {
            $('#no_file').hide();
            localContext.addToPlayList(url)
            localContext.getPlaylist();
            $("#mediaurl").val(null);
        }
    });
}

LocalFileVideoPlayer.prototype.addToPlayList = function(url, name){ 
    var localContext = this;
    if(!name) var name = url.slice(url.lastIndexOf('/') + 1);
    var type = url.type ? 'data-type="' + url.type + '" ' : '';
    var li = $('<li data-file="' + url + '" data-fileid="' + randomId() + '" data-filename="' + name + '" class="playlist-li" '+ type +'>' + name + '</li>')
    li.get(0).addEventListener('click', function(){
        localContext.playMedia($(this));
    });

    $('.playlist-ul').append(li);
}

LocalFileVideoPlayer.prototype.displayMessage = function(message, isError) {
    $("#message").html(message);
    $("#message").get(0).className = isError ? 'error' : 'info';
};

LocalFileVideoPlayer.prototype.getPlaylist = function(){
    var pl = $('.playlist-ul li'),
        json = [],
        fl;

    $.each(pl, function(){
        fl = $(this).attr('data-fileid');
        filename = $(this).attr('data-filename');
        json.push({file: fl, fileName: filename});
    });

    if (json.length){
        this.sendPlaylist(json);
    }
}


LocalFileVideoPlayer.prototype.sendPlaylist = function(list){
    console.log('TODO: Send this by socket to the server', list);
}

LocalFileVideoPlayer.prototype.getMedia = function(id){
    var pl = $('.playlist-ul li');

    $.each(pl, function(){
        if($(this).attr('data-fileid') == id){
            localContext.playMedia($(this));
        }
    })
}

LocalFileVideoPlayer.prototype.playMedia = function(obj){
    var localContext = this;
    $('#audio_only').hide();

    $('.playlist-ul li').removeClass('nowplay');

    $("#player").attr({'src': obj.attr('data-file')});

    $("#player").get(0).play();
    
    obj.addClass("nowplay");

    this.displayMessage('');

    var audio = $("#player").get(0)
    //RESET
    if(HTML5AudioSpectre.timer) clearTimeout(HTML5AudioSpectre.timer)
    if(audio.mediaSource) audio.mediaSource.disconnect()
    if(audio.analyser) audio.analyser.disconnect()

    audio.addEventListener('canplay', function(){
        localContext.checkAudioOnly()
    });
    //this.checkVideoDuration(this)
    //TODO use event instead of timeout (loadedmetadata, loadeddata, canplay, loadstart, progress -- none work)
    setTimeout(this.checkVideoDuration, 1000, this)
}

LocalFileVideoPlayer.prototype.checkFileType = function(file){
    if(!file.type) file.type = file.name.slice(file.name.lastIndexOf('.') + 1);
    var video = $('#player')[0];
    var canPlay = video.canPlayType(file.type);
        canPlay = canPlay.replace(/(no)/i, '')

    if (canPlay) {
        this.displayMessage('');
        var fileURL = URL.createObjectURL(file);
        $('#no_file').remove();
        this.addToPlayList(fileURL, file.name)
        this.getPlaylist();

    } else {
        this.displayMessage(this.messages['Type'] + file.type , 'error');
    }
}

LocalFileVideoPlayer.prototype.checkVideoDuration = function(_this){
    var d = $("#player").get(0).duration;
    if(d <= 0 || isNaN(d)) {
        _this.displayMessage(_this.messages['Duration'], 'error');
    } else {
        _this.displayMessage('');
    }
}

LocalFileVideoPlayer.prototype.checkAudioOnly = function(_this){
    var w = $("#player").get(0).videoWidth;
    var h = $("#player").get(0).videoHeight;
    if(!w && !h) HTML5AudioSpectre();
}

LocalFileVideoPlayer.prototype.fullScreenToggle = function(){
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
};

var HTML5AudioSpectre = function(){
    var audio = $('#player').get(0), count, data, offset, spectre;

    //RESET  
    $('#spectre').remove()   

    var loop = function(){
        //UPDATE AUDIO DATA
        audio.analyser.getByteFrequencyData(audio.frequencyData) 

        for (var i = 0; i < count; ++i) {
            var h = (audio.frequencyData[i * offset] / 256)
            spectre.children[i].style.height = h * 428 + 'px'
        }

        HTML5AudioSpectre.timer = setTimeout(loop, 30)
    }

    var setupContext = function(){
        if(!audio.context) {
            //CREATE CONTEXT ANALYSER AND SOURCE
            audio.context = new webkitAudioContext()
            audio.analyser = audio.context.createAnalyser()
            audio.mediaSource = audio.context.createMediaElementSource(audio)
            //CONNECT SOURCE > ANALISER > DESTINATION
            audio.mediaSource.connect(audio.analyser)
            audio.analyser.connect(audio.context.destination)
        }
        //CREATE AUDIO DATA ARRAY
        audio.frequencyData = new Uint8Array(audio.analyser.frequencyBinCount)
    } 

    var setupSpectre = function(){
        //CREATE SPECTRE CONTAINER
        spectre = document.createElement('div')
        spectre.style.width = audio.offsetWidth + 'px'
        spectre.id = 'spectre'

        $('#audio_only').show()
        $('#audio_only').append(spectre)

        //CALC NUM OF BARS AND OFFSET
        var padd = 6,
            gap = 4,
            w = 10,
            widthBar = w + gap,
            widthInner = (audio.offsetWidth - (2 * padd))

        count = parseInt(widthInner / widthBar) 
        offset = parseInt(audio.analyser.frequencyBinCount / count)

        //CREATE BARS
        for (var i = 0; i < count; ++i) {
            var bar = document.createElement('div')
            bar.style.left = (padd + gap/2 + ((w + gap) * i)) + 'px'
            bar.className = 'bar'
            spectre.appendChild(bar)
        }
    }

    setupContext();
    setupSpectre();

    loop()

}



var messages = {
    'Browser': 'Your browser is not <a href="http://caniuse.com/bloburls">supported</a>!',
    'URL': 'Insert a valid media URL',
    'Type': 'Unable to play file type: ',
    'Duration': 'Unable to play this file.'
}

var playerIO = new LocalFileVideoPlayer(messages)






