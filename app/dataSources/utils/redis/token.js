const crypto = require('crypto');
const redisClient = require('./clients');
const config = require('../../../config');

function hashToken(token) {
  return crypto.createHmac(config.jwt.hashAlogrithm, config.jwt.secretKey).update(token).digest('hex');
}

async function getBlockedToken(token) {
  const hashedToken = `bl_${hashToken(token)}`;
  const result = await redisClient.get(hashedToken);
  return result;
}

async function setBlockedToken(token, exprireAt) {
  const hashedToken = `bl_${hashToken(token)}`;
  await redisClient.set(hashedToken, '1');
  await redisClient.expireAt(hashedToken, exprireAt);
}

module.exports = {
  getBlockedToken,
  setBlockedToken,
};
