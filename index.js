// one function for grabbig news + insert in db and one for sending mail
// HackerNews API - https://github.com/HackerNews/API
// https://github.com/stefanpenner/es6-promise#auto-polyfill
// https://github.com/matthew-andrews/isomorphic-fetch#usage,

require('es6-promise').polyfill();
require('isomorphic-fetch');
// see config.js for default values
const config = require('./config');

let mongoUrl = '';

if (process.env.NODE_ENV === 'production') {
  mongoUrl = 'mongodb://mongo/yc';
} else {
  mongoUrl = 'mongodb://localhost/yc';
}
const mongoose = require('mongoose');
mongoose.connect(mongoUrl);


const urlHN = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
const BestStoriesDB = mongoose.model('BestStories', {
  id: String,
  url: String,
  comments: String, score: Number,
  title: String,
  sent: Boolean,
});
const myScore = config.ycScore;
const jsonFetch = require('./utils').jsonFetch;

let i;
eachLimit = require('async/eachLimit');

newsid = function(item, cb) {
  console.log("Item -> ", item);
  const storyId = item;
  const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`;
  jsonFetch(storyUrl)
  .then((storyObj) => {
    if (storyObj.score > myScore) {
      // Comments URL also used in case URL points to YC site
      const HNurl = `https://news.ycombinator.com/item?id=${storyObj.id}`;
      const data = {
        id: storyObj.id,
        url: storyObj.url || HNurl,
        comments: HNurl,
        score: storyObj.score,
        title: storyObj.title,
        sent: false,
        };
      const news = new BestStoriesDB(data);
      BestStoriesDB.findOne({ id: storyObj.id }, function (err, obj) {
        if (obj == null) {
          news.save();
        }
      });
    }
    cb()
  })
.catch((e) => console.error(e));
}

finished = function() {
  console.log('DONE!');
}

function newsCheck() {
  jsonFetch(urlHN)
  .then((stories) => {
    console.log("Stories length -> ", stories.length)
    eachLimit(stories, 2, newsid, finished)
  })
  .catch((e) => console.error(e));
}
// see config.js for the correct interval this app will check for news
setInterval(newsCheck, config.ycCheck);

// const ycMail = require('./send-mail');
require('mailgun-js');
const mGunCreds = require('./credentials.js');
const mailGunApiKey = mGunCreds.mailGunApiKey;
const mGunDomain = mGunCreds.mGunDomain;
const emailAddress = mGunCreds.emailAddress;
const mailgun = require('mailgun-js')({ apiKey: mailGunApiKey, domain: mGunDomain });

function mailSend() {
  BestStoriesDB.find({ sent: false }, function (err, news) {
    let stories = '';
    for (let j = 0; j < news.length; j++) {
      const element = news[j];
      stories += `
      ${element.title}
      URL ---> ${element.url}
      Comments ---> ${element.comments}
      Score: ${element.score}

      =========================================`;
      element.sent = true;
      element.save();
    }

    const data = {
      from: `yc-news-mail <postmaster@${mGunDomain}>`,
      to: `${emailAddress}`,
      subject: 'YC Greatest Stories',
      text: `${stories}`,
    };

    mailgun.messages().send(data, function (error, body) {
      // console.log(error);
    });
  });
}
const schedule = require('node-schedule');
schedule.scheduleJob(config.ycSendMorning, mailSend);
schedule.scheduleJob(config.ycSendNoon, mailSend);
schedule.scheduleJob(config.ycSendEvening, mailSend);
//mailSend();
