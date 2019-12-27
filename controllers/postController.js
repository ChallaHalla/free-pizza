import mongoose from "mongoose";
import snoowrap from "snoowrap";
const PizzaRequest = mongoose.model("PizzaRequest");
const PizzaPromise = mongoose.model("PizzaPromise");

exports.getPosts = (req, res) => {
  const r = new snoowrap({
    userAgent: req.get("User-Agent"),
    clientId: process.env.REDDIT_CONSUMER_KEY,
    clientSecret: process.env.REDDIT_CONSUMER_SECRET,
    refreshToken: req.user.refreshToken,
    accessToken: req.user.accessToken,
  });
  r.getHot("freepizzatest").then(async (posts) => {
    const postIds = posts.map((p) => p.name);
    const query = PizzaRequest.find({ postId: { $in: postIds } }).populate('fulfilledBy');
    const pizzaRequests = await query.exec();
    const createdRequests = pizzaRequests.reduce((acc, cur, i) => {
      acc[cur.postId] = cur;
      return acc;
    }, {});

    const promisesQuery = PizzaPromise.find({ postId: { $in: postIds } });
    let existingPromises = await promisesQuery.exec();
    let createdPromises = {};
    if(existingPromises.length > 0){
      createdPromises = existingPromises.reduce((acc, cur, i) => {
        acc[cur.postId] = cur;
        return acc;
    });
    }
        const result = posts.map((p) => ({
      id: p.name,
      title: p.title,
      description: p.selftext,
      created_at: p.created,
      url: p.url,
      requestCreated: !!createdRequests[p.name],
      fulfilledBy: createdRequests[p.name] && createdRequests[p.name].fulfilledBy && createdRequests[p.name].fulfilledBy.username,
      promiseCreated: createdPromises[p.name],

    }));
    res.send(result);
  });
}

exports.getRequest = async (req, res) => {
  const { requestId } = req.params;
  const query = PizzaRequest.findOne({ postId: requestId });
  const request = await query.exec();
  res.json(request);
}


