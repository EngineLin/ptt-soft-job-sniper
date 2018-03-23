const router = new require('koa-router')();
const {
  postEmailValidator,
  getEmailValidator,
} = require('../controllers/mail-validator');

// 可以使用 get、put、post、patch、delete、del
router.post('/mail', postEmailValidator);
router.get('/mail', getEmailValidator);

module.exports = router;
