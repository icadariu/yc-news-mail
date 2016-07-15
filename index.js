// HackerNews API - https://github.com/HackerNews/API

// https://github.com/stefanpenner/es6-promise#auto-polyfill
require('es6-promise').polyfill();
// https://github.com/matthew-andrews/isomorphic-fetch#usage,
require('isomorphic-fetch');
// const bestStories = [];
const myScore = 500;
let i;
// TODO: will be needed when i will auth to db
// const creds = require('./credentials.js');

// db connect lines
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yc');
// TODO: can't connect to remote db. i need to fix this
// mongoose.connect(`mongodb:///${creds.dbUser}:${creds.dbPass}@${creds.dbHost}/yc`);


function jsonFetch(url) {
  const opts = {
    method: 'get',
    // mode: 'cors',
    // credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, opts)
    .then((response) => {
      const { status } = response;
      if (status >= 400) {
        throw new Error(`Bad response from server with status ${status}`);
      }
      return response.json();
    });
}

const urlHN = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
const BestStoriesDB = mongoose.model('BestStories', { id: String, url: String,
  comments: String, score: Number, title: String, sent: Boolean });

jsonFetch(urlHN)
  .then((stories) => {
    for (i = 0; i < stories.length; i++) {
      const storyId = stories[i];
      const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`;
      jsonFetch(storyUrl)
        .then((storyObj) => {
          if (storyObj.score > myScore) {
            const HNurl = `https://news.ycombinator.com/item?id=${storyObj.id}`;
            /* eslint no-param-reassign: ["error", { "props": false }] */
            if (storyObj.url == null) { storyObj.url = HNurl; }
            const news = new BestStoriesDB({ id: storyObj.id, url: storyObj.url, comments: HNurl,
              score: storyObj.score, title: storyObj.title, sent: false });

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

// TODO: mail function and mark in db ids that were sent
