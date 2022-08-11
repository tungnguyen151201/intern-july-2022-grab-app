const { get, set } = require('../GenericCommands');
const { hashToken } = require('../../../utils');

async function getBlockedToken(token) {
  const hashedToken = `bl_${hashToken(token)}`;
  const result = await get(hashedToken);
  return result;
}

function setBlockedToken(token, keyExp) {
  const hashedToken = `bl_${hashToken(token)}`;
  set(hashedToken, 'value', keyExp);
}

module.exports = {
  getBlockedToken,
  setBlockedToken,
};
