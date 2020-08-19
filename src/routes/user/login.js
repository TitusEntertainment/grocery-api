const bcrypt = require('bcrypt');
const { ERROR_BAD_REQUEST, ERROR_BAD_REQUEST_INVALID_EMAIL, ERROR_UNKNOWN_ERROR } = require('../../helpers/error.json');
const { getDB } = require('../../db/db');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) return res.status(500).send(ERROR_BAD_REQUEST);

  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!reg.test(req.body.email.trim())) return res.status(401).send(ERROR_BAD_REQUEST_INVALID_EMAIL);

  const data = await getDB().users.findOne({ email: req.body.email.trim() });
  if (!data) return res.status(400).send(ERROR_INVALID_LOGIN);

  const validatePassword = await bcrypt.compare(req.body.password.trim(), data.password);
  if (!validatePassword) return res.status(400).send(ERROR_INVALID_LOGIN);

  const token = await jwt.sign(
    {
      data: { userId: data._id },
    },
    process.env.SECRET_KEY,
    { algorithm: 'HS256', expiresIn: process.env.TOKEN_EXPIRATION || '3 days' },
  );
  if (!token || token === null) return res.status(500).send(ERROR_UNKNOWN_ERROR);

  return res.status(200).send({ ok: true, token });
});

module.exports = router;
