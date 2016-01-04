'use strict';

let auth = require('../modules/auth');

module.exports = [
  //STANDAARD
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      return reply.redirect('/trip');
    }
  },

  {
    method: 'GET',
    path: '/trip',
    handler: (request, reply) => {
      if(auth.loggedIn(request)){
        let user = auth.user(request);
        return reply.view('index', {
          name: user.username
        });
      }else{
        return reply.redirect('/login');
      }
    }
  }
];
