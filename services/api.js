import fetch from "node-fetch";

const makeRequest = (url, data = { method: "GET" }) => new Promise(((resolve, reject) => {
  fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: data.method,
    body: JSON.stringify(data.body),
  }).then((res) => {
    res.json().then((json) => {
      resolve(json);
    });
  }).catch((err) => {
    console.log(err);
    console.log("in the catch!");
    reject(err);
  });
}));

export const getGoogleMapsAddress = (requestParams) => {
  console.log(requestParams);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${requestParams.lat},${requestParams.long}&key=${process.env.MAPS_API_KEY}` 
  console.log(url);
  return makeRequest(url);
};
