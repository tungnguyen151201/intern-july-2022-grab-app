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
module.exports = {
  signUp,
  login,
  activateDriver,
};
