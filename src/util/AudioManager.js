type AudioMap = {
  [key:string]: any
}

class AudioManager {
  ctx: any;
  audioMap: AudioMap;
  muted: boolean;

  constructor() {
    this.ctx = new AudioContext();

    this.volumeNode = this.ctx.createGain();
    this.volumeNode.connect(this.ctx.destination);

    this.volumeNode.gain.value = 0.2;

    this.muted = false;
  }

  setAudioMap(audioMap: AudioMap) {
    this.audioMap = audioMap;
  }

  play(name: string) {
    var sound = this.audioMap[name];

    var src = this.ctx.createBufferSource();
    src.connect(this.volumeNode);
    src.buffer = sound;
    src.start(0);
  }

  toggleMute() {
    if (this.muted) {
      this.volumeNode.gain.value = 0.2;
    } else {
      this.volumeNode.gain.value = 0;
    }

    this.muted = !this.muted;
  }
}

module.exports = AudioManager;
