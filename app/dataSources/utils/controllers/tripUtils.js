const _ = require('lodash');
const { Trip } = require('../../models');

function resolveTime(time) {
  const { from, to } = time;

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  if (toDate) {
    toDate.setDate(toDate.getDate() + 1);
  }

  return { $gte: fromDate, $lt: toDate };
}

async function getTripsByTime(time, limit, cursor, fields) {
  const filters = { createAt: resolveTime(time) };
  if (cursor) {
    filters._id = { $lt: cursor };
  }

  const trips = await Trip.find(filters, fields)
    .sort({ _id: -1 })
    .limit(limit || 10)
    .lean();

  return trips;
}

async function getTripsByPlace(params) {
  const { trips, place, limit, cursor, fields } = params;

  if (trips) {
    return _.filter(
      trips,
      trip => trip.departure.toLowerCase().includes(place.toLowerCase())
        || trip.destination.toLowerCase().includes(place.toLowerCase()),
    );
  }

  const filters = {
    $or: [
      { departure: { $regex: place, $options: 'i' } },
      { destination: { $regex: place, $options: 'i' } },
    ],
  };
  if (cursor) {
    filters._id = { $lt: cursor };
  }

  const tripsFromDb = await Trip.find(filters, fields)
    .sort({ _id: -1 })
    .limit(limit || 10)
    .lean();

  return tripsFromDb;
}

async function getTripsByStatus(params) {
  const { trips, status, limit, cursor, fields } = params;

  if (trips) {
    return _.filter(trips, trip => trip.status === status);
  }

  const filters = { status };
  if (cursor) {
    filters._id = { $lt: cursor };
  }

  const tripsFromDb = await Trip.find(filters, fields)
    .sort({ _id: -1 })
    .limit(limit || 10)
    .lean();

  return tripsFromDb;
}

async function getAllTrips(limit, cursor, fields) {
  let filters;
  if (cursor) {
    filters = { _id: { $lt: cursor } };
  }

  const trips = await Trip.find(filters, fields)
    .sort({ _id: -1 })
    .limit(limit || 10)
    .lean();

  return trips;
}

module.exports = {
  getTripsByTime,
  getTripsByPlace,
  getTripsByStatus,
  getAllTrips,
};
