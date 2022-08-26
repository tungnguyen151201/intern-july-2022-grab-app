const DataLoader = require('dataloader');
const { loaders } = require('../dataSources');

function createDataLoader() {
  return {
    userById: new DataLoader(ids => loaders.batchUsersById(ids)),
    tripById: new DataLoader(ids => loaders.batchTripsById(ids)),
  };
}

module.exports = createDataLoader;
