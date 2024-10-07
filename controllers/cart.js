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
        // find user
        const user = await User.findById(req.session.user._id);

        // find user's cart
        const cart = await Cart.find({ owner: user._id });

        // get id keys from the array
        const cartItemArray = cart[0].items.map((item) => [item.id, item.quantity])
        
        // array of grocery ids
        const idArray = cart[0].items.map((item) => item.id);

        // find groceries corresponding to idArray
        const groceries = await Grocery.find({ _id: {$in: idArray} });

        // create itemArray of names and quantities
        const itemArray = cartItemArray.map((item) => {
            const match = groceries.find(grocery => JSON.stringify(grocery._id) === JSON.stringify(item[0]));
            if (match) {
                console.log("found a match")
                console.log("item is ", item);
                return { name: match.name, quantity: item[1] };
            }
        }).filter(item => item !== undefined);

        console.log("Done with loop");
        console.log(itemArray);

        // TODO: display total

        // message
        let message;

        // render
        res.render('templates/shopper/cart.ejs', { user, cart, itemArray, message })
    } catch (err) {
        console.error(err);
    }

});



// POST routes
// POST new grocery item to cart
router.post('/:id', async (req, res) => {
    
    try {
        // retrieve item
        const itemId = req.params.id;
        const grocery = await Grocery.findById(itemId);

        // TODO: compare to available quantity

            // if above the quantity, do not put into cart
        

        // find user
        const user = await User.findById(req.session.user._id);

        // find user's cart
        const cartArray = await Cart.find({ owner: user._id }); // produces an array
        const cart = cartArray[0];
        console.log(cart);

        // push req.body to the applications array
        req.body.id = itemId;
        console.log(req.body);
        console.log(cart.items);
        cart.items.push(req.body);

        // save changes to the database
        await cart.save();

        // message
        let message = "The following item has been added to the cart:"

        // get id keys from the array
        const cartItemArray = cart.items.map((item) => [item.id, item.quantity])
        
        // array of grocery ids
        const idArray = cart.items.map((item) => item.id);

        // find groceries corresponding to idArray
        const groceries = await Grocery.find({ _id: {$in: idArray} });

        // create itemArray of names and quantities
        const itemArray = cartItemArray.map((item) => {
            const match = groceries.find(grocery => JSON.stringify(grocery._id) === JSON.stringify(item[0]));
            if (match) {
                console.log("found a match")
                console.log("item is ", item);
                return { name: match.name, quantity: item[1] };
            }
        }).filter(item => item !== undefined);

        console.log("Done with loop");
        console.log(itemArray);

        // TODO: display total

        // render
        res.render('templates/shopper/cart.ejs', { user, cart, itemArray, message });

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