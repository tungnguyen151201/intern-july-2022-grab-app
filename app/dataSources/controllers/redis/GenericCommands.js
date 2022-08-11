const redisClient = require('./Client');

async function get(key) {
  if (!global.redisIsReady) {
    throw new Error('redis connect failed');
  }
  if (!key) {
    return null;
  }
  try {
    const token = await redisClient.get(key);
    return token;
  } catch (error) {
    throw new Error(error);
  }
}
function set(key, value, keyExp) {
  if (!global.redisIsReady) {
    throw new Error('redis connect failed');
  }
  if (!key || !value) {
    return;
  }
  try {
    redisClient.set(key, value);
    if (keyExp) {
      redisClient.expireAt(key, keyExp);
    }
  } catch (error) {
    throw new Error(error);
  }
}

async function getExpireTime(key) {
  if (!global.redisIsReady) {
    throw new Error('redis connect failed');
  }
  if (!key) {
    return null;
  }
  try {
    const result = await redisClient.expireTime(key);
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

function deleteKey(key) {
  if (!global.redisIsReady) {
    throw new Error('redis connect failed');
  }
  try {
    redisClient.del(key);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  get,
  set,
  getExpireTime,
  deleteKey,
};
