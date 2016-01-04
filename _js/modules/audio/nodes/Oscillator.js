'use strict';

export default class Oscillator{

  constructor(context, g, freq, wave){
    this.g = g;
    this.osc = context.createOscillator();
    this.osc.frequency.value = freq;
    this.osc.type = wave;
    this.osc.connect(this.g.gain);
    this.osc.start(0);
  }

  stopSelf(){
    this.osc.stop(0);
		this.osc.disconnect(this.g.gain);
  }

}
