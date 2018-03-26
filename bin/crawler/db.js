const mongoose = require('mongoose');
const { dbname, dbuser, dbpassword } = require('./base');

// 設定狀態回應
const db = mongoose.connection;
db.on('error', err => console.error(`連結資料庫失敗: ${err}`));
db.once('open', () => console.log('成功連結資料庫。'));

// 連結資料庫
const dbURL = dbname
  .replace(/<dbuser>/, dbuser)
  .replace(/<dbpassword>/, dbpassword);
mongoose.connect(dbURL);

module.exports = mongoose;
