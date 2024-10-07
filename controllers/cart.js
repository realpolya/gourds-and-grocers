/* --------------------------------Imports--------------------------------*/
import Router from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";
import Cart from "../models/model-cart.js";


/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/




/* --------------------------------Routes--------------------------------*/

// GET routes
// GET cart view
router.get('/', async (req, res) => {

    try {
        const user = await User.findById(req.session.user._id);
        res.render('templates/shopper/cart.ejs', { user })
    } catch (err) {
        console.error(err);
    }

});



// POST routes
// POST new grocery item to cart
router.post('/:id', async (req, res) => {
    
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

// PUT remove item from cart
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

// PUT checkout cart
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
    
});


/* --------------------------------Exports--------------------------------*/

export default router;