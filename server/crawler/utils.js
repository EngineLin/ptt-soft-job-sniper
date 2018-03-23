const cheerio = require('cheerio');
const db = require('../config/db');
const Jobs = db.model('Jobs', {
  title: String,
  company: String,
  job: String,
  date: String,
  pushNum: String,
  href: String,
});

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

  $('.r-ent .title a').each((index, el) => {
    const title = $(el).text();
    const href = $(el).attr('href');
    if (regex.test(title)) {
      const r_ent = $(el)
        .parent()
        .parent();
      const ary = regex_company_and_job.exec(title); // 當不成功時會返回 null
      const company = ary ? ary[1].replace(/誠/, '').trim() : null; // 去掉 regex 無法避免的「誠」字
      const job = ary ? ary[2].trim() : null;
      const date = r_ent.find('.meta .date').text();
      const pushNum = r_ent.find('.nrec .f2').text();
      let newJob = new Jobs({ title, company, job, date, pushNum, href });
      newJob
        .save()
        .then(res => console.log('success'))
        .catch(err => console.log('error:' + err));
    }
  });
};

module.exports = {
  getPttFirstPrevpageNumber,
  getPttJobslist,
};
