require('./models');
const config = require('../config');
const controllers = require('./controllers');

// TODO init mongodb connection

module.exports = {
  controllers: () => ({ ...controllers }),
};
