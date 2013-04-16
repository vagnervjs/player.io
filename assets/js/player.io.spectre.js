var HTML5AudioSpectre = function(){
  var audio = $('#player').get(0), count, data, offset, spectre;

  //RESET  
  $('#spectre').remove();

  var ph = $('#player').height(),
      ih = ph - 60,
      pw = $('#player').width();

  var loop = function(){
    //UPDATE AUDIO DATA
    audio.analyser.getByteFrequencyData(audio.frequencyData);

    for (var i = 0; i < count; ++i) {
      var h = (audio.frequencyData[i * (offset - 10)] / 256); // % height
      spectre.children[i].style.height = h * ih + 'px';
    }

    HTML5AudioSpectre.timer = setTimeout(loop, 30);
  };

  var setupContext = function(){
    //CREATE CONTEXT ANALYSER AND SOURCE
    audio.context = new webkitAudioContext();
    audio.analyser = audio.context.createAnalyser();
    audio.mediaSource = audio.context.createMediaElementSource(audio);

    //CONNECT SOURCE > ANALISER > DESTINATION
    audio.mediaSource.connect(audio.analyser);
    audio.analyser.connect(audio.context.destination);

    //CREATE AUDIO DATA ARRAY
    audio.frequencyData = new Uint8Array(audio.analyser.frequencyBinCount);
  };

  var setupSpectre = function(){
    //CREATE SPECTRE CONTAINER
    spectre = document.createElement('div');
    spectre.style.width = pw + 'px';
    spectre.style.height = ph + 'px';
    spectre.id = 'spectre';

    $('#audio_only').show();
    $('#audio_only').append(spectre);

    //CALC NUM OF BARS AND OFFSET
    var padd = 6,
      gap = 4,
      w = 10,
      widthBar = w + gap,
      widthInner = (audio.offsetWidth - (2 * padd));

    count = parseInt(widthInner / widthBar);
    offset = parseInt(audio.analyser.frequencyBinCount / count);

    //CREATE BARS
    for (var i = 0; i < count; ++i) {
      var bar = document.createElement('div');
      bar.style.left = (padd + gap/2 + ((w + gap) * i)) + 'px';
      bar.style['background-size'] = '10px ' + ih  +'px';
      bar.className = 'bar';
      spectre.appendChild(bar);
    }
  };

  setupContext();
  setupSpectre();

  loop();
};