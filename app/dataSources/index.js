const mongoose = require('mongoose');
const models = require('./models');
const config = require('../config');
const controllers = require('./controllers');

// TODO init mongodb connection
(async function connectDb() {
  try {
    await mongoose.connect(config.mongodb.connnectionString, config.mongodb.options);
  } catch (error) {
    logger.error(error);
  }
}());

module.exports = {
  controllers: () => ({ ...controllers }),
  models,
};
