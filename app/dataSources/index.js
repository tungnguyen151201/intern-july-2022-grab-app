const mongoose = require('mongoose');
const models = require('./models');
const config = require('../config');
const controllers = require('./controllers');

// TODO init mongodb connection
(async () => {
  try {
    await mongoose.connect(config.mongodb.connnectionString, config.mongodb.options);
  } catch (error) {
    logger.log('error', error);
  }
})();

module.exports = {
  controllers: () => ({ ...controllers }),
  models,
};
