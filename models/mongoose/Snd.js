'use strict';

let mongoose = require('mongoose');  //
let Schema = mongoose.Schema; //

module.exports = () =>{
  let schema = new Schema({
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    title: {
      type: String,
      require: false
    },

    place: {
      type: Number,
      require: false
    },

    attack: {
      type: Number,
      require: true
    },

    decay: {
      type: Number,
      require: true
    },

    wave: {
      type: String,
      require: true
    },

    freq: {
      type: Number,
      require: true
    }

  });

  return mongoose.model('Snd', schema);
};
