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

function startDate(parent) {
  if (!parent.startDate) {
    return null;
  }
  return (new Date(parent.startDate)).toString();
}

function endDate(parent) {
  if (!parent.endDate) {
    return null;
  }
  return (new Date(parent.endDate)).toString();
}

module.exports = {
  id: getId,
  customer: getCustomer,
  driver: getDriver,
  startDate,
  endDate,
};
