function getId(parent) {
  return parent._id;
}

function getFullName(parent) {
  return `${parent.lastName} ${parent.firstName}`;
}

module.exports = {
  id: getId,
  name: getFullName,
};
