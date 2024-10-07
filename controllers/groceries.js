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

    try {
        const user = await User.findById(req.session.user._id);
        const listings = await Grocery.find({ seller: user._id });
        res.render('templates/grocer/listings.ejs', { user, listings })
    } catch (err) {
        console.error(err);
    }

})

// GET add new grocery item
router.get('/new', async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render("templates/grocer/new-item.ejs", { user });
})

// GET individual page for the item
router.get('/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const user = await User.findById(req.session.user._id);
        const listing = await Grocery.findById(id);
        res.render('templates/grocer/item.ejs', { user, listing })
    } catch (err) {
        console.error(err);
    }

})

// GET editing page for the item
router.get('/:id/edit', async (req, res) => {

    const id = req.params.id;

    try {

        const user = await User.findById(req.session.user._id);
        const listing = await Grocery.findById(id);
        res.render('templates/grocer/edit.ejs', { user, listing })
        
    } catch (err) {
        console.error(err);
    }

})

// POST routes

// POST new grocery item
router.post('/', async (req, res) => {
    
    try {
        const user = await User.findById(req.session.user._id);

        req.body.seller = user._id;

        await Grocery.create(req.body)

        const listings = await Grocery.find({ seller: user._id });

        res.render('templates/grocer/listings.ejs', { user, listings })
    } catch (err) {
        console.error(err);
    }
    
})

// PUT existing grocery item
router.put('/', async (req, res) => {
    
    try {
        const user = await User.findById(req.session.user._id);

        req.body.seller = user._id;

        await Grocery.create(req.body)

        const listings = await Grocery.find({ seller: user._id });

        res.render('templates/grocer/listings.ejs', { user, listings })
    } catch (err) {
        console.error(err);
    }
    
})


/* --------------------------------Exports--------------------------------*/

export default router;