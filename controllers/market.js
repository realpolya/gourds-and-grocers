/* --------------------------------Imports--------------------------------*/
import Router from "express";
import express from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";
import { isSignedIn } from "../middleware/is-signed-in.js";


/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();
const app = express();

/* --------------------------------Functions--------------------------------*/



/* --------------------------------Routes--------------------------------*/

// GET routes
// Marketplace view page – not signed-in
router.get("/", async (req, res) => {
    const listings = await Grocery.find({ listed: true });
    const grocer = false;
    res.render("templates/main/market", { listings, grocer });
});
  

// Item view page (different from /groceries/item which is just for the grocer)
router.get("/item/:id", async (req, res) => {
    const id = req.params.id;
    const listing = await Grocery.findById(id);

    // try finding a user
    let user = false;
    const grocer = false;

    res.render("templates/main/item", { listing, user, grocer });
});



// Signed in routes
app.use(isSignedIn);

// user view of market
router.get("/signed-in", async (req, res) => {
    const listings = await Grocery.find({ listed: true });
    const grocer = false;
    const user = await User.findById(req.session.user._id);
    res.render("templates/main/market", { listings, grocer, user });
});

// user view page
router.get("/item/:id/shop", async (req, res) => {
    const id = req.params.id;
    const listing = await Grocery.findById(id);

    // find a user
    const user = await User.findById(req.session.user._id);
    const grocer = false;

    res.render("templates/main/item", { listing, user, grocer });
});

/* --------------------------------Exports--------------------------------*/

export default router;