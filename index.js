// HackerNews API - https://github.com/HackerNews/API

// https://github.com/stefanpenner/es6-promise#auto-polyfill
require('es6-promise').polyfill();
// https://github.com/matthew-andrews/isomorphic-fetch#usage,
require('isomorphic-fetch');
// const bestStories = [];
const rating = 50;
let i;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yc');

var bestStoriesDB = mongoose.model('BestStories', {id: String, url: String,
  comments: String, score: Number, title: String, sent: Boolean });

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
jsonFetch(urlHN)
  .then((stories) => {
    for (i = 0; i < stories.length; i++) {
      const storyId = stories[i];
      const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`;
      jsonFetch(storyUrl)
        .then((storyObj) => {
          if (storyObj.score > rating) {
            // bestStories.push(storyObj);
            // 'BestStories', {id: String, url: String, comments: String, score: Number, title: String, sent: Boolean });
            // https://news.ycombinator.com/item?id=12043712
            let HNurl = `https://news.ycombinator.com/item?id=${storyObj.id}`;
            let urlCheck = storyObj.url;
            // TODO: create if statement to check if storyObj.url is null. If true, use HNurl

            var news = new bestStoriesDB({ id: storyObj.id, url: storyObj.url, comments: HNurl,
              score: storyObj.score, title: storyObj.title, sent: false });

            news.save(function (err) {
              if (err) { console.log(err); }
            });
          }
        })
        .catch((e) => console.error(e));
    }
  })
  .catch((e) => console.error(e));


// TODO: - save news on a json file
// TODO: save info from that json to mongo
// TODO: play with mongo li
// TODO: add comments link - you can use https://news.ycombinator.com/item?id=12061453 where
//       id is equal to storyId
