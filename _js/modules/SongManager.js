'use strict';
import {$} from '../helpers/util';
import {get, post} from '../helpers/xhr';

let EventEmitter = require('eventemitter2');
let showing = false;
let soundTemplate = require('../../_hbs/sound');
let songOption = require('../../_hbs/songOption');
let Handlebars = require('Handlebars');

let completedSong = [];
export default class SongManager extends EventEmitter{

  constructor(){
    super();

    document.addEventListener('keydown', (e) => {
      if(e.keyCode === 32 && !showing) this.showTrackManager();
      else if(e.keyCode === 32 && showing) this.hideTrackManager();
    })

    //if($('#new-song-btn')){
    //  $('#new-song-btn').onclick= (e =>{
    //    console.log('new-song-btn pressed');
    //    this.newSongHandler();
    //  });trackManager.songLoaded(currentSong);
    //}
    if($('#remove-song')){
      $('#remove-song').onclick= (e =>{
        if($('#song-list').value !== 'new-song'){
          console.log('remove');
          post('/removesong', this.song)
          .then(success => {
            console.log(success.title);
            for (let i=0;i<$('#song-list').length;  i++) {
              if ($('#song-list').options[i].value=='D') {
                $('#song-list').remove(i);
              }
            }
            $('#song-list').value = 'new-song';
            this.emit('song-deleted');
          })
          .catch( (err) => {
            console.log(`catching an error , ${err}!`);
          });
        }
      });
    }
    if($('#song-list')){
      this.getSelectedSong();
      $('#song-list').onchange = (e =>{
        this.getSelectedSong();
      });
    }else{
      console.log('willekeurig ophalen');
    }
  }

  songChanged(trackList){
    post('/changesong', JSON.stringify({'trackList': trackList, 'song': this.song}))
    .then(data => {
      console.log(data);
    //  this.emit('tracks-changed', data.song);
    });
  }

  getSelectedSong(){
    console.log('getSelectedSong');
    get('/trip/song/'+ $('#song-list').value)
    .then(success => {
      if(success.isUser){
        console.log(success);
        if(success.song[0]){
          this.song = success.song[0];
          if(success.song[0].song){
            this.emit('song-selected', success.song[0]); //JSON.parse(success.song[0].song)
          }else{
            this.emit('song-selected', success.song[0]);
          }
        }else {
          this.emit('song-selected', []);
        }
      }
      //gewone render
    })
    .catch( (err) => {
      console.log(`catching an error , ${err}!`);
    });
  }

  showTrackManager(){
    if(!$('.utils').classList.contains('hide')) return;
    $('.song-manager').classList.remove('hide');
    showing = true;
    console.log('showing song-manager');

  }

  hideTrackManager(){
    $('.song-manager').classList.add('hide');
    showing = false;

    console.log('hiding song-manager');
  }

  newSongHandler(e){
    console.log('newSoundHandler');
    console.log(e);
    //post('/changesong', JSON.stringify({'trackList': trackList, 'song': this.song}))
    post('/newsong', JSON.stringify({'trackList': e}))
    .then(data => {
      let template = Handlebars.compile(songOption({
        'title': data.title
      }));
      $('#song-list').insertAdjacentHTML('beforeend', template());
      $('#song-list').value = data.title;

      this.getSelectedSong();

    });
  }

}
