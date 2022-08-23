// User
async function getMe(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getMe(args, context, info);
  return result;
}

async function getUsers(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getUsers(args, context, info);
  return result;
}

// Trip
async function getMyTrips(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getMyTrips(args, context, info);
  return result;
}

async function getTrips(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getTrips(args, context, info);
  return result;
}

async function getPendingTrips(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getPendingTrips(args, context, info);
  return result;
}

async function getTripById(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getTripById(args, context, info);
  return result;
}

// Room
async function getRoomById(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getRoomById(args, context, info);
  return result;
}

async function getMyRooms(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getMyRooms(args, context, info);
  return result;
}

module.exports = {
  // User
  me: getMe,
  getUsers,
  // Trip
  myTrips: getMyTrips,
  getTrips,
  getPendingTrips,
  getTripById,
  // Room
  getRoomById,
  getMyRooms,
};
