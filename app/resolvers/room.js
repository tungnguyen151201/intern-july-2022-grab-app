const { getFields } = require('../dataSources/utils');

function getId(parent) {
  return parent._id;
}

async function getTrip(parent, __, context, info) {
  try {
    const { trip } = parent;
    if (!trip) {
      return null;
    }

    const fields = getFields(info);
    const key = JSON.stringify({ tripId: trip.toString(), fields });

    const { dataloaders } = context;
    const result = await dataloaders.tripById.load(key);

    return result;
  } catch (error) {
    logger.error('trip - getTrip error:', error);
    throw error;
  }
}

function getUsers(parent, __, context, info) {
  try {
    const { users } = parent;

    const { dataloaders } = context;
    const fields = getFields(info);

    const result = users.map(async user => {
      const key = JSON.stringify({ userId: user.toString(), fields });
      const userInfo = await dataloaders.userById.load(key);
      return userInfo;
    });

    return result;
  } catch (error) {
    logger.error('room - getUsers error:', error);
    throw error;
  }
}

module.exports = {
  id: getId,
  trip: getTrip,
  users: getUsers,
};
