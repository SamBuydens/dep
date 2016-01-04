'use strict';

let audioData = require('../modules/audioData');
let auth = require('../modules/auth');
let userPage;

module.exports = [

  //SONG
  //GET BY NAME
  {
    method: 'GET',
    path: '/trip/song/{title}',
    handler: (request, reply) => {
      let arg = {'creator_id': userPage._id, 'title': request.params.title};
      audioData.getSongByTitle(arg)
      .then(success => {
        let isUser = String(request.session._store.user._id) === String(userPage._id);
        return reply({
          song: success,
          isUser: isUser
        });
      })
      .catch( (err) => {
        console.log(`catching an error , ${err}!`);
        return reply.redirect('/login'); //404 OFZO
      });
    }
  },

  //GET ALL
  {
    method: 'GET',
    path: '/trip/{username}',
    handler: (request, reply) => {
      console.log(request.params.username);
      auth.getUserByName(request)
      .then(success => {
        if(success){
          userPage = success;
          audioData.getSongsByid(success._id)
          .then(success => {
            let isUser = String(request.session._store.user._id) === String(userPage._id);
            return reply.view('index', {
              songs: success,
              isUser: isUser,
              userPage: request.params.username
            });
          })
          .catch( (err) => {
            console.log(`catching an error , ${err}!`);
            return reply.redirect('/login');
          });
        }

      }).catch( (err) => {
        console.log(`catching an error , ${err}!`);
        return reply.redirect('/login');
      });
      return request.params.username;
    }
  },

  //NEW SONG
  {
    method: 'POST',
    path: '/newsong',
    handler: (request, reply) => {
      console.log('-----v-----');
      console.log(request.payload);
      console.log('-----^-----');
      //request.payload.creator_id = request.session._store.user._id;
      let arg = {'creator_id': request.session._store.user._id, 'song': request.payload};
      audioData.newSong(arg)
      .then(success => {
        console.log('--v---v-sss');
        console.log(success);
        return reply(success);
      })
      .catch( (err) => {
        console.log(`catching an error , ${err}!`);
        return reply(err);
      });
    }
  },

  //CHANGE SONG
  {
    method: 'POST',
    path: '/changesong',
    handler: (request, reply) => {
      audioData.changeSong(request)
      .then(success => {
        return reply(success);
      })
      .catch( (err) => {
        console.log(`catching an error , ${err}!`);
        return reply(err);
      });
    }
  },

  //DELETE SONG
  {
    method: 'POST',
    path: '/removesong',
    handler: (request, reply) => {
      audioData.deleteSong(request)
      .then(success => {
        return reply(success);
      })
      .catch( (err) => {
        console.log(`catching an error , ${err}!`);
        return reply(err);
      });
    }
  },

  //SOUND

  //NEW SOUND
  {
    method: 'POST',
    path: '/newsound',
    handler: (request, reply) => {
      console.log('/newsound');
      console.log(request.payload);
      console.log(request.session._store.user);
      console.log('------^-------');
      request.payload.creator_id = request.session._store.user._id;
      audioData.newSound(request)
      .then(success => {
        return reply(success);
      })
      .catch( (err) => {
        console.log(`catching an error , ${err}!`);
        return reply(err);
      });
    }
  },

  {
    method: 'GET',
    path: '/getsounds',
    handler: (request, reply) => {
      console.log('/getsounds');
      audioData.getSongsByCreator(request.session._store.user._id)
      .then(success => {
        return reply(success);
      })
      .catch( (err) => {
        console.log(`catching an error , ${err}!`);
        return reply.redirect('/login'); //404 OFZO
      });
    }
  },

];
