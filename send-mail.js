require('mailgun-js');
const mGunCreds = require('./credentials.js');
const mailGunApiKey = mGunCreds.mailGunApiKey;
const mGunDomain = mGunCreds.mGunDomain;
const emailAddress = mGunCreds.emailAddress;
const mailgun = require('mailgun-js')({ apiKey: mailGunApiKey, domain: mGunDomain });

let mongoUrl = '';

if (process.env.NODE_ENV === 'production') {
  mongoUrl = 'mongodb://mongo/yc';
} else {
  mongoUrl = 'mongodb://localhost/yc';
}
// db connect lines
const mongoose = require('mongoose');
mongoose.connect(mongoUrl);

//const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/yc');

const BestStoriesDB = mongoose.model('BestStories', { id: String, url: String,
  comments: String, score: Number, title: String, sent: Boolean });

BestStoriesDB.find({ sent: false }, function (err, news) {
  let stories = '';
  for (let i = 0; i < news.length; i++) {
    const element = news[i];
    stories += `
    ${element.title}
    URL ---> ${element.url}
    Comments ---> ${element.comments}
    Score ---> ${element.score}

    =========================================`;
    element.sent = true;
    element.save();
  }

  const data = {
    from: `yc-news-mail <postmaster@${mGunDomain}>`,
    to: `${emailAddress}`,
    subject: 'YC Great Stories',
    text: `${stories}`,
  };

  mailgun.messages().send(data, function (error, body) {
    // console.log(error);
  });
});
