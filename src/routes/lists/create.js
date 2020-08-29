const router = require('express').Router();
const { getDB } = require('../../db/db');
const {
  ERROR_BAD_REQUEST,
  ERROR_TO_LARGE_LIST,
  ERROR_FAILED_TO_CREATED_LIST,
  ERROR_CANNOT_FIND_USER,
} = require('../../helpers/error.json');
const { verifyUser } = require('../../middleware/verifyUser');
const { v4: uuidv4 } = require('uuid');
const { verifyListItems } = require('../../helpers/lists/listInputHandler');

router.post('/create', verifyUser, async (req, res) => {
  if (!req.body || !req.body.listName || !req.body.items || !Array.isArray(req.body.items))
    return res.status(400).send({ ERROR_BAD_REQUEST });

  if (req.body.items.length > parseInt(process.env.LIST_SIZE)) return res.status(400).send(ERROR_TO_LARGE_LIST);

  if (req.body.items.length > 0) {
    const check = verifyListItems(req.body.items);
    if (check.ok == false) return res.status(check.error.error_code).send(check.error);
  }

  if (req.body.invites) {
    req.body.invites.forEach((invite) => {
      if (typeof invite !== 'string') return res.status(400).send(ERROR_BAD_REQUEST);
    });
  }

  const listId = uuidv4();
  const user = await getDB().users.findOneAndUpdate(
    {
      _id: req.user.data.userId,
    },
    {
      $addToSet: {
        lists: listId,
      },
    },
  );

  if (user.ok !== 1) return res.status(500).send(ERROR_CANNOT_FIND_USER);

  const createdAt = new Date();
  const newList = await getDB().lists.insertOne({
    _id: listId,
    userId: req.user.data.userId,
    listName: req.body.listName.trim(),
    createdAt,
    invites: req.body.invites || [],
    collborators: [],
    items: req.body.items || [],
  });

  if (!newList || newList.value === null) return res.status(500).send(ERROR_FAILED_TO_CREATED_LIST);

  return res.status(200).send({
    ok: true,
    list: {
      _id: newList.ops[0]._id,
      name: newList.ops[0].listName,
      items: newList.ops[0].items,
      invites: newList.ops[0].invites,
      createdAt,
    },
  });
});

module.exports = router;
