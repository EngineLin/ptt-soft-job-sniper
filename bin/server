const mailer = require('nodemailer');
const { baseURL } = require('./crawler/base')
const {
  getMaillist,
  getJobsFromDb,
  saveNewJobsDataToDb
} = require('./crawler/utils');
const { getJobs } = require('./crawler/getJobs');

/**
 * 流程：
 * 1. getJobs
 * 2. if (沒有資料則 return)
 * 3. getJobsFromDb
 * 5. 核對非重複部分
 * 6. 非重複部分存進資料庫
 * 7. getMaillist
 * 8. 非同步部分寄送給 maillist 所有人
 */
(async () => {
  const jobsFromCrawler = await getJobs(); // 得到一個陣列，包含當日所有徵才訊息
  if (jobsFromCrawler === null) return // 如果這個小時沒有新工作資訊，則返回不做任何動作

  const jobsFromDb = await getJobsFromDb();

  // 核對非重複部分
  const jobslist = jobsFromCrawler.filter(jobFromCrawler => { 
    let hasSameData = false ;
    jobsFromDb.forEach(jobFromDb => {
      if (jobFromDb.href === jobFromCrawler.href) {
        hasSameData = true;
      }
    });
    return !hasSameData
  })

  if (jobslist.length === 0) return //比對之後沒有新工作資料，則返回不動作

  // 非重複部分存進資料庫
  saveNewJobsDataToDb(jobslist)

  let jobsContent = ''
  jobslist.forEach(job => {
    jobsContent += `<li><a href='${baseURL}${job.href}' target='_black'>${job.title}</a></li>`;
  })


  // 確認有新的工作資訊後，先將資料庫內的 mail 列表 (Array) 提取出來
  // 然後發送相同的消息給所有人。
  const maillist = await getMaillist();
  if (!maillist) return; // 如果提取資料庫的 mail 出錯則返回。

  const transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'databaseserve@gmail.com',
      pass: 'database54682',
    },
  });

  let date = new Date();
  const time = `${date.getFullYear()} / ${date.getMonth()} / ${date.getDate()}  ${date.getHours()}:${date.getSeconds()}`;
  maillist.forEach(mail => {
    const options = {
      from: 'databaseserve@gmail.com',
      to: mail,
      subject: `Ptt Soft_job Sniper : 最新工作消息 (${time})`,
      html: `
        <h2>您好，這是 Ptt Soft_job Sniper 的工作資訊通知<h2>
        <p>時間: ${time}</p>
        <p>工作資訊：</p>
        <ol>
        ${jobsContent}
        </o;>
      `,
    };

    transporter.sendMail(options, (err, info) => {
      if (err) {
        console.log(`確認信發送失敗: ${err} /${mail}`);
      } else {
        console.log(`確認信發送成功: ${info.response} /${mail}`);
      }
    });
  });
})();
