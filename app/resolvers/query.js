async function getMe(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getMe(args, context, info);
  return result;
}

async function getUsers(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getUsersWithCriteria(args, context, info);
  return result;
}

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
module.exports = {
  me: getMe,
  getUsers,
  myTrips: getMyTrips,
  getTrips,
  getPendingTrips,
};
