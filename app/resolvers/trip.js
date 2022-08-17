function getId(parent) {
  return parent._id;
}

async function getCustomer(parent, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getCustomerOfTrip(parent, args, context, info);
  return result;
}

async function getDriver(parent, args, context, info) {
  const { dataSources } = context;
  const result = await dataSources.getDriverOfTrip(parent, args, context, info);
  return result;
}

function createAt(parent) {
  if (!parent.createAt) {
    return null;
  }
  return (new Date(parent.createAt)).toString();
}

function startTime(parent) {
  if (!parent.startTime) {
    return null;
  }
  return (new Date(parent.startTime)).toString();
}

function endTime(parent) {
  if (!parent.endTime) {
    return null;
  }
  return (new Date(parent.endTime)).toString();
}

module.exports = {
  id: getId,
  customer: getCustomer,
  driver: getDriver,
  createAt,
  startTime,
  endTime,
};
