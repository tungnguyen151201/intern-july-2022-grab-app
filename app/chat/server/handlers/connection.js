const jwt = require('jsonwebtoken');
const { setSocketIdToken } = require('../../../dataSources/utils/redis');
const config = require('../../../config');
const { verifyToken } = require('../../../utils');

module.exports = async socket => {
  // save socket id to redis
  try {
    const { id, handshake } = socket;
    const { token } = handshake.auth;
    const { exp } = jwt.verify(token, config.jwt.secretKey);
    await setSocketIdToken(token, id, exp);
  } catch (error) {
    logger.error('connectionHandler - save socketId error:', error);
    socket.disconnect(true);
  }

  // timer verify token
  const timer = setInterval(async () => {
    try {
      const { token } = socket.handshake.auth;
      const verifyResult = await verifyToken(token);

      if (!verifyResult.isSuccess) {
        socket.disconnect(true);
      }
    } catch (error) {
      logger.error('connectionHandler - timer verifyToken error:', error);
      socket.disconnect(true);
    }
  }, 30 * 1000);

  function onDisconnect() {
    clearInterval(timer);
  }

  socket.on('disconnect', onDisconnect);
};
