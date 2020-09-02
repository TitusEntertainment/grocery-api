const { getDB } = require('../../../db/db');

async function getUser(_id) {
  const user = await getDB().users.findOne({ _id });
  if (!user || user.ok !== 1 || user.value == null) return null;

  return user;
}

module.exports = { getUser };
