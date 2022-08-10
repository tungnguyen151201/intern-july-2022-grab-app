const crypto = require('crypto');
const config = require('../../../config');

function hashToken(token) {
  return crypto.createHmac(config.jwt.hashAlogrithm, config.jwt.secretKey).update(token).digest('hex');
}

module.exports = {
  hashToken,
};
