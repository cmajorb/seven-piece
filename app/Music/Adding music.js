function createAudio(src, options) {
  var audio = document.createElement('audio');
  audio.volume = options.volume || 0.5;
  audio.loop   = options.loop;
  audio.src    = src;
  return audio;
}
var zap = createAudio('Music/Loading Screen.mp3');