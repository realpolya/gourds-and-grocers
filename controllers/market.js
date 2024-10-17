/* --------------------------------Imports--------------------------------*/
import express from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";

/* --------------------------------Helper Functions--------------------------------*/

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

/* --------------------------------Main Functions--------------------------------*/

// GET routes – SIGNED OUT
// Marketplace view page – not signed-in TODO: sort/search function

const displayMarket = async (req, res) => {
    
    try {
        const user = req.session.user ? await User.findById(req.session.user._id) : undefined;
        const listings = await Grocery.find({ listed: true });
        const grocer = false;

        // all of grocers
        const allGrocers = await User.find({ account: 'grocer', activated: true });

        let halloween;

        res.render("templates/main/market", { user, listings, grocer, allGrocers, halloween });

    } catch (err) {
        console.log(err);
    }
};

const displaySort = async (req, res) => {

    try {

        const user = req.session.user ? await User.findById(req.session.user._id) : undefined;
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
};

const displayFilter = async (req, res) => {

    try {

        // FIXME:
        const user = req.session.user ? await User.findById(req.session.user._id) : undefined;
        console.log('user is ', user)
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
}

const displaySearch = async (req, res) => {

    try {

        const user = req.session.user ? await User.findById(req.session.user._id) : undefined;
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
}

const displayItem = async (req, res) => {
    const id = req.params.id;
    const listing = await Grocery.findById(id);

    // try finding a user
    // let user = false;
    const user = req.session.user ? await User.findById(req.session.user._id) : undefined;
    const grocer = false; // is grocer changing his items?
    
    // all of grocers TODO: find actual grocer by ID of listing
    const allGrocers = await User.find({ account: 'grocer', activated: true });
    

    let message;

    res.render("templates/main/item", { listing, user, grocer, allGrocers, message });
}

/* --------------------------------Exports--------------------------------*/

export { displayMarket, displaySort, displayFilter, displaySearch, displayItem };