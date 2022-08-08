const gql = require('graphql-tag');
const _ = require('lodash');
const config = require('../config');

function checkQuery(param) {
  const query = gql(param);
  const { operation, selectionSet } = query.definitions[0];
  const queries = _.map(
    selectionSet.selections,
    selection => selection.name.value,
  );
  const hasOperationNotInWhiteList = _.difference(
    queries,
    operation === 'query'
      ? config.queryWhiteList
      : config.mutationWhiteList,
  );

  if (hasOperationNotInWhiteList.length > 0) {
    return false;
  }

  return true;
}
module.exports = checkQuery;
