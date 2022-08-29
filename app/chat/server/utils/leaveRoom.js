const io = require('../createServer');

function leaveRoom(room) {
  io.socketsLeave(room);
}

module.exports = {
  leaveRoom,
};
