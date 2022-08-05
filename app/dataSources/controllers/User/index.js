const query = require('./UserQuery');
const command = require('./UserCommand');

module.exports = {
  ...query,
  ...command,
};
