const mongoose = require('mongoose');
const config = require('../config');
const controllers = require('./controllers');
const { redis } = require('./utils');

mongoose.connect(config.mongodb.connnectionString, config.mongodb.options);

mongoose.connection.on('error', error => {
  logger.error('mongodb connection error', error);
  process.exit(1);
});

mongoose.connection.on('connected', () => {
  logger.info('connected to mongoodb');
});

module.exports = {
  controllers: () => ({ ...controllers }),
  redisUtils: redis,
};
