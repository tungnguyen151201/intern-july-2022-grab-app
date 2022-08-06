const gql = require('graphql-tag');
const _ = require('lodash');

function checkQuery(param) {
  const query = gql(param);
  const { operation, selectionSet } = query.definitions[0];

  // Not a mutation
  if (operation !== 'mutation') {
    return { status: 'passed' };
  }

  // Has not activateDriver mutation
  const activateDriverMutation = _.find(selectionSet.selections, selection => selection.name.value === 'activateDriver');
  if (!activateDriverMutation) {
    return { status: 'skip' };
  }

  // Has another mutation
  const anotherMutation = _.find(selectionSet.selections, selection => selection.name.value !== 'activateDriver');
  if (anotherMutation) {
    return { status: 'error', message: 'Invalid mutation' };
  }

  return { status: 'passed' };
}
module.exports = checkQuery;
