/* --------------------------------Imports--------------------------------*/
import Router from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";



/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/

const createGrocery = async (req, res) => {
    
    res.render("templates/grocer/new-item.ejs");

}


/* --------------------------------Routes--------------------------------*/

// GET routes


// GET view listings
router.get('/', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render("templates/grocer/listings.ejs", { user });
})

// GET add new grocery item
router.get('/new', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render("templates/grocer/new-item.ejs", { user });
})

// POST routes

// POST new grocery item


/* --------------------------------Exports--------------------------------*/

export default router;