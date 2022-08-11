async function getMe(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getUserById(args, context, info);
  return result;
}

async function getUsers(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getUsersWithCriteria(args, context, info);
  return result;
}
module.exports = {
  me: getMe,
  getUsers,
};
