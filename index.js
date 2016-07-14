// HackerNews API - https://github.com/HackerNews/API

// https://github.com/stefanpenner/es6-promise#auto-polyfill
require('es6-promise').polyfill();
// https://github.com/matthew-andrews/isomorphic-fetch#usage,
require('isomorphic-fetch');
// const bestStories = [];
const rating = 50;
let i;
const creds = require('./credentials.js');

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
          if (storyObj.score > rating) {
            const HNurl = `https://news.ycombinator.com/item?id=${storyObj.id}`;
            /* eslint no-param-reassign: ["error", { "props": false }] */
            if (storyObj.url == null) { storyObj.url = HNurl; }

            const news = new BestStoriesDB({ id: storyObj.id, url: storyObj.url, comments: HNurl,
              score: storyObj.score, title: storyObj.title, sent: false });
            // news.save();
            news.save(function errs(err) {
              if (err) { console.log(err); }
            });
          }
        })
        .catch((e) => console.error(e));
    }
  })
  .catch((e) => console.error(e));

// TODO: in case the id is already in db don't insert it again
// TODO: mail function and mark in db ids that were sent

// db.beststories.find({"url": {$exists:false}});
// db.beststories.find({"id": "12030863"});
// how to update db in order to avoid creating duplicates
// TweetsModel.update(
//     {id: storyObj.id},
//     {$setOnInsert: tweet},
//     {upsert: true},
//     function(err, numAffected) { .. }
// );
