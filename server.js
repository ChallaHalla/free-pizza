import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from 'dotenv';
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import "./db";
import "./config/passportConfig.js";

import * as userController from "./controllers/userController";
import * as requestController from "./controllers/requestController";
import * as postController from "./controllers/postController";
import * as middleware from "./services/middleware";

const app = express();

// load .env vars
dotenv.config();

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());

app.use(express.static(`${__dirname}/public`));
app.use(session({ secret: "keyboard cat" }));
app.use(passport.initialize());
app.use(passport.session());
const { ensureAuthenticated } = middleware;

// user controller
app.get("/auth/reddit", userController.redditLogin);
app.get("/auth/reddit/callback", userController.redditLoginCallback);

// request controller
app.post("/createRequest", ensureAuthenticated, requestController.createRequest);
app.post("/fulfilRequest", ensureAuthenticated, requestController.fulfilRequest);
app.get("/getStreetAddress/:lat/:long", ensureAuthenticated, requestController.getAddress);

// postController
app.get("/getPosts", ensureAuthenticated, postController.getPosts);
app.get("/getRequest/:requestId", ensureAuthenticated, postController.getRequest);
app.post("/sendJoinLink", ensureAuthenticated, requestController.sendJoinLink);
app.get("/claim/:requestId", ensureAuthenticated, requestController.claimPromise);
app.post("/claim", ensureAuthenticated, requestController.findPromise);

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000/posts");
});

// will be important when serving static build
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

app.listen(process.env.PORT || 3001);
