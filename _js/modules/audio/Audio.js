'use strict';

let Track = require('./tracks/Track');
//let test = require('json!./tracks/Test.json');
let Waves = require('./elements/Waves.js');
let counter = 0;
let teller = 0;
let that;
let EventEmitter = require('eventemitter2');

export default class Audio extends EventEmitter{
  constructor(){
    super();
    that = this;
    console.log('[Audio] constructossr');
    this.createContext();
    this.setupTrack();
    //this.playTrack();
    this.waves = new Waves().waves;
    this.createNewTrack();

    //random sound
    this.randTune = {};
    //

  }

  createContext(){
    if('webkitAudioContext' in window) {
      this.context = new webkitAudioContext();

      window.addEventListener('touchstart', function() {
// create empty buffer
  var buffer = this.context.createBuffer(1, 1, 22050);
  var source = this.context.createBufferSource();
  source.buffer = buffer;

  // connect to output (your speakers)
  source.connect(this.context.destination);

  // play the file
  source.noteOn(0);


      }, false);
    }
    else this.context = new window.AudioContext();
  }

  setupTrack(){
    this.track = new Track(this.context);

    this.track.on('tuneStopped', () => {

      teller++;
      this.playSound();
    });
  }

  playSong(myTrack){
    this.myTrack = myTrack;
    if(teller === 0) this.playSound()

    this.track.play(this.myTrack[teller%this.myTrack.length]);
  }

  playSound(){

  }



  createNewTrack(){

  }



  createNewSound(e){

    that.randTune.attack = Math.floor(Math.random() * 200) + 1;
    that.randTune.decay = 2000/e;//Math.floor(Math.random() * 400) + 1; //KIJKEN NAAR TYPE
    that.randTune.freq = Math.floor(Math.random() * 600) + 1;
    that.randTune.wave = that.pickRandomProperty(that.waves);
    that.randTune.tuneName = that.makeid();

    that.track.play(that.randTune);
  }

  pickRandomProperty(obj) { //:TODO: in helper klasse zetten
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
  }

  makeid(){ //:TODO: in helper klasse zetten
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
