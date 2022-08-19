function getId(parent) {
  return parent._id;
}

async function getCustomer(parent, args, context, info) {
  try {
    const { dataloaders } = context;
    const { customer } = parent;
    if (!customer) {
      return null;
    }
    const result = await dataloaders.userById.load(customer.toString());
    return result;
  } catch (error) {
    logger.error('trip - getCustomer error', error);
    throw error;
  }
}

async function getDriver(parent, args, context, info) {
  try {
    const { dataloaders } = context;
    const { driver } = parent;
    if (!driver) {
      return null;
    }
    const result = await dataloaders.userById.load(driver.toString());
    return result;
  } catch (error) {
    logger.error('trip - getDriver error', error);
    throw error;
  }
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
