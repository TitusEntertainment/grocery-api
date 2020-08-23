const router = require('express').Router();
const { verifyUser } = require('../../middleware/verifyUser');
const { ERROR_BAD_REQUEST } = require('../../helpers/error.json');
const { getDB } = require('../../db/db');
const { validate: uuidValidate } = require('uuid');

router.delete('/delete', verifyUser, async (req, res) => {
  if (!req.body || !req.body.listId) return res.status(400).send(ERROR_BAD_REQUEST);
  if (!uuidValidate(req.body.listId)) return res.status(400).send(ERROR_BAD_REQUEST);

  const data = await getDB().lists.deleteOne({ userId: req.user.data.userId, _id: req.body.listId.trim() });
  if (data.result.ok !== 1) return res.status(400).send(ERROR_BAD_REQUEST);
  return res.status(200).send({ ok: true });
});

module.exports = router;
