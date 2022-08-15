const { User } = require('../../models');

async function getCustomerOfTrip(parent) {
  try {
    const customer = await User.findById(parent.customer);
    return customer;
  } catch (error) {
    throw new Error(error);
  }
}

async function getDriverOfTrip(parent) {
  try {
    const driver = await User.findById(parent.driver);
    return driver;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getCustomerOfTrip,
  getDriverOfTrip,
};
