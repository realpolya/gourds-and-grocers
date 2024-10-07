/* --------------------------------Imports--------------------------------*/
import Router from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";



/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/

const createGrocery = async (req, res) => {
    
    const user = await User.findById(req.session.user._id);
    res.render("templates/grocer/new-item.ejs", { user });

}


/* --------------------------------Routes--------------------------------*/

// GET routes
// GET view listings
router.get('/', async (req, res) => {

    try {
        const user = await User.findById(req.session.user._id);
        const listings = await Grocery.find({ seller: user._id, listed: true });
        let listing;
        let message;
        const grocer = { archived: false }; // is grocer dealing with archived items?
        res.render('templates/grocer/listings.ejs', { user, listings, message, listing, grocer })
    } catch (err) {
        console.error(err);
    }

});

// GET archived listings
router.get('/archived', async (req, res) => {

    try {
        const user = await User.findById(req.session.user._id);
        const listings = await Grocery.find({ seller: user._id, listed: false });
        const grocer = { archived: true }; // is grocer dealing with archived items?
        res.render('templates/grocer/archived.ejs', { user, listings, grocer })
    } catch (err) {
        console.error(err);
    }

});

// GET add new grocery item
router.get('/new', createGrocery);

// GET account view for the grocer
router.get('/account', async (req, res) => {
    try {
        
        const user = await User.findById(req.session.user._id);
        
        res.render('templates/grocer/account.ejs', { user });

    } catch (err) {
        console.error(err);
    }
})

// GET individual page for the item
router.get('/:id', async (req, res) => {

    const id = req.params.id;

    try {

        const user = await User.findById(req.session.user._id);
        const listing = await Grocery.findById(id);
        const changed = false;
        const grocer = { archived: false }; // is grocer dealing with archived items?
        res.render('templates/grocer/item.ejs', { user, listing, changed, grocer })

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

        const listing = await Grocery.create(req.body)

        const listings = await Grocery.find({ seller: user._id, listed: true });

        const message = "The following listing has been created:"
        const grocer = { archived: false }; // is grocer dealing with archived items?

        res.render('templates/grocer/listings.ejs', { user, listings, message, listing, grocer })
    } catch (err) {
        console.error(err);
    }
    
})

// POST inactivate the listing
router.post('/:id/inactive', async (req, res) => {

    const id = req.params.id;
    
    try {
        const user = await User.findById(req.session.user._id);

        // find listing to archive
        const listing = await Grocery.findById(id);
        
        // archive listing
        listing.listed = false;

        // save the listing
        await listing.save();

        // find all listings
        const listings = await Grocery.find({ seller: user._id, listed: true });

        const message = "The following listing has been archived:"
        const grocer = { archived: false }; // is grocer looking at archived items?

        res.render('templates/grocer/listings.ejs', { user, listings, message, listing, grocer });

    } catch (err) {
        console.error(err);
    }
    
})

// POST reactivate the listing
router.post('/:id/relist', async (req, res) => {

    const id = req.params.id;
    
    try {
        const user = await User.findById(req.session.user._id);

        // find listing to archive
        const listing = await Grocery.findById(id);
        
        // archive listing
        listing.listed = true;

        // save the listing
        await listing.save();

        // find all listings
        const listings = await Grocery.find({ seller: user._id, listed: true });

        // message
        const message = "The following listing has been reactivated:"
        const grocer = { archived: false }; // is grocer dealing with archived items?

        res.render('templates/grocer/listings.ejs', { user, listings, message, listing, grocer });

    } catch (err) {
        console.error(err);
    }
    
})

// PUT existing grocery item
router.put('/:id', async (req, res) => {
    
    const id = req.params.id;

    try {

        // look up user
        const user = await User.findById(req.session.user._id);

        // find listing
        await Grocery.findByIdAndUpdate(id, req.body);
        const listing = await Grocery.findById(id);
        const changed = true;
        const grocer = true;

        res.render('templates/grocer/item.ejs', { user, listing, changed, grocer });


    } catch (err) {
        console.error(err);
    }
    
})


/* --------------------------------Exports--------------------------------*/

export default router;