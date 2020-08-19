const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const {
  ERROR_BAD_REQUEST,
  ERROR_EMAIL_ALREADY_EXISTS,
  ERROR_BAD_REQUEST_INVALID_EMAIL,
  ERROR_FAILED_TO_CREATED_USER,
} = require('../../helpers/error.json');
const { getDB } = require('../../db/db');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/', async (req, res, next) => {
  if (!req.body || !req.body.name || !req.body.password || !req.body.email || req.body.password.trim().length < 6)
    return res.status(400).send(ERROR_BAD_REQUEST);

  let { email, password, name } = req.body;

  email = email.trim();
  password = password.trim();
  name = name.trim();

  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!reg.test(req.body.email)) return res.status(400).send(ERROR_BAD_REQUEST_INVALID_EMAIL);

  const data = await getDB().users.findOne({ email });
  if (data) return res.status(400).send(ERROR_EMAIL_ALREADY_EXISTS);

  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 6;
  const saltedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newId = uuidv4();
  const today = new Date();
  const newUser = await getDB().users.insertOne({
    email,
    _id: newId,
    name,
    password: saltedPassword,
    createdAt: today,
  });

  if (!newUser || newUser.value === null) return res.status(500).send(ERROR_FAILED_TO_CREATED_USER);

  const token = await jwt.sign(
    {
      data: { userId: newId },
    },
    process.env.SECRET_KEY,
    { algorithm: 'HS256', expiresIn: process.env.TOKEN_EXPIRATION || '3 days' },
  );
  if (!token || token === null) return res.status(500).send(ERROR_UNKNOWN_ERROR);

  return res.status(200).send({ ok: true, token, message: `Welcome ${name}, we're glad to have you with us!` });
});

module.exports = router;
