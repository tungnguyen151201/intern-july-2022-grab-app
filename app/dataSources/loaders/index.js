const userLoaders = require('./user');
const tripLoaders = require('./trip');

module.exports = {
  ...userLoaders,
  ...tripLoaders,
};
