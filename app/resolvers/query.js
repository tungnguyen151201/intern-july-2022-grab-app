async function getMe(__, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getUserById(args, context, info);
  return result;
}

module.exports = {
  me: getMe,
};
