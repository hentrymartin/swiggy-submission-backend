const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const db = {};
const comment = require('./comment');
const user = require('./user');
const post = require('./post');
const friends = require('./friends');

const option = {
	useMongoClient: true,
};

mongoose.connect(config.url, option);

module.exports = {
  comment,
  user,
  post,
  friends,
};