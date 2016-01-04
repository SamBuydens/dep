'use strict';

let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL);

let fs = require('fs');
let path = require('path');

let validateFileName = require('../modules/validateFileName');

module.exports.register = (server, options, next) => {

  fs.readdirSync('./models/mongoose').forEach(file => {
    console.log(file);
    if(!validateFileName(file))return;

    let schema = require(`../models/mongoose/${file}`)();
    let name = path.basename(file, '.js');

    mongoose.model(name, schema);

  });

  next();

};

module.exports.register.attributes = {
  name: 'mongoose',
  version: '0.1.0'
};
