// HackerNews API - https://github.com/HackerNews/API

// https://github.com/stefanpenner/es6-promise#auto-polyfill
require('es6-promise').polyfill();
// https://github.com/matthew-andrews/isomorphic-fetch#usage,
require('isomorphic-fetch');
// const bestStories = [];

// HN_SCORE=600 node index.js
const myScore = process.env.HN_SCORE || 50;

let i;

// const creds = require('./credentials.js');
// TODO: will be needed when it will connect to a real db

// db connect lines
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yc');
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

const jsonFetch = require('./utils').jsonFetch;
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

// TODO: user should be able to choose story score
