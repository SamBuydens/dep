'use strict';
import {$} from '../helpers/util';
let keyCodes = [65, 90, 69, 82, 84, 89, 85, 73, 79, 80, 91];
let characters = ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
let boundTracks = [];
let EventEmitter = require('eventemitter2');

export default class KeyBinder extends EventEmitter{

  constructor(){
    super();
    console.log('[KeyBinder]');
    $('.back').onmousedown = () => {
      $('.utils').classList.add('hide');
    };

    document.addEventListener('keydown', (e) => {

      let bindableKey = keyCodes.find((k) => {
        return k === e.keyCode;
      });

      if(bindableKey && e.shiftKey) this.defineNewKeyBinding(bindableKey);
      if(bindableKey && !e.shiftKey) this.playSoundByKey(bindableKey);

    });
  }

  defineNewKeyBinding(keyCode){
    if(!$('.trackManager').classList.contains('hide')) return;
    let characterIndex = keyCodes.findIndex((kc)=>{
      return kc === keyCode;
    });

    if(characterIndex > -1){
      $('.utils').classList.remove('hide');
      $('.bindKey').innerText = characters[characterIndex];
    }

    $('.available_sounds').onchange = (e) => {
      if(e.target.value !== 'select_sound'){
        $('.utils').classList.add('hide');
        boundTracks[keyCode] = e.target.value;
      }
    };
  }


  playSoundByKey(key){

    if(boundTracks[key]){
      this.emit('playSingleSound', boundTracks[key]);
    }

    else console.log('key not bound');
  }

}
