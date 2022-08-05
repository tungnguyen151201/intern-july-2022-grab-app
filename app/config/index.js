const apollo = require('./apollo');
const mongodb = require('./mongodb');
const logger = require('./logger');

module.exports = {
  ...apollo,
  ...mongodb,
  ...logger,
};
