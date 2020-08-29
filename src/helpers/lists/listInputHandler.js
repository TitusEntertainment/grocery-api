const { ERROR_BAD_REQUEST } = require('../error.json');
const { validate: uuidValidate } = require('uuid');

const yup = require('yup');

const verifyListItems = (list) => {
  const listSchema = yup.array().of(
    yup.object().shape({
      name: yup.string().required(),
      amount: yup.number().required().positive().integer().min(1).max(parseInt(process.env.LIST_SIZE)),
    }),
  );

  try {
    listSchema.validate(list);
  } catch (error) {
    return { ok: false, ERROR_BAD_REQUEST, reason: error };
  }

  return { ok: true, error: null };
};

const verifyInvites = (invites) => {
  const inviteSchema = yup.array().of(
    yup
      .string()
      .required()
      .test((value) => uuidValidate(value)),
  );

  try {
    inviteSchema.validate(invites);
  } catch (error) {
    return { ok: false, ERROR_BAD_REQUEST, reason: error };
  }

  return { ok: true, error: null };
};

module.exports = { verifyListItems, verifyInvites };
