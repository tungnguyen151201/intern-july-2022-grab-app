function getFullName(parent) {
  return `${parent.lastName} ${parent.firstName}`;
}

module.exports = {
  name: getFullName,
};
