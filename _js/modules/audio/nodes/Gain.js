'use strict';

export default class Gain{

  constructor(context, attack, decay){
    this.context = context;
    this.attack = attack;
    this.decay = decay;
    this.gain = context.createGain();
    this.gain.connect(context.destination);
    this.gain.gain.setValueAtTime(0, context.currentTime);
    this.gain.gain.linearRampToValueAtTime(1, context.currentTime + this.attack / 1000);
    this.gain.gain.linearRampToValueAtTime(0, context.currentTime + this.decay / 1000);
  }

  stopSelf(){
    this.gain.disconnect(this.context.destination);

  }

}
