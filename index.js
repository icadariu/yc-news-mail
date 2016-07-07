// HackerNews API - https://github.com/HackerNews/API

// https://github.com/stefanpenner/es6-promise#auto-polyfill
require('es6-promise').polyfill();
// https://github.com/matthew-andrews/isomorphic-fetch#usage
require('isomorphic-fetch');

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
    // const storyId = stories[0];
    // const storyIdLength = stories.length;
//    storyScore = {};
    let i;
    for (i = 0; i < stories.length; i++) {
      const storyId = stories[i];
      const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`;
      jsonFetch(storyUrl)
        .then(storyObj => console.log(storyObj.score, storyObj.title));

/*
.then(function (selectedOption) {
             if (selectedOption === 'Yes') {
                 return this.save();
             } else {
                 Q.resolve()
             }
         });
*/
// TODO: create the if statement and show only news with more than 50 points
    //     .then(storyObj) {
    //       if (storyObj.score > 50) {
    //         storyScore.push(storyObj);
    //    };
    //  };
    }
  })
  .catch((e) => console.error(e));
