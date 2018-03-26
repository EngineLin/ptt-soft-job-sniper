const db = require('./db');

// set model
const Jobs = db.model('Jobs', {
  title: String,
  company: String,
  job: String,
  date: String,
  pushNum: String,
  href: String,
});
const Email = db.model('Email', {
  email: String,
});
/* ---------------- */

// if (日期不是今天則從資料庫清除)
const getJobsFromDb = async () => {
  let date = new Date();
  let result;
  await Jobs.find()
    .then(res => {
      result = res;
    })
    .catch(err => (result = null));

  const today = `${date.getMonth() + 1}/${date.getDate()}`;
  result = result.filter(job => {
    if (job.date !== today) {
      Jobs.remove({ _id: job._id })
        .then(res => console.log('成功移除不同日期的資料' + res))
        .catch(err => console.log('移除不同日期的資料失敗' + err));
      return false;
    }
    return true;
  })
  return result;
};

const getMaillist = async () => {
  let result;
  await Email.find()
    .then(res => {
      const ary = [];
      res.forEach(item => {
        ary.push(item.email);
      });
      result = ary;
    })
    .catch(err => (result = null));

  return result;
};

const saveNewJobsDataToDb = jobslist => {
  jobslist.forEach(job => {
    let newJob = new Jobs(job)
    newJob.save()
      .then(res => console.log('新工作資料成功儲存' + res))
      .catch(err => console.log('新工作資料除純錯誤' + err));
  })
}

module.exports = {
  getMaillist,
  getJobsFromDb,
  saveNewJobsDataToDb,
};
