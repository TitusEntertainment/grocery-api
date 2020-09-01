const { verifyListItems, verifyInvites } = require('./listInputHandler');
const { getDB } = require('../../db/db');

function updateSetGenerator(input) {
  const body = {};

  if (!input.body.listName || !input.body.items) return null;

  if (input.body.listName) {
    if (input.body.listName.length > 0) {
      body.listName = input.body.listName.trim();
    }
  }

  if (input.body.items.length > 0) {
    const check = verifyListItems(input.body.items);
    if (check.ok == false) return null;

    body.items = input.body.items;
  }

  if (!body.items && !body.listName) return null;

  return {
    $set: body,
  };
}

function updateAddToSetGenerator(input) {
  if (!input.body.invites) return null;

  try {
    const check = verifyInvites(input.body.invites);
    if (check.ok == false) return null;
  } catch (error) {
    console.error(error);
  }

  return {
    $addToSet: { invites: input.body.invites },
  };
}

async function updateList(input) {
  const updateSetData = updateSetGenerator(input);
  const updateAddToSetData = updateAddToSetGenerator(input);

  let list;

  if (!updateSetData && !updateAddToSetData) return null;

  if (updateSetData && updateAddToSetData) {
    list = await getDB().lists.findOneAndUpdate(
      { _id: input.body.listId, userId: input.user.data.userId },
      {
        ...updateSetData,
        ...updateAddToSetData,
      },
      {
        returnNewDocument: true,
      },
    );
  }

  if (!updateSetData || updateAddToSetData) {
    list = await getDB().lists.findOneAndUpdate(
      { _id: input.body.listId, userId: input.user.data.userId },
      {
        updateAddToSetData,
      },
      {
        returnNewDocument: true,
      },
    );
  }

  if (updateSetData || !updateAddToSetData) {
    list = await getDB().lists.findOneAndUpdate(
      { _id: input.body.listId, userId: input.user.data.userId },
      {
        updateSetData,
      },
      {
        returnOriginal: false,
      },
    );
  }

  if (!list || list.ok !== 1 || list.value == null) return null;

  return list;
}

module.exports = { updateList };
