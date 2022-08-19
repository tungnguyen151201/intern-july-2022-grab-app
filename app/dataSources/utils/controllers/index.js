const trip = require('./tripUtils');
const user = require('./userUtils');

module.exports = {
  ...trip,
  ...user,
};
