// Enter the app here so that we can use ES6 features

require("@babel/register")({
  presets: ["@babel/preset-env"]
});

// Import the rest of our application.
module.exports = require('./server.js')
