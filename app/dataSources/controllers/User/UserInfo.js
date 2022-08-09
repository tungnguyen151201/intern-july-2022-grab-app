function getFullName(parent, _args, _context, _info) {
  return `${parent.lastName} ${parent.firstName}`;
}

module.exports = {
  getFullName,
};
