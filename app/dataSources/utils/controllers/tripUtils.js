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

  let startDate;
  if (fromDate && !toDate) {
    startDate = { $gte: fromDate };
  } else if (!fromDate && toDate) {
    startDate = { $lt: toDate };
  } else if (fromDate && toDate) {
    startDate = { $gte: fromDate, $lt: toDate };
  }

  return { ...criteria, startDate };
}

module.exports = {
  resolveCriteria,
};
