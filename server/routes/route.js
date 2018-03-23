const router = new require('koa-router')();
const {
  /* 引入的 controller 的方法 */
  method,
} = require('../controllers/controller');

// 可以使用 get、put、post、patch、delete、del
router.get('/路由', method)

module.exports = router;
