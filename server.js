/* --------------------------------Imports--------------------------------*/
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import favicon from "serve-favicon";

// models import
import User from "./models/model-user.js";
import Grocery from "./models/model-grocery.js";
import Cart from "./models/model-cart.js";

// controllers import

// middleware import
import { isSignedIn } from "./middleware/is-signed-in.js";
import { userToView } from "./middleware/user-view.js";


/* --------------------------------Express & Mongoose--------------------------------*/

// initialize express
const app = express();

// port info
const PORT = process.env.PORT ? process.env.PORT : "3000";

// mongoose connect
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

/* --------------------------------Middleware--------------------------------*/

const middleware = () => {
    
    app.use(favicon('public/favicon.ico'));
    app.use(express.static('public')); // CSS file
    // first allows to parse URL-encoded data from forms
    app.use(express.urlencoded({ extended: false }));
    app.use(methodOverride("_method"));
    app.use(morgan('dev'));
  
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      // store: MongoStore.create({
      //   mongoUrl: process.env.MONGO_URI,
      // })
    }))
  
    // routes to authenticate
    // app.use(userToView);
  
    // use ejs
    app.set('view engine', 'ejs');
  
  }
  middleware();


/* --------------------------------Routes--------------------------------*/

// Main routes
app.get("/", (req, res) => {
    // console.log(req.session.user);
    // res.render("index", { user: req.session.user });
    res.render("index");
});


// Signed in routes


// Listen
app.listen(PORT, () => {
    console.log(`The express app is ready on port ${PORT}!`);
  })