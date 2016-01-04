'use strict';

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
import {objSize} from './helpers/util';
let stage = require('./modules/stage');
//let dummy = require('./data/dummy');
//let sounds = require('./data/sounds');
let sounds;
let Audio = require('./modules/audio/Audio');
let KeyBinder = require('./modules/KeyBinder');
let SongManager = require('./modules/SongManager');
let SoundsManager = require('./modules/SoundsManager');
let TrackManager = require('./modules/TrackManager');

let audio;
let audioFile = [];
let emptyfile = true;

let songManager;
let trackManager;
let song;
let currentSong;
//let facey = require('./data/tracking/face-min');

const init = () => {
  stage.init();
  audio = new Audio();

  setInterval(playFile, 2000);

  let keyBinder = new KeyBinder();

  songManager = new SongManager();
  let soundsManager = new SoundsManager();


  keyBinder.on('playSingleSound', (sound) => {

    let soundToPlay = sounds.find((s)=>{
      return s.name === sound;
    });

    if(soundToPlay){

      stage.playSingleSound({'track': [soundToPlay]});
      audio.track.playSingleSound(soundToPlay);
    }
  });

  //LUISTEREN
  songManager.on('song-selected', function(e){
    console.log('songd-selected');
    audioFile = JSON.parse(e.song);
    currentSong = e;

      trackManager.songLoaded(currentSong);

  });
  songManager.on('song-deleted', function(){
    console.log('song-deleted');
    audioFile = [];
  });
  songManager.on('tracks-changed', function(e){
    console.log('tracks-changed');
  });
  soundsManager.on('sounds-collected', function(e){
    console.log('sounds-collected');
    sounds = e;
    assetsLoaded();
  });
  soundsManager.on('new-sound-handler', function(e){
    console.log('new-sound-handler');
    audio.createNewSound(e);
  });
  soundsManager.on('save-sound-handler', function(){
    if(objSize(audio.randTune) > 0){
      console.log('save-sound-handler');
      soundsManager.saveSound(audio.randTune);
    }
    audio.randTune = {};
  });
  soundsManager.on('sound-added-changed', function(e){
    trackManager.soundAdded(e);
    sounds.push(e);
  });

};

const assetsLoaded = () => {

  trackManager = new TrackManager(sounds);
  if(audioFile.length > 0){
    trackManager.songLoaded(currentSong);
  }

  trackManager.on('songUpdated', (song) => {
    console.log('song-updated');
    let playList = [];
    let trackCount = 0;
    song.forEach((track) => {
    //LIED PAS OPSLAAN BIJ EEN VOLLE TRACK
    //SONG ONTDOEN VAN SOUND VARIABELEN
    //ForEach -> save
      trackCount++;
      let strippedTrack = [];
      let minimizedTrack = track.sounds;

      minimizedTrack.forEach((sound)=>{

        let fetchedSound = sounds.find((s)=>{
          return sound.selectedVal === s.title;
        });

        if(fetchedSound){
          sound = Object.assign(sound, fetchedSound);
          strippedTrack.push(sound);
        }

      });
      playList.push({track: strippedTrack});
    });
    audioFile = playList;
    console.log(playList);
    if(currentSong){
      if(currentSong.title){
        console.log(currentSong.title);
        songManager.songChanged(audioFile);
      }else{
        console.log('geen title, nieuw lied');

        songManager.newSongHandler(audioFile);
      }
    }else{
      console.log(audioFile);
      songManager.newSongHandler(audioFile);
    }
  });
};

const playFile = () =>{

  if(audioFile.length > 0){

    audioFile.forEach((partial) => {
      let i = 0;
      partial.track.forEach((val) => {
        audio.track.playWithTimeout(val, val.decay * i);
        i++;
      })

      stage.redrawSound(partial);
  });
  } if(audioFile.length === 0){
    console.log('length is zero');
     stage.redrawSound(false);
  }

};


init();
