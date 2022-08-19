// const { User } = require('../../models');

async function getCustomerOfTrip(parent, __, context) {
  try {
    const { dataloaders } = context;
    const customer = await dataloaders.userLoader.load(parent.customer.toString());
    return customer;
  } catch (error) {
    throw new Error(error);
  }
}

async function getDriverOfTrip(parent, __, context) {
  try {
    if (!parent.driver) return null;
    const { dataloaders } = context;
    const driver = await dataloaders.userLoader.load(parent.driver.toString());
    return driver;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getCustomerOfTrip,
  getDriverOfTrip,
};
