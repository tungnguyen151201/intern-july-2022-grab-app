const command = require('./TripCommand');
const query = require('./TripQuery');
const info = require('./TripInfo');

module.exports = {
  ...command,
  ...query,
  ...info,
};
