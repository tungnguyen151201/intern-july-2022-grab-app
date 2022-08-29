const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const redisClient = require('./clients');
const { getUserFromCache } = require('./user');
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

async function verifyToken(token) {
  // Check invalid token
  if (!token) {
    return { isSuccess: false, message: 'Invalid token' };
  }

  // Check token rejected
  const inBlackList = await getBlockedToken(token);
  if (inBlackList) {
    return { isSuccess: false, message: 'Token rejected' };
  }

  const { userId, exp } = jwt.verify(token, config.jwt.secretKey);

  // Caching
  const user = await getUserFromCache(userId);
  if (!user) {
    return { isSuccess: false, message: 'User not found' };
  }

  // Check if user is active
  if (user.status === 'Deactivated') {
    await setBlockedToken(token, exp);
    return { isSuccess: false, message: 'Token rejected' };
  }

  const signature = { userId, userRole: user.role, fullname: `${user.lastName} ${user.firstName}` };
  return { isSuccess: true, signature };
}

module.exports = {
  getBlockedToken,
  setBlockedToken,
  verifyToken,
};
