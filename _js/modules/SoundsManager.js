'use strict';
import {$, last} from '../helpers/util';
import {get, post} from '../helpers/xhr';

let EventEmitter = require('eventemitter2');
let showing = false;

let completedSong = [];
export default class SongManager extends EventEmitter{

  constructor(){
    super();

    if($('.random-sound')){
      $('.random-sound').onclick= (e =>{
        console.log('random-sound pressed');
        this.newSoundHandler($('.scales').value);
      });
    }

    if($('.save-sound')){
      $('.save-sound').onclick= (e =>{
        console.log('save-sound pressed');
        this.saveSoundHandler();
      });
    }

    this.getSounds();
  }

  newSoundHandler(e){
    this.emit('new-sound-handler', e);
  }

  saveSoundHandler(){
    this.emit('save-sound-handler');
  }

  getSounds(){
    console.log('getSounds');
    get('/getsounds')
    .then(data => {
      console.log(data);
      this.emit('sounds-collected', data);
    })
    .catch( (err) => {
      console.log(`catching an error , ${err}!`);
    });
  }

  saveSound(sound){
    post('/newsound', sound)
    .then(data => {
      this.emit('sound-added-changed', data);
    });
  }

}
