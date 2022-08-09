const queryWhiteList = [
  '__schema',
  '__type',
  '__typeKind',
  '__field',
  '__inputValue',
  '__enumValue',
  '__directive',
];

const mutationWhiteList = ['signUp', 'login'];

module.exports = { queryWhiteList, mutationWhiteList };
