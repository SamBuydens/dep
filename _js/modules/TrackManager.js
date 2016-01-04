'use strict';
import {$, last} from '../helpers/util';

let EventEmitter = require('eventemitter2');
let showing = false;
let soundTemplate = require('../../_hbs/sound');
let soundOption = require('../../_hbs/songOption');
let Track = require('../../models/Track');
//let sounds = require('../data/sounds');
let sounds = [];
let totalTracks = 0;
let teller = 0;
let song = [];
let completedSong = [];
export default class TrackManager extends EventEmitter{

  constructor(argSound){
    super();

    sounds = argSound;

    document.deleteMe = (e) => {
      let dom = e.target.parentElement.parentElement;
      let id = dom.getAttribute('data-trackid');
      this.removeTrack(e.target.parentElement.parentElement, id);
    };

    document.trackManagerSoundChanged = (e) => {

      console.log(e.currentTarget);

      let completion = e.currentTarget.parentElement.parentElement.parentElement.getElementsByClassName("incomplete")[0];
      completion.innerText = "incomplete";
      let trackId = e.currentTarget.parentElement.parentElement.parentElement.getAttribute('data-trackid');
      let selectedVal = e.currentTarget.value;
      let soundPos = e.currentTarget.getAttribute('data-sound-position');

      console.log(trackId+' - '+soundPos+' - '+selectedVal+' - '+completion);

      this.updateChange(trackId, soundPos, selectedVal, completion);
    };

    $('.addTrack').onmousedown = (e) => {
      e.preventDefault();
      if(totalTracks === 8){
        return;
      }

      totalTracks++;
      this.setTotalTracks();
      teller++;

      let items = [];
      let length = $('.scales').value;

      let soundAttributes = this.retrieveSoundAttributes(length);

      for(var i = 0; i<length; i++){
        items.push({title: `position${i+1}`, soundLength: soundAttributes.varClass, filteredSounds: soundAttributes.sounds});
      }

      let context = {sounds: items, trackNumber: teller};
      let html = soundTemplate(context);

      items.forEach((value) => {
        value.selectedVal = undefined;
        delete value.soundLength;
      });

      //make new track, push to songs
      let track = new Track(teller, items);
      song.push(track);

      $('.tracks').insertAdjacentHTML('afterbegin', html);
    };

    document.addEventListener('keydown', (e) => {
      if(e.keyCode === 32 && !showing) this.showTrackManager();
      else if(e.keyCode === 32 && showing) this.hideTrackManager();
    });
  }

  ///soundAdded
  soundAdded(e){
    //DECAY BEKIJKEN EN CLASS BEPALEN
    sounds.push(e);
    let varClass;
    switch(2000/e.decay){
    case 1: varClass = 'oneOne';
      break;

    case 2: varClass = 'twoTwo';
      break;

    case 4: varClass = 'fourFourth';
      break;

    case 8: varClass = 'eightEight';
      break;
    }
    //WAARDE TOEVOEGEN AAN ALLE DROP-DOWNS MET DE CLASSE
    if($('.'+varClass)){
      console.log($('.'+varClass+'>select'));
      //soundOption
      let html = soundOption({'title':e.title});
      $('.'+varClass+'>select').forEach((select) => {
        select.insertAdjacentHTML('beforeend', html);
      });
    }
  }

  songLoaded(e){
    console.log('song loaded tm');
    totalTracks = 0;
    let loadedSong = JSON.parse(e.song);
    //loadedSong.forEach((track) => {
    for (let y = 0; y < loadedSong.length; y++) {

      let soundAttributes = this.retrieveSoundAttributes(String(2000 / loadedSong[y].track[0].decay));
      let items = [];
      for(var i = 0; i<2000/loadedSong[y].track[0].decay; i++){
        items.push({title: `position${i+1}`, soundLength: soundAttributes.varClass, filteredSounds: soundAttributes.sounds, selectedVal: loadedSong[y].track[i].selectedVal});
      }

      let context = {sounds: items, trackNumber: totalTracks + 1};
      let html = soundTemplate(context);

      let trck = new Track(totalTracks + 1, items);
      song.push(trck);
      //completedSong.push(trck);
      $('.tracks').insertAdjacentHTML('afterbegin', html);
      //selecteren
      let j = 0;

      $('.'+soundAttributes.varClass + '> select').forEach((select) => {
        select.value = loadedSong[y].track[j].selectedVal;
        j++;
      });
    };
    totalTracks++;
  }

  ///

  showTrackManager(){
    if(!$('.utils').classList.contains('hide')) return;
    $('.trackManager').classList.remove('hide');
    showing = true;
    console.log('showing trackmanager');

  }

  hideTrackManager(){
    $('.trackManager').classList.add('hide');
    showing = false;

    console.log('hiding trackmanager');
  }

  retrieveSoundAttributes(value){
    let varClass;
    switch(value){
    case '1': varClass = 'oneOne';
      break;

    case '2': varClass = 'twoTwo';
      break;

    case '4': varClass = 'fourFourth';
      break;

    case '8': varClass = 'eightEight';
      break;
    }

    return {varClass: varClass, sounds: this.filterSoundsByLength(2000/value)};
  }

  filterSoundsByLength(length){
    console.log(sounds);
    let filteredSounds = sounds.filter((s) =>{
      console.log(s.decay === length);
      return s.decay === length;
    });
    if(filteredSounds) return filteredSounds;
  }

  removeTrack(dom, id){

    $('.tracks').removeChild(dom);
    this.filterSongDraftArray(id);
    this.filterCompletedSongArray(id);
    totalTracks--;
    this.setTotalTracks();
    this.emit('songUpdated', completedSong);
  }

  setTotalTracks(){
    $('.total').innerText = 8 - totalTracks;
  }

  filterSongDraftArray(id){

    song = song.filter((track) => {

      return track.id !== parseInt(id);

    });
  }

  filterCompletedSongArray(trackId){

    completedSong = completedSong.filter((track) => {
      return track.id !== parseInt(trackId);
    });
  }

  updateChange(trackId, soundPos, selectedVal, completion){

    let unSelectedSounds = 0;

    let track = song.find((myTrack) => {
      return myTrack.id === parseInt(trackId);
    });
    if(!track) return;
    track.sounds[soundPos].selectedVal = selectedVal;

    track.sounds.forEach((sound) => {

      if(!sound.selectedVal || sound.selectedVal === 'select_sound'){
        unSelectedSounds++;
      };
    });
    console.log('---sd');
    console.log(unSelectedSounds);
    if(unSelectedSounds === 0){

      let songExists = completedSong.find((se) => {
        return se.id === parseInt(trackId);
      });

      if(!songExists) completedSong.push(track);
      this.toggleComplete(true, completion)
      this.emit('songUpdated', completedSong);

    }else if(unSelectedSounds > 0){
      this.toggleComplete(false, completion);
      this.filterCompletedSongArray(trackId);
      this.emit('songUpdated', completedSong);
    }

  }

  toggleComplete(value, completion){
    if(value){
      completion.classList.add('completed');
      completion.innerText = "published";
    } else if(!value) {
      completion.classList.remove('completed');
      completion.innerText = "unpublished";
    }
  }

}
