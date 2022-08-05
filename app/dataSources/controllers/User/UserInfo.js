function getFullName(parent, args, context, info) {
  return `${parent.lastName} ${parent.firstName}`;
}

module.exports = {
  getFullName,
};
