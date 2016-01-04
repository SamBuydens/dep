'use strict';
let Joi = require('joi');
let validation = require('../modules/validation');
let auth = require('../modules/auth');

module.exports = [

  {
    method: 'GET',
    path: '/register',
    handler: (request, reply) => {
      return reply.view('auth/register');
    }
  },

  {
    method: 'GET',
    path: '/login',
    handler: (request, reply) => {
      return reply.view('auth/login');
    }
  },

  {
    method: 'POST',
    path: '/login',
    handler: (request, reply) => {
      auth.login(request)
        .then(success => {
          if(success){
            return reply.redirect('/trip/' + success.username);
          }else{
            let values = request.payload;
            return reply.view('auth/login', {
              title: 'login',
              error: 'Incorrect user/password combination',
              values
            });
          }
        }).catch((err) => {
          console.log(`catching an error , ${err}!`);
          let values = request.payload;
          return reply.view('auth/login', {
            title: 'login',
            error: 'Something went wrong, please try again',
            values
          });
        });
    },

    config: {
      validate: {
        payload: {
          login: Joi.string().required(),
          password: Joi.string().required()
        },

        failAction: (request, reply, source, error) => {

          let errors = validation.errors(error);
          let values = request.payload;

          return reply.view('auth/login', {
            title: 'login',
            error: 'please fill in both fields',
            errors,
            values
          });

        }
      }
    }
  },

  {
    method: 'GET',
    path: '/logout',
    handler: (request, reply) => {
      auth.logOut(request);
      return reply.redirect('login');
    }
  },

  {
    method: 'POST',
    path: '/register',
    handler: (request, reply) => {

      auth.register(request)
      .then(() => reply.redirect('/trip'))

      .catch( (err) => {
        console.log(`catching an error , ${err}!`);
        return reply.view('auth/register', {
          title: 'register',
          error: 'username and or email already exists',
          value: request.payload
        });
      });
    },

    config: {

      validate: {

        payload: {
          username: Joi.string().required(),
          password: Joi.string().required(),
          email: Joi.string().email().required()
        },

        failAction: (request, reply, source, error) => {
          let errors = validation.errors(error);
          let values = request.payload;
          console.log(errors);
          return reply.view('auth/register', {errors, values});
        }

      }
    }
  }

];
