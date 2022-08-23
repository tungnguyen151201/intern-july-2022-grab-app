const command = require('./RoomCommand');
const query = require('./RoomQuery');

module.exports = {
  ...command,
  ...query,
};
