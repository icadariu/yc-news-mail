require('mailgun-js');
const mGunCreds = require('./credentials.js');

const mailGunApiKey = mGunCreds.mailGunApiKey;
const mGunDomain = mGunCreds.mGunDomain;

const mailgun = require('mailgun-js')({ apiKey: mailGunApiKey, domain: mGunDomain });

const data = {
  from: `yc-news-mail <postmaster@${mGunDomain}`,
  to: 'testuser@example.com',
  subject: 'YC Best Stories',
  text: 'Best Stories ever',
};

mailgun.messages().send(data, function (error, body) {
  console.log(body);
});
