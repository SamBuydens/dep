'use strict';

//SEED BIJHOUDEN
//REMOVE TRACK
//TRACK 12/12 bepaald lengte
let EventEmitter = require('eventemitter2');
let Gain = require('../nodes/Gain');
let Oscillator = require('../nodes/Oscillator');

export default class Track extends EventEmitter{

  constructor(context){
    super();
    this.context = context;
  }

  play(tune){

    var g = new Gain(this.context, tune.attack, tune.decay);
    var o = new Oscillator(this.context, g, tune.freq, tune.wave);

    window.setTimeout(() => {
      o.stopSelf();
      g.stopSelf();
      this.emit('tuneStopped');
    }, tune.decay);
  }

  playWithTimeout(tune, timeOut){
    window.setTimeout(() => {
      var g = new Gain(this.context, tune.attack, tune.decay);
      var o = new Oscillator(this.context, g, tune.freq, tune.wave);

      window.setTimeout(() => {
        o.stopSelf();
        g.stopSelf();
        this.emit('tuneStopped');
      }, tune.decay);
    }, timeOut)

  }

  playSingleSound(tune){
    var g = new Gain(this.context, tune.attack, tune.decay);
    var o = new Oscillator(this.context, g, tune.freq, tune.wave);
    window.setTimeout(() => {
      o.stopSelf();
      g.stopSelf();
    }, g.decay);
  }

}
