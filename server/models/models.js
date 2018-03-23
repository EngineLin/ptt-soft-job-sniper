const db = require('../config/db');

// 建立該資料頁面的 schema 格式
const schema = {
  prop1: String,
  prop2: Number,
  prop3: Boolean,
};
const schemaName = db.model('datapageName', schema); // 注意這個 schemaName 是一個建構子

// model 的方法的基礎範本
const fn = async obj => {
  let newOne = new schenmaName(({ prop1, prop2 } = obj)); // 將想要存的資料作為建構子的參數
  let result;
  await newOne
    .save()                        // 使用 save() 將資料存到資料庫
    .then(res => (result = res))   // res 預設是傳到資料庫的資料
    .catch(err => (result = err)); // 當失敗時跑到 catch(fn) 的 fn 中
  /* ...後續的資料處理 */
  return result
};

module.exports = {
  fn,
};
