const {
  // 引入的 model 的方法
  method,
} = require('../models/model');

// controller 的方法的基礎範本
const fn = async ctx => {
  // 利用物件解構賦值的方式，只拿想要的數值
  const obj = ({ query1, query2 } = ctx.query);            // 當 router 的行為是 get 的時候抓值的方法
  const obj = ({ request1, request2 } = ctx.request.body); // 當 router 的行為是 post 的時候抓值的方法
  let result = await method(obj);                          // 將取得的值丟到 model 的方法中取得回傳值
  /* ...後續的資料處理 */
  return result;
};

module.export = {
  fn,
};
