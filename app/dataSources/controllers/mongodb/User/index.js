const query = require('./UserQuery');
const command = require('./UserCommand');
const info = require('./UserInfo');

module.exports = {
  ...query,
  ...command,
  ...info,
};
