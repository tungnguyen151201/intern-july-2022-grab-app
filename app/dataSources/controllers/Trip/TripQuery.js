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
    const fields = getFields(info);

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
    logger.error('TripQuery - getMyTrips error:', error);
    throw error;
  }
}

async function getTrips(args, context, info) {
  try {
    const { userRole } = context.signature;
    if (userRole !== 'Admin') {
      return null;
    }

    const fields = getFields(info);
    const { criteria, limit, cursor } = args;

    if (!criteria) {
      return getAllTrips(limit, cursor, fields);
    }

    const { place, time, status } = criteria;

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
    logger.error('TripQuery - getMyTrips error:', error);
    throw error;
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
    logger.error('TripQuery - getPendingTrips error:', error);
    throw error;
  }
}

async function getTripById(args, context, info) {
  try {
    const { userRole } = context.signature;
    if (userRole !== 'Admin') {
      return null;
    }

    const { id } = args;
    const fields = getFields(info);
    const trip = await Trip.findById(id, fields).lean();

    return trip;
  } catch (error) {
    logger.error('TripQuery - getTripById error:', error);
    throw error;
  }
}
module.exports = {
  getMyTrips,
  getTrips,
  getPendingTrips,
  getTripById,
};
