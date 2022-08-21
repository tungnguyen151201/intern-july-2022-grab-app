const command = require('./TripCommand');
const query = require('./TripQuery');

module.exports = {
  ...command,
  ...query,
};
