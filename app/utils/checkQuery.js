const _ = require('lodash');
const gql = require('graphql-tag');
const config = require('../config');

function checkQuery(param) {
  const query = gql(param);
  const { operation, selectionSet } = query.definitions[0];
  const queries = _.map(
    selectionSet.selections,
    selection => selection.name.value,
  );

  if (queries.length === 1 && queries[0] === 'logout') {
    return 'logout';
  }

  const hasOperationNotInWhiteList = _.difference(
    queries,
    operation === 'query'
      ? config.queryWhiteList
      : config.mutationWhiteList,
  );

  if (hasOperationNotInWhiteList.length > 0) {
    return 'blocked';
  }

  return 'passed';
}
module.exports = checkQuery;
