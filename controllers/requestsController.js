import snoowrap from "snoowrap";
import mongoose from "mongoose";

const Address = mongoose.model("Address");
const PizzaRequest = mongoose.model("PizzaRequest");
const PizzaPromise = mongoose.model("PizzaPromise");

export function createRequest(req, res) {
  const r = new snoowrap({
    userAgent: req.get("User-Agent"),
    clientId: process.env.REDDIT_CONSUMER_KEY,
    clientSecret: process.env.REDDIT_CONSUMER_SECRET,
    refreshToken: req.user.refreshToken,
    accessToken: req.user.accessToken,
  });
  
  const {
    title, description, streetAddress, zipCode, apt, state, 
  } = req.body;

  const address = new Address({
    streetAddress,
    zipCode,
    apt,
    state,
  });

  // do some validation here about the address and whether or not there is a dominoes nearby

  // if user doesn't have an address saved then add it to the profile

  r.getSubreddit('freepizzatest')
    .submitSelfpost({ title, text: description }).then((result) => {
      const pizzaRequest = new PizzaRequest({
        postId: result.name,
        ownerId: req.user.id,
        title,
        // if refers to redditId
        description, 
        address,
      });
      pizzaRequest.save();
      res.send({ message: "success" });
    });
}

export async function fulfilRequest(req, res) {
  // find request
  const { requestId } = req.body;
  
  const query = PizzaRequest.findOne({ postId: requestId, fulfilledBy: null });
  const request = await query.exec();

  if (!request) {
    res.send({ message: "Request has already been fulfilled!" });
    return;
  }

  request.fulfilledBy = req.user;
  request.save();
  const r = new snoowrap({
    userAgent: req.get("User-Agent"),
    clientId: process.env.REDDIT_CONSUMER_KEY,
    clientSecret: process.env.REDDIT_CONSUMER_SECRET,
    refreshToken: req.user.refreshToken,
    accessToken: req.user.accessToken,
  });

  r.getSubmission(requestId).reply("This request has been fulfiled by pizzabot!");
  res.send({ message: "fulfilled request!" });
}

export async function sendJoinLink(req, res) {
  const { requestId } = req.body;
  // need to create a pizza promise and associate it to this post id
  // we dont want multiple promises per orphaned post
  // set expiry for a pizza promise to 2 minutes in dev
  // 24 hours in production
  //
  const query = PizzaPromise.find({ postId: requestId });
  const existingRequests = await query.exec();
  if (existingRequests.length > 0) {
    res.sendStatus(404);
    return;
  }

  const r = new snoowrap({
    userAgent: req.get("User-Agent"),
    clientId: process.env.REDDIT_CONSUMER_KEY,
    clientSecret: process.env.REDDIT_CONSUMER_SECRET,
    refreshToken: req.user.refreshToken,
    accessToken: req.user.accessToken,
  });

  const post = r.getSubmission(requestId);
  // replace this with something a lot better lol
  post.reply(`I have fulfilled your request! Claim your pizza @ http://${req.get("x-forwarded-host")}/claim/${requestId}`);
  const pizzaPromise = new PizzaPromise({
    postId: requestId,
    fulfilledBy: req.user,
    title: post.title,
    description: post.self_text,
    // can put order info here later
    // fulfilled can look like delting this object,
    // creating and immediately executing a request obj
  });
  pizzaPromise.save();

  res.send({ message: "join link sent!" });
}

export async function claimPromise(req, res) {
  // check to see if there's a promise with the given id.
  // retunr if there is, 404 if not
  //
  const { requestId } = req.params;
  const query = PizzaPromise.findOne({ postId: requestId });
  const pizzaPromise = await query.exec();
  if (!pizzaPromise) {
    res.setStatus(404);
  }
  res.json(pizzaPromise);
}

export async function findPromise(req, res) {
  // find pizza promise
  //
  // check if user trying to claim has same username as reddit post
  //
  // if so then delete promise and create fulfilled request
  //
  // comment on post?
  //
  //
  // have address sent with request
  const { postId } = req.body;
  // const { address } = req.body;
  const r = new snoowrap({
    userAgent: req.get("User-Agent"),
    clientId: process.env.REDDIT_CONSUMER_KEY,
    clientSecret: process.env.REDDIT_CONSUMER_SECRET,
    refreshToken: req.user.refreshToken,
    accessToken: req.user.accessToken,
  });

  const submission_username = await r.getSubmission(postId).author.name;
  if (submission_username !== req.user.username) {
    // only post author can claim
    res.send(405);
  }

  const query = PizzaPromise.findOne({ postId });
  const pizzaPromise = await query.exec();
  if (!pizzaPromise) {
    res.send(404);
  }

  const pizzaRequest = new PizzaRequest({
    title: pizzaPromise.title,
    ownerId: req.user.id,
    postId: pizzaPromise.postId,
    description: pizzaPromise.description,
    fulfilledBy: pizzaPromise.fulfilledBy,
    //    address: fill this in later
  });

  pizzaRequest.save();
  pizzaPromise.remove();
  res.json({ message: "Promise has been claimed!" });
}

export function getAddress(req, res) {
  const { lat, long } = req.params;
  console.log(lat, long);
  api.getGoogleMapsAddress({
    lat,
    long,
  }).then((results) => {
    console.log(results.results);
    res.send(results.results);
  });
}
