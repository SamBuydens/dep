'use strict';

let mongoose = require('mongoose');  //
let Schema = mongoose.Schema; //TABELS

module.exports = () =>{
  let schema = new Schema({
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    song: {
      type: String,
      required: false
    }

  });

  return mongoose.model('Song', schema);
};
