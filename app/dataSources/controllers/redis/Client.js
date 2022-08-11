const redis = require('redis');

const redisClient = redis.createClient();
global.redisIsReady = false;

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    throw new Error(error);
  }
})();

redisClient.on('ready', () => { global.redisIsReady = true; });
redisClient.on('error', () => { global.redisIsReady = false; });

module.exports = redisClient;
