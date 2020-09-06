const { ERROR_BAD_REQUEST, ERROR_UNKNOWN_ERROR } = require('../../helpers/error.json');
const router = require('express').Router();
const { verifyUser } = require('../../middleware/verifyUser');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const { getDB } = require('../../db/db');

router.post('/friendRequest', verifyUser, async (req, res) => {
  if (!req.body.followUserId || !uuidValidate(req.body.followUserId)) return res.status(400).send(ERROR_BAD_REQUEST);

  const alreadyExists = await getDB().friendReq.findOne({
    initiator: req.user._id,
    toBeFollowed: req.body.followUserId,
  });

  if (alreadyExists !== null) return res.status(ERROR_BAD_REQUEST.error_code).send(ERROR_BAD_REQUEST);

  const frId = uuidv4();
  const today = new Date();

  const friendRequest = await getDB().friendReq.insertOne({
    _id: frId,
    initiator: req.user._id,
    toBeFollowed: req.body.followUserId,
    createdAt: today,
  });

  if (!friendRequest || friendRequest.result.ok !== 1) return res.status(500).send(ERROR_UNKNOWN_ERROR);
  return res.status(200).send({
    ok: true,
    data: {
      ...friendRequest.ops[0],
    },
  });
});

module.exports = router;
