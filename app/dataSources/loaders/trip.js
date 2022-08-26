const _ = require('lodash');
const { Trip } = require('../models');

async function batchTripsById(keys) {
  const tripIds = keys.map(key => JSON.parse(key).tripId);
  let fields = _.flatMap(keys, key => JSON.parse(key).fields?.split(' '));
  fields = _.uniq(fields).join(' ');

  const trips = await Trip.find(
    {
      _id: { $in: tripIds },
    },
    fields,
  ).lean();

  return tripIds.map(tripId => trips.find(trip => trip._id.toString() === tripId));
}

module.exports = {
  batchTripsById,
};
