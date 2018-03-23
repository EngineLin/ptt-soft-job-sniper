// Koa 文件的入口
const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json');                               // 當回傳資料 ctx.body = {} 是物件的時候，自動轉成 JSON 格式。
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');                   // 加入這個插件，使 koa-router 在接收 post 的行為時接收資料成為可能。
const serve = require('koa-static');                            // 用來使用 Koa 丟出 Vue 轉譯完的靜態檔案。
const historyApiFallback = require('koa-history-api-fallback'); // 當 Vue 使用 mode: 'history' 的模式時，這個插件可以避免路由轉換出現問題。
const path = require('path');

/* -------- 引入所有的 API 路由 -------- */
const Mail = require('./server/routes/mail');
/* ------------------------------------ */

let router = new Router();
let app = new Koa();
app.use(logger());
app.use(json());
app.use(bodyParser());

// 讓所有路由開始前與結束後都跑到這裡(以 await next() 為分水嶺)，可以記錄路由花費的時間。
app.use(async (ctx, next) => {
  let start = new Date();
  await next();
  let ms = new Date() - start;
  console.log('%s %s - $s', ctx.method, ctx.url, ms);
});

/* -------- 架設所有的 API 路由 -------- */
router.use('/api', Mail.routes());
/* ------------------------------------ */

app.use(router.routes());
app.use(historyApiFallback());
app.use(serve(path.join(__dirname, 'dist')));

app.on('error', err => console.log(`伺服器開啟錯誤: ${err}`));
module.exports = app.listen(process.env.PORT || 3003, () =>
  console.log('伺服器已經成功開啟。')
);
