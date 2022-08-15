const UserControllers = require('./User');
const TripControllers = require('./Trip');

module.exports = {
  ...UserControllers,
  ...TripControllers,
};
