const { verifyToken } = require('../../../utils');

module.exports = async (socket, next) => {
  try {
    const { token } = socket.handshake.auth;
    const verifyResult = await verifyToken(token);

    if (!verifyResult.isSuccess) {
      next(new Error('Invalid Credentials!'));
      return;
    }
    socket.signature = verifyResult.signature;

    next();
  } catch (error) {
    logger.error('server middleware error:', error);
    next(error);
  }
};
