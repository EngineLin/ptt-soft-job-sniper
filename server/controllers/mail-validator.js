const {
  postEmailValidatorByEmail,
  getEmailValidatorByToken,
} = require('../models/mail-validator');

const postEmailValidator = async ctx => {
  const obj = ({ email } = ctx.request.body);
  let result = await postEmailValidatorByEmail(obj);
  ctx.response.body = result;
};

const getEmailValidator = async ctx => {
  const obj = ({ token } = ctx.query);
  let result = await getEmailValidatorByToken(obj);
  ctx.response.type = 'text'
  ctx.response.body = result.description;
};

module.exports = {
  postEmailValidator,
  getEmailValidator,
};
