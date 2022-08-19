const { Trip } = require('../../models');
const {
  getFields,
  getTripsByPlace,
  getTripsByTime,
  getTripsByStatus,
  getAllTrips,
} = require('../../utils');

async function getMyTrips(args, context, info) {
  try {
    const { userId, userRole } = context.signature;
    if (userRole === 'Admin') {
      return null;
    }

    const { limit, cursor } = args;
    const fields = getFields(info, 'myTrips');

    const filters = userRole === 'Customer' ? { customer: userId } : { driver: userId };
    if (cursor) {
      filters._id = { $lt: cursor };
    }

    const trips = await Trip.find(filters, fields)
      .sort({ _id: -1 })
      .limit(limit || 10)
      .lean();

    return trips;
  } catch (error) {
    throw new Error(error);
  }
}

async function getTrips(args, context, info) {
  try {
    const { userRole } = context.signature;
    if (userRole !== 'Admin') {
      return null;
    }

    const { criteria, limit, cursor } = args;
    const { place, time, status } = criteria;
    const fields = getFields(info, 'getTrips');

    let trips;
    if (time) {
      trips = await getTripsByTime(time, limit, cursor, fields);
    }

    if (place) {
      const params = { trips, place, limit, cursor, fields };
      trips = await getTripsByPlace(params);
    }

    if (status) {
      const params = { trips, status, limit, cursor, fields };
      trips = await getTripsByStatus(params);
    }

    return trips || getAllTrips(limit, cursor, fields);
  } catch (error) {
    throw new Error(error);
  }
}

async function getPendingTrips(__, context) {
  try {
    const { userRole } = context.signature;
    if (userRole !== 'Driver') {
      return null;
    }

    const trips = await Trip.find({ status: 'Pending' }).lean();
    return trips;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getMyTrips,
  getTrips,
  getPendingTrips,
};
