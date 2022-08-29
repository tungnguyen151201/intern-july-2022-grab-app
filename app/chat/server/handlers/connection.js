const jwt = require('jsonwebtoken');
const config = require('../../../config');

module.exports = async socket => {
  // timer check token expired
  const timer = setInterval(async () => {
    try {
      const { token } = socket.handshake.auth;
      const { exp } = jwt.verify(token, config.jwt.secretKey);

      if (Date.now() > exp) {
        socket.disconnect(true);
      }
    } catch (error) {
      logger.error('connectionHandler - timer check token expired error:', error);
      socket.disconnect(true);
    }
  }, 30 * 1000);

  function onDisconnect() {
    clearInterval(timer);
  }

  socket.on('disconnect', onDisconnect);
};
