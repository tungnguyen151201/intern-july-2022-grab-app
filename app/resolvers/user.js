function getFullName(parent, args, context, info) {
  const { dataSources } = context;
  const result = dataSources.getFullName(parent, args, context, info);
  return result;
}

module.exports = {
  name: getFullName,
};
