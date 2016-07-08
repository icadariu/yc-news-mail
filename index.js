// HackerNews API - https://github.com/HackerNews/API

// https://github.com/stefanpenner/es6-promise#auto-polyfill
require('es6-promise').polyfill();
// https://github.com/matthew-andrews/isomorphic-fetch#usage,
require('isomorphic-fetch');
const bestStories = [];
const rating = 800;
let i;

setInterval(function testing() {
  console.log(bestStories);
}, 1000);


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
      // console.log(`Now i is ${i} ; and stories.length is - ${stories.length}`);
      const storyId = stories[i];
      const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`;
      jsonFetch(storyUrl)
        .then((storyObj) => {
          if (storyObj.score > rating) {
            bestStories.push(storyObj);
          }
        });
    }
    // console.log(bestStories);
  })
  .catch((e) => console.error(e));
// TODO: - save news on a json file
// TODO: save info from that json to mongo
// TODO:  play with mongo
