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

const sortList = async (sortValue) => {
    
    let listings;

    if (sortValue === "halloween") {

        listings = await Grocery.find({ listed: true, halloween: true });

    } else if (sortValue === "non-halloween") {

        listings = await Grocery.find({ listed: true, halloween: false });

    } else if (sortValue === "new") {

        listings = await Grocery.find({ listed: true });
        listings.sort((a, b) => b.date - a.date);

    } else if (sortValue === "old") {

        listings = await Grocery.find({ listed: true });
        listings.sort((a, b) => a.date - b.date);

    } else if (sortValue === "price") {
        
        listings = await Grocery.find({ listed: true });
        listings.sort((a, b) => a.price - b.price);

    } else {

        listings = await Grocery.find({ listed: true });

    }

    return listings;
}

const filterList = async (filterValue) => {
    
    const listings = await Grocery.find({ seller: filterValue, listed: true });
    return listings;

}

const searchList = async (searchValue) => {

    let listings = await Grocery.find({ listed: true });
    // find listings based on the search value
    listings = listings.filter(listing => {
        return listing.name.toLowerCase().includes(searchValue.toLowerCase());
    });

    return listings;
}

/* --------------------------------Routes--------------------------------*/

// GET routes – SIGNED OUT
// Marketplace view page – not signed-in TODO: sort/search function
router.get("/", async (req, res) => {
    
    try {
        let user;
        const listings = await Grocery.find({ listed: true });
        const grocer = false;
        // all of grocers
        const allGrocers = await User.find({ account: 'grocer', activated: true });

        /* ----------------- deal with sort/filter/search ------------------- */



        /* ----------------- finish sort/filter/search ------------------- */

        let halloween;

        res.render("templates/main/market", { user, listings, grocer, allGrocers, halloween });

    } catch (err) {
        console.log(err);
    }
});

// GET route for sort (signed out version)
router.get("/sort", async (req, res) => {

    try {

        let user;
        let halloween; // value to load css stylesheet
        const grocer = false;

        // all of grocers
        const allGrocers = await User.find({ account: 'grocer', activated: true });

        /* ----------------- deal with sort/filter/search ------------------- */
        // retrieve sort value
        const sortValue = req.query.sort;

        if (sortValue === "halloween") halloween = true;

        // define listings based on the value
        const listings = await sortList(sortValue);

        /* ----------------- finish sort/filter/search ------------------- */

        res.render("templates/main/market", { user, listings, grocer, allGrocers, halloween });

    } catch (err) {
        console.log(err);
    }
});

// GET route for filter (signed out version)
router.get("/filter", async (req, res) => {

    try {

        let user;
        let halloween; // value to load css stylesheet
        const grocer = false;

        // all of grocers
        const allGrocers = await User.find({ account: 'grocer', activated: true });

        /* ----------------- deal with sort/filter/search ------------------- */
        // retrieve filter value
        const filterValue = req.query.filter;

        // define listings based on the value
        const listings = await filterList(filterValue);

        /* ----------------- finish sort/filter/search ------------------- */

        res.render("templates/main/market", { user, listings, grocer, allGrocers, halloween });

    } catch (err) {
        console.log(err);
    }
});


// GET route for search (signed out version)
router.get("/search", async (req, res) => {

    try {

        let user;
        let halloween; // value to load css stylesheet
        const grocer = false;

        // all of grocers
        const allGrocers = await User.find({ account: 'grocer', activated: true });

        /* ----------------- deal with sort/filter/search ------------------- */
        // retrieve filter value
        const searchValue = req.query.search;

        // define listings based on the value
        const listings = await searchList(searchValue);

        /* ----------------- finish sort/filter/search ------------------- */

        res.render("templates/main/market", { user, listings, grocer, allGrocers, halloween });

    } catch (err) {
        console.log(err);
    }
});
  

// Item view page (different from /groceries/item which is just for the grocer)
router.get("/item/:id", async (req, res) => {
    const id = req.params.id;
    const listing = await Grocery.findById(id);

    // try finding a user
    let user = false;
    const grocer = false; // is grocer changing his items?
    
    // all of grocers TODO: find actual grocer by ID of listing
    const allGrocers = await User.find({ account: 'grocer', activated: true });
    

    let message;

    res.render("templates/main/item", { listing, user, grocer, allGrocers, message });
});



// GET Signed in routes
app.use(isSignedIn);

// user view of market TODO: sort/search function
router.get("/signed-in", async (req, res) => {
    const listings = await Grocery.find({ listed: true });
    const grocer = false; // is grocer changing his items?
    const user = await User.findById(req.session.user._id);
    // all of grocers
    const allGrocers = await User.find({ account: 'grocer', activated: true });
    let halloween; // load css for halloween
    res.render("templates/main/market", { listings, grocer, user, allGrocers, halloween });
});

// GET route for sort (signed in version)
router.get("/signed-in/sort", async (req, res) => {

    try {

        const user = await User.findById(req.session.user._id);
        let halloween; // value to load css stylesheet
        const grocer = false;

        // all of grocers
        const allGrocers = await User.find({ account: 'grocer', activated: true });

        /* ----------------- deal with sort/filter/search ------------------- */
        // retrieve sort value
        const sortValue = req.query.sort;

        if (sortValue === "halloween") halloween = true;

        // define listings based on the value
        let listings = await sortList(sortValue);

        /* ----------------- finish sort/filter/search ------------------- */

        res.render("templates/main/market", { listings, grocer, user, allGrocers, halloween });

    } catch (err) {
        console.log(err);
    }
});

// GET route for filter (signed IN version)
router.get("/signed-in/filter", async (req, res) => {

    try {

        const user = await User.findById(req.session.user._id);
        let halloween; // value to load css stylesheet
        const grocer = false;

        // all of grocers
        const allGrocers = await User.find({ account: 'grocer', activated: true });

        /* ----------------- deal with sort/filter/search ------------------- */
        // retrieve filter value
        const filterValue = req.query.filter;

        // define listings based on the value
        const listings = await filterList(filterValue);

        /* ----------------- finish sort/filter/search ------------------- */

        res.render("templates/main/market", { user, listings, grocer, allGrocers, halloween });

    } catch (err) {
        console.log(err);
    }
});

// GET route for search (signed IN version)
router.get("/signed-in/search", async (req, res) => {

    try {

        const user = await User.findById(req.session.user._id);
        let halloween; // value to load css stylesheet
        const grocer = false;

        // all of grocers
        const allGrocers = await User.find({ account: 'grocer', activated: true });

        /* ----------------- deal with sort/filter/search ------------------- */

        // define listings based on the value
        const listings = await searchList(req.query.search);

        /* ----------------- finish sort/filter/search ------------------- */

        res.render("templates/main/market", { user, listings, grocer, allGrocers, halloween });

    } catch (err) {
        console.log(err);
    }
});

// user view page
router.get("/item/:id/shop", async (req, res) => {
    const id = req.params.id;
    const listing = await Grocery.findById(id);

    // find a user
    const user = await User.findById(req.session.user._id);
    const grocer = false;

    // all of grocers
    const allGrocers = await User.find({ account: 'grocer', activated: true });

    let message;

    res.render("templates/main/item", { listing, user, grocer, allGrocers, message });
});

/* --------------------------------Exports--------------------------------*/

export default router;