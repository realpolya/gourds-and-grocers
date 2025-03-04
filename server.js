/* --------------------------------Imports--------------------------------*/
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import favicon from "serve-favicon";

// controllers import
import authController from "./routes/route-auth.js";
import marketController from "./routes/route-market.js";
import groceriesController from "./routes/route-groceries.js";
import cartController from "./routes/route-cart.js";
import shopController from "./routes/route-shop.js";

// middleware import
import { isSignedIn } from "./middleware/is-signed-in.js";
import { userToView } from "./middleware/user-view.js";


/* --------------------------------Express & Mongoose--------------------------------*/

// initialize express
const app = express();

// port info
const PORT = process.env.PORT ? process.env.PORT : "3000";
// const PORT = "3000";


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
    app.use(userToView);
  
    // use ejs
    app.set('view engine', 'ejs');
  
  }

middleware();

/* --------------------------------Routes--------------------------------*/

// Main routes

// home page
app.get("/", (req, res) => {
    res.render("index");
});


app.use("/auth", authController);
app.use("/market", marketController);

// Signed in routes
app.use(isSignedIn);

app.use("/groceries", groceriesController);
app.use("/cart", cartController);
app.use("/shop", shopController);

// Listen
app.listen(PORT, () => {
    console.log(`The express app is ready on port ${PORT}!`);
})