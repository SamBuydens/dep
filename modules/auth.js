'use strict';

let mongoose = require('mongoose');
let User = mongoose.models.User;

const register = request => {

  return new Promise((resolve, reject) => {

    let d = request.payload;
    console.log(d);

    let u = new User(d);
    u.save(err => {
      if(err) return reject(err);

      request.session.set('user', d);
      return resolve();
    });
  });

};

const user = request => request.session.get('user');

const loggedIn = request => user(request) !== undefined;

const login = request => {

  return new Promise((resolve, reject) => {

    let l = request.payload.login;
    let p = request.payload.password;

    let query = {
      $or: [
        {email: l},
        {username: l}
      ]
    };
    User.findOne(query).exec()
      .then(model => {

        if (!model) return resolve(false);
        model.compare(p)
          .then(isMatch => {
            if (isMatch) {
              request.session.set('user', model);
              return resolve(model);
            } else {
              return resolve(false);
            }
          }).catch(err => reject(err));

      });

  });
};

const logOut = request => request.session.clear('user');

const getUserByName = request => {
  return new Promise((resolve, reject) => {
    let query = {'username': request.params.username};
    User.findOne(query).exec()
      .then(model => {
        if (!model) return resolve(false);
        return resolve(model);
      });
  });
};

module.exports = {
  register, loggedIn, logOut, user, login, getUserByName
};
