'use strict';

let mongoose = require('mongoose');
let Song = mongoose.models.Song;
let Sound = mongoose.models.Snd;

const newSong = request => {
  console.log('[audioData] newSong');

  return new Promise((resolve, reject) => {
    var promise = getNewSongTitle(8, request.creator_id)
  .then(function(data) {

      request.title = data;
      let s = new Song(request);

      s.save(err => {
        if(err) return reject(err);
        return resolve(s);
      });

    });
  });
};

const getNewSongTitle = (length, creator_id) => {
  return new Promise((resolve, reject) => {
    console.log('[audioData] getNewTitle');

    let title = genTitle(length);
    let query = {'title': title, 'creator_id': creator_id};
    Song.findOne(query).exec()
      .then(model => {
        if (!model) return resolve(title);
        return revolve('model');
      });
  });
};

const getNewSoundTitle = (length, creator_id) => {
  return new Promise((resolve, reject) => {
    console.log('[audioData] getNewSoundTitle');

    let title = genTitle(length);
    let query = {'title': title, 'creator_id': creator_id};
    Sound.findOne(query).exec()
      .then(model => {
        if (!model) return resolve(title);
        return revolve('model');
      });
  });
};

const genTitle = (length) => {
  console.log('[audioData] genTitle');

  var title = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < length; i++ ){
      title += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return title;
};

const deleteSong = request => {
  console.log('[audioData] deleteSong');
  return new Promise((resolve, reject) => {
    Song.findOneAndRemove({'title': request.payload.title, 'creator_id': request.payload.creator_id}).exec()
    .then(model => {
      if (!model) return resolve('error');
      return resolve(model);
    });
  });
  /*
  return new Promise((resolve, reject) => {
    getSongByTitle(request.payload)
    .then(function(data){
      data.remove();
    });
  });
  */
};

const getSongByTitle = request => {
  return new Promise((resolve, reject) => {
    console.log('getSongByTitle');
    console.log(request);
    let query = {'creator_id': request.creator_id, 'title': request.title};
    Song.find(query).exec()
      .then(model => {
        if (!model) return resolve(false);
        return resolve(model);
      });
  });
};

const getSongsByid = request => {
  return new Promise((resolve, reject) => {
    let query = {'creator_id': request};
    Song.find(query).exec()
      .then(model => {
        if (!model) return resolve(false);
        return resolve(model);
      });
  });
};

const newSound = request => {
  return new Promise((resolve, reject) => {
    var promise = getNewSoundTitle(8, request.payload.creator_id)
    .then(function(data) {
        request.payload.creator_id = request.payload.creator_id;
        request.payload.title = data;
        console.log(request.payload);

        let s = new Sound(request.payload);
      //  s.isNew = false;
        s.save(err => {
          if(err) return reject(err);
          console.log(s);
          return resolve(s);
        });

      });
  });
};

const changeSong = request => {
  return new Promise((resolve, reject) => {
    let pl = JSON.parse(request.payload);
    let query = {'_id': pl.song._id};
    var update = {song: JSON.stringify(pl.trackList)};
    var options = {new: true};
    Song.findOneAndUpdate(query, update, options).exec()
    .then(model => {
      if (!model) return resolve(false);
      return resolve(model);
    });
  });
};

const getSongsByCreator = request => {
  return new Promise((resolve, reject) => {
    let query = {'creator_id': request};
    Sound.find(query).exec()
      .then(model => {
        if (!model) return resolve([]);
        return resolve(model);
      });
  });
};

module.exports = {
  newSong, getSongsByid, getSongByTitle, newSound, changeSong, getSongsByCreator, deleteSong
};

/*


  console.log(request.payload);
  let title = newSongTitle(8, request.payload.creator_id);
  request.payload.title = title;
  let s = new Song(request.payload);
  s.save(err => {
    if(err) return reject(err);
    return resolve(title);
  });

*/
