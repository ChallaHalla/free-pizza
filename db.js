import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const UserSchema = {
  username: { type: String },
  redditId: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
};

const PizzaRequestSchema = {
  postId: { type: String },
  ownerId: { type: String },
  // if refers to redditId
  title: { type: String },
  description: { type: String },
  fulfilledBy: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  
  // address info
  address: ObjectId, 
//  perhaps include requested order
};

const PizzaPromiseSchema = {
  postId: { type: String },
  // if refers to redditId
  fulfilledBy: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
};

const AddressSchema = {
  streetAddress: { type: String },
  zipcode: { type: String },
  state: { type: String },
  apt: { type: String },
};

const dbconf = 'mongodb://localhost/free-pizza';

mongoose.connect(dbconf);

mongoose.model("User", UserSchema);
mongoose.model("Address", AddressSchema);
mongoose.model("PizzaRequest", PizzaRequestSchema);
mongoose.model("PizzaPromise", PizzaPromiseSchema);
