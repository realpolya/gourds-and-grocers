/* --------------------------------Imports--------------------------------*/
import Router from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";
import Cart from "../models/model-cart.js";


/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/


const getCartItems = (cart, groceries) => {
    
    // get id keys from the array
    const cartItemArray = cart[0].items.map(item => [item.id, item.quantity])
        
    // create itemArray of grocery names and quantities
    const itemArray = cartItemArray.map((item) => {
        const match = groceries.find(grocery => JSON.stringify(grocery._id) === JSON.stringify(item[0]));
        if (match) {
            let total = +item[1] * +match.price;
            total = Math.trunc(total * 100) / 100;
            return { id: match._id, name: match.name, quantity: item[1], price: match.price, total };
        }
    }).filter(item => item !== undefined);

    return itemArray;
};

const calculateTotal = (itemArray) => {

    let totalAmount = itemArray.reduce((arg, item) => {
        return arg + item.total;
    }, 0)
    totalAmount = Math.trunc(totalAmount * 100) / 100;
    return totalAmount;

}

/* --------------------------------Routes--------------------------------*/

// GET routes

// GET cart view
router.get('/', async (req, res) => {

    try {
        // find user
        const user = await User.findById(req.session.user._id);

        // find user's cart
        const cart = await Cart.find({ owner: user._id });

        // array of grocery ids
        const idArray = cart[0].items.map((item) => item.id);

        // find groceries corresponding to idArray
        const groceries = await Grocery.find({ _id: {$in: idArray} });

        // array of objects (each object represents cart item)
        const itemArray = getCartItems(cart, groceries);

        // display total
        let totalAmount = calculateTotal(itemArray);

        // message
        let message;

        // render
        res.render('templates/shopper/cart.ejs', { user, cart, itemArray, message, totalAmount });

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
        const listing = await Grocery.findById(itemId);

        // find user
        const user = await User.findById(req.session.user._id);

        // compare to available quantity
        if (req.body.quantity > listing.quantity) {
            
            // if this condition is true, render the same page with error message
            const grocer = false;
            const allGrocers = await User.find({ account: 'grocer' });

            // message
            let message = "Error: requested quantity exceeds available quantity";

            // res.render(`/market/item/${itemId}/shop`, { listing, user, grocer, allGrocers, message });
            return res.render('templates/main/item', { listing, user, grocer, allGrocers, message });

        };

        // find user's cart
        const cart = await Cart.find({ owner: user._id }); // produces an array
        const cartObj = cart[0]; // get the cart object

        // push req.body to the applications array
        req.body.id = itemId;
        cartObj.items.push(req.body);

        // save changes to the database
        await cartObj.save();

        // message
        let message = "The following item has been added to the cart:"
        let groceryName = listing.name;

        /* ---------------- display cart below --------------------*/
        
        // array of grocery ids
        const idArray = cart[0].items.map((item) => item.id);

        // find groceries corresponding to idArray
        const groceries = await Grocery.find({ _id: {$in: idArray} });

        // array of objects (each object represents cart item)
        const itemArray = getCartItems(cart, groceries);

        // display total
        let totalAmount = calculateTotal(itemArray);

        /* ---------------- display cart above --------------------*/

        // render
        res.render('templates/shopper/cart.ejs', { user, cart, itemArray, message, groceryName, totalAmount });

    } catch (err) {

        console.error(err);

    }
    
})

// // PUT remove item from cart
// router.post('/:id/inactive', async (req, res) => {

//     const id = req.params.id;
    
//     try {
//         const user = await User.findById(req.session.user._id);

//         // find listing to archive
//         const listing = await Grocery.findById(id);
        
//         // archive listing
//         listing.listed = false;

//         // save the listing
//         await listing.save();

//         // find all listings
//         const listings = await Grocery.find({ seller: user._id, listed: true });

//         const message = "The following listing has been archived:"
//         const grocer = { archived: false }; // is grocer looking at archived items?

//         res.render('templates/grocer/listings.ejs', { user, listings, message, listing, grocer });

//     } catch (err) {
//         console.error(err);
//     }
    
// })

// // PUT checkout cart
// router.post('/:id/relist', async (req, res) => {

//     const id = req.params.id;
    
//     try {
//         const user = await User.findById(req.session.user._id);

//         // find listing to archive
//         const listing = await Grocery.findById(id);
        
//         // archive listing
//         listing.listed = true;

//         // save the listing
//         await listing.save();

//         // find all listings
//         const listings = await Grocery.find({ seller: user._id, listed: true });

//         // message
//         const message = "The following listing has been reactivated:"
//         const grocer = { archived: false }; // is grocer dealing with archived items?

//         res.render('templates/grocer/listings.ejs', { user, listings, message, listing, grocer });

//     } catch (err) {
//         console.error(err);
//     }
    
// });


/* --------------------------------Exports--------------------------------*/

export default router;