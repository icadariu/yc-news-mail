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

      // console.log(response.headers);
      // if (response.headers.get('content-type') !== 'application/json; charset=utf-8') {
      // if (!~response.headers.get('content-type').indexOf('application/json')) {
      if (!response.headers.get('content-type').includes('application/json')) {
        throw new TypeError();
      }

      return response.json();
    });
}

exports.jsonFetch = jsonFetch;
