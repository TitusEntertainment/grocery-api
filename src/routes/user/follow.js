const { getUser } = require('../../helpers/user/getUser');
const { ERROR_BAD_REQUEST } = require('../../helpers/error.json');
const router = require('express').Router();
const { verifyUser } = require('../../middleware/verifyUser');

// TODO: Figure out flow here

router.post('/follow', verifyUser, async (req, res) => {
  if (!req.body.followUserId) return res.status(400).send(ERROR_BAD_REQUEST);

  const user = await getUser(req.data.userId);
  if (!user) return res.status(400).send(ERROR_BAD_REQUEST);

  const toFollow = await getUser(req.body.followUserId);
  if (!toFollow) return res.status(400).send(ERROR_BAD_REQUEST);
});
