const { getFields } = require('../dataSources/utils');

function getId(parent) {
  return parent._id;
}

async function getUser1(parent, __, context, info) {
  try {
    const { dataloaders } = context;
    const { user1 } = parent;
    if (!user1) {
      return null;
    }

    const fields = getFields(info);
    const key = JSON.stringify({ userId: user1.toString(), fields });
    const result = await dataloaders.userById.load(key);
    return result;
  } catch (error) {
    logger.error('room - getUser1 error', error);
    throw error;
  }
}

async function getUser2(parent, __, context, info) {
  try {
    const { dataloaders } = context;
    const { user2 } = parent;
    if (!user2) {
      return null;
    }
    const fields = getFields(info);
    const key = JSON.stringify({ userId: user2.toString(), fields });
    const result = await dataloaders.userById.load(key);
    return result;
  } catch (error) {
    logger.error('room - getUser2 error', error);
    throw error;
  }
}

module.exports = {
  id: getId,
  user1: getUser1,
  user2: getUser2,
};
