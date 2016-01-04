'use strict';

let mongoose = require('mongoose');  //
let Schema = mongoose.Schema; //TABELS

let bcrypt = require('bcryptjs');

module.exports = () =>{
  let schema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      require: true //GAAT ZELF CONTROLEREN
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    active: {
      type: Boolean,
      default: true
    },

    created: {
      type: Date,
      default: Date.now //CURRENT DATE
    },

    role: {
      type: String,
      default: true
    }

  });

  schema.pre('save', function(next){
    let user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err2, hash) => {
          // Store hash in your password DB.
        user.password = hash;
        next();
      });
    });
  });

  schema.methods.compare = function(entered){
    return new Promise((resolve, reject) => {

      bcrypt.compare(entered, this.password, (err, isMatch) => {
        if(err)return reject(err);
        return resolve(isMatch);
      });

    });
  };

  return mongoose.model('User', schema);
};
