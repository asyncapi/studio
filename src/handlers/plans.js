const db = require('../lib/db');
const { formatList, formatRow } = require('../lib/formatter');

const plans = module.exports = {};

plans.list = async () => {
  return formatList(await db.plans.findMany());
};

plans.find = async (name) => {
  return formatRow(await db.plans.findOne({
    where: {
      name,
    },
  }));
};
