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

async function setBlockedToken(token, expireAt) {
  const hashedToken = `bl_${hashToken(token)}`;
  await redisClient.set(hashedToken, '1');
  await redisClient.expireAt(hashedToken, expireAt);
}

async function getSocketIdToken(token) {
  const hashedToken = `sk_${hashToken(token)}`;
  const result = await redisClient.get(hashedToken);
  return result;
}

async function setSocketIdToken(token, socketId, expireAt) {
  const hashedToken = `sk_${hashToken(token)}`;
  await redisClient.set(hashedToken, socketId);
  await redisClient.expireAt(hashedToken, expireAt);
}

module.exports = {
  getBlockedToken,
  setBlockedToken,
  getSocketIdToken,
  setSocketIdToken,
};
