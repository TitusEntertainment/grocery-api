const router = require('express').Router();
const { ERROR_BAD_REQUEST } = require('../../helpers/error.json');
const { verifyUser } = require('../../middleware/verifyUser');
const { updateList } = require('../../helpers/lists/updateGenerator');

router.post('/update', verifyUser, async (req, res, next) => {
  if (!req.body || !req.body.listId) return res.status(400).send(ERROR_BAD_REQUEST);

  const list = await updateList(req);
  if (!list) return res.status(400).send(ERROR_BAD_REQUEST);

  return res.status(200).send({
    ok: true,
    list: {
      listId: list.value._id,
      createdAt: list.value.createdAt,
      listName: list.value.listName,
      invites: list.value.invites,
      collaborators: list.value.collaborators,
      items: list.value.items,
    },
  });
});

module.exports = router;
