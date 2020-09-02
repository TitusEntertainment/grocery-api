const { getDB } = require('../../db/db');

function updateSetGenerator(input) {
  if (!input.body.name) return null;
  if (input.body.name.length < 1) return null;

  return {
    $set: { name: input.body.name },
  };
}

async function updateUser(input) {
  const updateSetData = updateSetGenerator(input);
  if (!updateSetData) return null;

  const user = await getDB().users.findOneAndUpdate(
    { _id: input.user._id },
    {
      ...updateSetData,
    },
    {
      returnOriginal: false,
    },
  );

  if (!user || user.ok !== 1 || user.value == null) return null;
  return user;
}

module.exports = { updateUser };
