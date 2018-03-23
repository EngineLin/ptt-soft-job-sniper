const mailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { secret } = require('../config/base');

// 建立該資料頁面的 schema 格式
const schema = {
  email: String,
};
const Email = db.model('Email', schema);

/* --- POST --- */
const postEmailValidatorByEmail = async obj => {
  const emaillist = await getAllEmail();
  if (!emaillist.success)
    return { success: false, description: '讀取資料庫錯誤。' };

  const list = emaillist.emaillist;
  const email = obj.email;
  let list_i;
  for (list_i = 0; list_i < list.length; list_i += 1) {
    if (list[list_i].email === email)
      return { success: false, description: '信箱已經被申請過。' };
  }

  // 當資料庫有確實讀取現有信箱帳號 && 現有帳號與新申請的帳號沒有重複
  // 則寄送確認信給該信箱，返回成功訊息
  sendCheckmail(email);
  return { success: true, description: '確認信發送成功' };
};

const getAllEmail = async () => {
  let result;
  await Email.find()
    .then(res => (result = { success: true, emaillist: res }))
    .catch(err => (result = { success: false, emaillist: null }));
  return result;
};

const sendCheckmail = email => {
  const transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'databaseserve@gmail.com',
      pass: 'database54682',
    },
  });

  const token = jwt.sign(
    { email, exp: Math.floor(Date.now() / 1000) + 60 * 10 },
    secret
  );
  const tokenURL = 'https://localhost:3003/api/mail?token=' + token;

  const options = {
    from: 'linengine@gmail.com',
    to: email,
    subject: 'Ptt Soft_job Sniper 信箱驗證',
    html:
      "<h2>您好，這是 Ptt Soft_job Sniper 的信箱驗證信件<h2><p>請點選驗證碼，加入服務，快速獲得工作資訊： <a href='" +
      tokenURL +
      "'>您的驗證碼</a></p><p>如果您沒有加入該服務的印象，請無視該信件。</p>",
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log('確認信發送失敗: ' + err);
    } else {
      console.log('確認信發送成功: ' + info.response);
    }
  });
};
/* ------------------------------------------------ */

/* --- GET --- */
// 判斷 token 如果符合格式且在有效期間內，就將 email 存到資料庫
const getEmailValidatorByToken = async obj => {
  const token = obj.token;
  let result;
  await jwt.verify(token, secret, async (err, payload) => {
    if (err) {
      result = { success: false, description: 'Token 錯誤: ' + err };
    } else {
      const { email, exp, iat } = payload;
      let newEmail = new Email({ email });
      await newEmail
        .save()
        .then(res => {
          result = {
            success: true,
            description: '信箱已經成功註冊到資料庫中: ' + email,
          };
        })
        .catch(err => {
          result = {
            success: false,
            description: '資料庫儲存錯誤: ' + err,
          };
        });
    }
  });
  return result;
};
/* ------------------------------------------------ */

module.exports = {
  postEmailValidatorByEmail,
  getEmailValidatorByToken,
};
