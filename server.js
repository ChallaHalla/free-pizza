import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from 'dotenv';
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import "./db.js";
import "./config/passportConfig.js";

import * as usersController from "./controllers/usersController.js";
import * as requestsController from "./controllers/requestsController.js";
import * as postsController from "./controllers/postsController.js";
import * as middleware from "./services/middleware.js";

const app = express();

// load .env vars
dotenv.config();

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());

// app.use(express.static(`${__dirname}/public`));
app.use(session({ secret: "keyboard cat" }));
app.use(passport.initialize());
app.use(passport.session());
const { ensureAuthenticated } = middleware;

// user controller
app.get("/auth/reddit", usersController.redditLogin);
app.get("/auth/reddit/callback", usersController.redditLoginCallback);

// request controller
app.post("/createRequest", ensureAuthenticated, requestsController.createRequest);
app.post("/fulfilRequest", ensureAuthenticated, requestsController.fulfilRequest);
app.get("/getStreetAddress/:lat/:long", ensureAuthenticated, requestsController.getAddress);

// postsController
app.get("/getPosts", ensureAuthenticated, postsController.getPosts);
app.get("/getRequest/:requestId", ensureAuthenticated, postsController.getRequest);
app.post("/sendJoinLink", ensureAuthenticated, requestsController.sendJoinLink);
app.get("/claim/:requestId", ensureAuthenticated, requestsController.claimPromise);
app.post("/claim", ensureAuthenticated, requestsController.findPromise);

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000/posts");
});

// will be important when serving static build
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

app.listen(process.env.PORT || 3001);
