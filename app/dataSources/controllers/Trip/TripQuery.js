const { Trip } = require('../../models');

async function getMyTrips(args, context) {
  const { userId, userRole } = context.signature;
  if (userRole === 'Admin') {
    return null;
  }
  try {
    const criteria = userRole === 'Customer'
      ? { ...args.criteria, customer: userId }
      : { ...args.criteria, driver: userId };
    const trips = await Trip.find(criteria).lean();
    return trips;
  } catch (error) {
    throw new Error(error);
  }
}

async function getTrips(args, context) {
  const { userRole } = context.signature;
  const { criteria } = args;
  if (userRole !== 'Admin') {
    return null;
  }
  try {
    const trips = await Trip.find(criteria).lean();
    return trips;
  } catch (error) {
    throw new Error(error);
  }
}

async function getPendingTrips(__, context) {
  const { userRole } = context.signature;
  if (userRole !== 'Driver') {
    return null;
  }
  try {
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
