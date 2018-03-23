const request = require('request');
const cheerio = require('cheerio');
const { ptt_soft_job_URL } = require('./base');
const { getPttFirstPrevpageNumber, getPttJobslist } = require('./utils');

const indexURL = ptt_soft_job_URL.replace(/<pageNumber>/, ''); // 最新的頁面沒有 pageNumber。

/**
 * 開啟最新的頁面，這個頁面有兩個任務：
 * 1. 取得到上一頁的 href，他的 href 上就會有「最新的頁面數 - 1」的數值。
 * 2. 取得該頁面上 title 資料包含 [徵才] 的列表
 *
 * 之後使用 loop 去開起每一個頁面，將資料取出並分析後加到資料庫中。
 */
request(indexURL, async (err, res, body) => {
  const prevpageNumber = await getPttFirstPrevpageNumber(body); // 取得「上頁」按鈕的 href 中 index 到 .html 中間的數值
  let newURL
  let i;

  getPttJobslist(body)

  for (i = +prevpageNumber; i > 0; i--) {
    newURL = ptt_soft_job_URL.replace(/<pageNumber>/, `${i}`);
    await request(newURL, (err, res, body) => {
      getPttJobslist(body);
    });
  }
});
