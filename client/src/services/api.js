import fetch from "node-fetch";

const makeRequest = (url, data = { method: "GET" }) => new Promise(((resolve, reject) => {
  fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: data.method,
    body: JSON.stringify(data.body),
  }).then(handleErrors).then((res) => {
    res.json().then((json) => {
      resolve(json);
    });
  }).catch((err) => {
    console.log(err);
    console.log("in the catch!");
    reject(err);
  });
}));

function handleErrors(response, request) {
  // redirect 401 errors to login page
  // added so that ajax calls that are unauthorized can trigger
  // login for user
  if (response.status === 401) {

    const location = window.location.pathname;
    let state;

    state = JSON.stringify({returnTo: window.location.href})
    
    const url = new URL(`${window.location.origin}/login`);
// If your expected result is "http://foo.bar/?x=1&y=2&x=42"
    if(state){
      url.searchParams.append('state', window.btoa(state));
    }
    window.location.replace(url);
  }
  if (!response.ok) {
    console.error(response);
  }
  return response;
}

export const getPosts = () => makeRequest("/getPosts");
export const createPizzaRequest = (requestParams) => {
  const data = {
    body: requestParams,
    method: "POST",
  };
  return makeRequest("/createRequest", data);
};

export const getRequest = (postId) => {
  console.log(postId);
  return makeRequest(`/getRequest/${postId}`);
};

export const getClaim = (postId) => {
  console.log(postId);
  return makeRequest(`/claim/${postId}`);
};


export const fulfilClaim = (requestParams) => {
  const data = {
    body: requestParams,
    method: "POST",
  };
  return makeRequest("/claim", data);
};

export const fulfilRequest = (requestParams) => {
  console.log(requestParams);
  const data = {
    body: requestParams,
    method: "POST",
  };
  return makeRequest("/fulfilRequest", data);
};

export const sendJoinLink = (requestParams) => {
  console.log(requestParams);
  const data = {
    body: requestParams,
    method: "POST",
  };
  return makeRequest("/sendJoinLink", data);
};

export const getStreetAddress = (requestParams) => {
  console.log(requestParams);
  return makeRequest(`/getStreetAddress/${requestParams.latitude}/${requestParams.longitude}`);
};
