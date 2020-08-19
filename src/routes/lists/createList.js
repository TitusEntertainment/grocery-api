const router = require('express').Router();
const { getDB } = require('../../db/db');
const { ERROR_BAD_REQUEST, ERROR_TO_LARGE_LIST, ERROR_FAILED_TO_CREATED_LIST } = require('../../helpers/error.json');
const { verifyUser } = require('../../middleware/verifyUser');
const { v4: uuidv4 } = require('uuid');

// TODO: finisish this later when user verification is done

router.post('/', verifyUser, async (req, res, next) => {
  if (!req.body || !req.body.listName || !req.body.items || !Array.isArray(req.body.items))
    return res.status(400).send({ ERROR_BAD_REQUEST, owo: 'you hit this' });

  if (req.body.items.length > 150) return res.status(400).send(ERROR_TO_LARGE_LIST);

  if (req.body.items.length < 1) {
    req.body.items.forEach((item) => {
      if (typeof item !== 'object') return res.status(400).send(ERROR_BAD_REQUEST);
    });
  }

  if (req.body.invites) {
    req.body.invites.forEach((invite) => {
      if (typeof invite !== 'string') return res.status(400).send(ERROR_BAD_REQUEST);
    });
  }

  const listId = uuidv4();
  const createdAt = new Date();
  const newList = await getDB().lists.insertOne({
    _id: listId,
    userId: req.user.data.userId,
    listName: req.body.listName.trim(),
    createdAt: createdAt,
    invites: req.body.invites || [],
    collborators: [],
    items: req.body.items || [],
  });

  if (!newList || newList.value === null) return res.status(500).send(ERROR_FAILED_TO_CREATED_LIST);

  return res.status(200).send({
    ok: true,
    list: {
      name: newList.ops[0].listName,
      items: newList.ops[0].items,
      invites: newList.ops[0].invites,
      createdAt,
    },
  });
});

module.exports = router;
