function resolveCriteria(criteria) {
  const { from, to } = criteria;

  if (!from && !to) {
    return criteria;
  }

  const fromDate = from ? new Date(from) : null;
  const toDate = to ? new Date(to) : null;

  if (toDate) {
    toDate.setDate(toDate.getDate() + 1);
  }

  let createAt;
  if (fromDate && !toDate) {
    createAt = { $gte: fromDate };
  } else if (!fromDate && toDate) {
    createAt = { $lt: toDate };
  } else if (fromDate && toDate) {
    createAt = { $gte: fromDate, $lt: toDate };
  }

  return { ...criteria, createAt };
}

module.exports = {
  resolveCriteria,
};
