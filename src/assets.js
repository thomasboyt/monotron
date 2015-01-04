// This file is purposely not type-checked!
// Flow does not like Webpack's non-module requires

module.exports = {
  images: null,
  audio: {
    'enemy_explosion': require('../assets/sound/enemy_explosion.wav'),
    'player_explosion': require('../assets/sound/player_explosion.wav'),
    'shoot': require('../assets/sound/shoot.wav'),
    'powerup': require('../assets/sound/powerup.wav'),
    'bomb': require('../assets/sound/bomb.wav')
  }
};
