const { getFields } = require('../dataSources/utils');

async function getUser(parent, __, context, info) {
  try {
    const { user } = parent;

    const fields = getFields(info);
    const key = JSON.stringify({ userId: user.toString(), fields });

    const { dataloaders } = context;
    const result = await dataloaders.userById.load(key);

    return result;
  } catch (error) {
    logger.error('message - getUser error:', error);
    throw error;
  }
}

function createAt(parent) {
  return (new Date(parent.createAt)).toString();
}
module.exports = {
  user: getUser,
  createAt,
};
