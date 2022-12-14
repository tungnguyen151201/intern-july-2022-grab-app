// User
async function signUp(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.signUp(args, context, info);
  return result;
}

async function login(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.login(args, context, info);
  return result;
}

async function activateDriver(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.activateDriver(args, context, info);
  return result;
}

async function logout(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.logout(args, context, info);
  return result;
}

// Trip
async function createTrip(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.createTrip(args, context, info);
  return result;
}

async function acceptTrip(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.acceptTrip(args, context, info);
  return result;
}

async function startTrip(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.startTrip(args, context, info);
  return result;
}

async function finishTrip(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.finishTrip(args, context, info);
  return result;
}

async function cancelTrip(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.cancelTrip(args, context, info);
  return result;
}

// Room chat
async function createChatRoom(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.createChatRoom(args, context, info);
  return result;
}

module.exports = {
  // User
  signUp,
  login,
  activateDriver,
  logout,
  // Trip
  createTrip,
  acceptTrip,
  startTrip,
  finishTrip,
  cancelTrip,
  // Room chat
  createChatRoom,
};
