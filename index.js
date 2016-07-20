// HackerNews API - https://github.com/HackerNews/API

// https://github.com/stefanpenner/es6-promise#auto-polyfill
require('es6-promise').polyfill();
// https://github.com/matthew-andrews/isomorphic-fetch#usage,
require('isomorphic-fetch');
// see config.js for default values
const config = require('./config');

let i;

// const creds = require('./credentials.js');
// TODO: will be needed when it will connect to a real db

let mongoUrl = '';

if (process.env.NODE_ENV === 'production') {
  mongoUrl = 'mongodb://mongo/yc';
} else {
  mongoUrl = 'mongodb://localhost/yc';
}
// db connect lines
const mongoose = require('mongoose');
mongoose.connect(mongoUrl);
// mongoose.connect(`mongodb:///${creds.dbUser}:${creds.dbPass}@${creds.dbHost}/yc`);
// TODO: can't connect to remote db. i need to fix this


const urlHN = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
const BestStoriesDB = mongoose.model('BestStories', {
  id: String,
  url: String,
  comments: String,
  score: Number,
  title: String,
  sent: Boolean,
});
const myScore = config.ycScore;
const jsonFetch = require('./utils').jsonFetch;

function newsCheck() {
  jsonFetch(urlHN)
  .then((stories) => {
    for (i = 0; i < stories.length; i++) {
      const storyId = stories[i];
      const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`;
      jsonFetch(storyUrl)
      .then((storyObj) => {
        if (storyObj.score > myScore) {
          const HNurl = `https://news.ycombinator.com/item?id=${storyObj.id}`;
          const data = {
            id: storyObj.id,
            url: storyObj.url,
            comments: storyObj.url || HNurl,
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
      })
      .catch((e) => console.error(e));
    }
  })
  .catch((e) => console.error(e));
}
// program will run every hour(see config.js)
setInterval(newsCheck, config.time);
