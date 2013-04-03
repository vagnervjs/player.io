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