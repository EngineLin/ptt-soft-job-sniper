# pttjobsniper

> 自動爬取 PTT soft-job 的工作機會，自動寄信給會員的平台。

## 目前進度：
* 前端輸入信箱的頁面(OK) 未深入加強畫面效果
* 後端信箱驗證系統/API (OK)
* Heroku 定時爬蟲與資料判斷功能 (OK)
* 自動寄送抓取的徵才資訊給註冊者(OK)
* Heroku 後端渲染靜態網站架設 (OK)


## Prototyping core function

1. 爬蟲 + 資料判斷 (OK)
2. 資料儲存到資料庫 (OK)
3. 當資料更新主動丟資料給使用者 (OK)
4. 使用者輸入信箱 -> 信箱判斷 (token) (OK)
5. 使用者取消註冊(資料自資料庫刪除) 未實作...

### other...
* linebot 的可能性
* 資料的渲染頁面
* 開放式資料 RESTfun API 設計

## DataBase Design
  _id: SHA-1(id),
  title: String,
  company: String,
  job: String,
  date: String,
  pushNum: String,
  href: String,
