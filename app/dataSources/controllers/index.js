const UserControllers = require('./User');
const TripControllers = require('./Trip');
const RoomControllers = require('./Room');

module.exports = {
  ...UserControllers,
  ...TripControllers,
  ...RoomControllers,
};
