require('dotenv').config();
const apollo = require('./apollo');
const mongodb = require('./mongodb');
const logger = require('./logger');
const jwt = require('./jwt');

module.exports = {
  ...apollo,
  ...mongodb,
  ...logger,
  ...jwt,
};
