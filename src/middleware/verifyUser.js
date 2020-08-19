const { ERROR_NOT_LOGGED_IN, ERROR_INVALID_TOKEN } = require('../helpers/error.json');
const jwt = require('jsonwebtoken');

/// Check's authHeader with template Bearer token and validates the token
/// If the the format is invalid we send ERROR_INVALID_TOKEN or if there isn't any token we send ERROR_NOT_LOGGED_IN
/// Otherwise we simply go ahead and verify the token and attach it to req.user
/// Should look like something below
/// { data: { userId: 'really-long-uuid-v4-token' },
/// iat: 1597848734,
/// exp: 1598107934
/// }

const verifyUser = async (req, res, next) => {
  const authHeader = req.header('Authorization').split(' ');
  if (!authHeader[1] || authHeader[1].length < 6) return res.status(401).send(ERROR_NOT_LOGGED_IN);

  if (authHeader[0] !== 'Bearer') return res.status(400).send(ERROR_INVALID_AUTHORIZATION_HEADER);
  const token = authHeader[1];

  try {
    const isValidToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = isValidToken;
    console.log(req.user);
    next();
  } catch (error) {
    console.error(error);
    return res.stauts(400).send(ERROR_INVALID_TOKEN);
  }
  return undefined;
};

module.exports = { verifyUser };
