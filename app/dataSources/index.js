const mongoose = require('mongoose');
const models = require('./models');
const config = require('../config');
const controllers = require('./controllers');

(async () => {
  try {
    await mongoose.connect(config.mongodb.connnectionString, config.mongodb.options);
  } catch (error) {
    throw new Error(error);
  }
})();

module.exports = {
  controllers: () => ({ ...controllers }),
  ...controllers,
  models,
};
