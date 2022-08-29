const disconnectSockets = require('./disconnectSockets');
const leaveRoom = require('./leaveRoom');

module.exports = {
  ...disconnectSockets,
  ...leaveRoom,
};
