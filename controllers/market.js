/* --------------------------------Imports--------------------------------*/
import Router from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";


/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/



/* --------------------------------Routes--------------------------------*/

// GET routes
// Marketplace view page
app.get("/", async (req, res) => {
    const listings = await Grocery.find({ listed: true });
    res.render("templates/main/market", { listings });
});
  

// Item view page (different from /groceries/item which is just for the grocer)
app.get("/:id", async (req, res) => {
    const id = req.params.id;
    const listing = await Grocery.findById(id);

    // try finding a user
    const user = await User.findById(req.session.user._id);
    const grocer = false;

    res.render("templates/main/item", { listing, user, grocer });
});

/* --------------------------------Exports--------------------------------*/

export default router;