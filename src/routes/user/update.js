const router = require('express').Router();
const { ERROR_BAD_REQUEST } = require('../../helpers/error.json');
const { verifyUser } = require('../../middleware/verifyUser');
const { updateUser } = require('../../helpers/user/updateGenerator');

router.post('/update', verifyUser, async (req, res, next) => {
  if (!req.body) return res.status(400).send(ERROR_BAD_REQUEST);

  const user = await updateUser(req);
  if (!user) return res.status(400).send(ERROR_BAD_REQUEST);

  return res.status(200).send({
    ok: true,
    user: {
      user: user.value.name,
      createdAt: user.value.createdAt,
      lists: user.value.lists,
    },
  });
});

module.exports = router;
