const request = require('request');
const cheerio = require('cheerio');
const { ptt_soft_job_URL } = require('./base');

/**
 * 這個頁面有四個任務：
 * 1. 取得到上一頁的 href，他的 href 上就會有「最新的頁面數 - 1」的數值。
 * 2. 取得該頁面上 title 資料包含 [徵才] 的列表
 * 3. 判斷資料中有日期不是當天的資料後停止爬取、同時清除非當天的資料
 * 4. 回傳資料陣列
 */
const getJobs = async () => {
  const indexURL = ptt_soft_job_URL.replace(/<pageNumber>/, ''); // 最新的頁面沒有 pageNumber。
  let prevpageNumber;
  let result = [];
  let jobslist = await getJobsFormCurrentPage(indexURL);
  if (jobslist === null) return null

  do {
    nextURL = ptt_soft_job_URL.replace(/<pageNumber>/, jobslist.prevpageNumber);
    result = [...result, ...jobslist.list];
    jobslist = await getJobsFormCurrentPage(nextURL);
  } while (!jobslist.hasOtherDate || jobslist === null);
  return result;
};

const getJobsFormCurrentPage = async url => {
  let result = await new Promise((resolve, reject) => {
    request(url, async (err, res, body) => {
      if (err) return reject(err);

      const prevpageNumber = await getPttFirstPrevpageNumber(body); // 取得「上頁」按鈕的 href 中 index 到 .html 中間的數值
      const jobslist = await getPttJobslist(body);
      if (jobslist === null) return null;

      const regex = /(.*)\/(.*)/;
      const date = new Date();
      const today = [date.getMonth() + 1, date.getDate()];
      const datelist = jobslist.map(job => job.date.match(regex));

      let result = {};
      let hasOtherDate = false;
      datelist.forEach(date => {
        if (date[1] !== today[0] || date[2] !== today[1]) {
          hasOtherDate = true;
        }
      });
      result.hasOtherDate = hasOtherDate ? true : false;
      result.prevpageNumber = hasOtherDate ? prevpageNumber : null;
      result.list = jobslist.filter(job => job.date === `${date.getMonth() + 1}/${date.getDate()}`);
      resolve(result);
    });
  });
  return result;
};

/**
 * 取得「上頁」按鈕的 href 中 index 到 .html 中間的數值
 */
const getPttFirstPrevpageNumber = body => {
  const $ = cheerio.load(body);
  const regex = /index(.*\d)\.html/;
  const href = $('.action-bar')
    .find('a')
    .eq(3)
    .attr('href');
  const prevpageNumber = regex.exec(href)[1];
  return prevpageNumber;
};

/**
 * 取得當前頁面上 title 包含 [徵才] 字串的 title 、 href 、 日期 與 推文數
 * 存到 Database 裡面。
 */
const getPttJobslist = body => {
  const $ = cheerio.load(body);
  const regex = /\[徵才\]/;
  const regex_company_and_job = /\[徵才\](.*)徵+(.*)/;
  const result = [];

  $('.r-ent .title a').each((index, el) => {
    const title = $(el).text();
    if (regex.test(title)) {
      const href = $(el).attr('href');
      const r_ent = $(el)
        .parent()
        .parent();
      const ary = regex_company_and_job.exec(title); // 當不成功時會返回 null
      const company = ary ? ary[1].replace(/誠/, '').trim() : null; // 去掉 regex 無法避免的「誠」字
      const job = ary ? ary[2].trim() : null;
      const date = r_ent
        .find('.meta .date')
        .text()
        .trim();
      const pushNum = r_ent.find('.nrec .f2').text();
      result.push({ title, company, job, date, pushNum, href });
    }
  });
  return result.length !== 0 ? result : null;
};

module.exports = {
  getJobs,
};
