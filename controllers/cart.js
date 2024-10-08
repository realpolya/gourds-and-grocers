/* --------------------------------Imports--------------------------------*/
import Router from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";
import Cart from "../models/model-cart.js";


/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/

const getCartItems = (cart, groceries) => {
    
    // get id keys from the array – double array
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

            return res.render('templates/main/item', { listing, user, grocer, allGrocers, message });

        };

        // find user's cart
        const cart = await Cart.find({ owner: user._id }); // produces an array
        const cartObj = cart[0]; // get the cart object

        // push req.body to the applications array
        req.body.id = itemId;

        // is identical item in array?
        let alreadyInCart = false;
        cartObj.items.forEach(item => {
            
            if (JSON.stringify(item.id) === JSON.stringify(itemId)) {
                
                // update boolean
                alreadyInCart = true;
                console.log("In cart");
                console.log(req.body);

                // update quantity
                req.body.quantity = +req.body.quantity + (+item.quantity);

                // update item
                item.set(req.body);

            };

        });

        // if the quantity exceeds, render message
        if (alreadyInCart && req.body.quantity > listing.quantity) {
            
            console.log("Already in cart error quantity");

            // if this condition is true, render the same page with error message
            const grocer = false;
            const allGrocers = await User.find({ account: 'grocer' });

            // message
            let message = "Error: item already in cart. Requested quantity exceeds available quantity";

            return res.render('templates/main/item', { listing, user, grocer, allGrocers, message });

        };

        // if not in cart, create a new object
        if (!alreadyInCart) {

            cartObj.items.push(req.body);

        };

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

// PUT remove item from cart
router.put('/:id/remove', async (req, res) => {

    try {
        
        // retrieve item
        const itemId = req.params.id;
        const listing = await Grocery.findById(itemId);

        // find user
        const user = await User.findById(req.session.user._id);

        // find cart
        const cart = await Cart.find({ owner: user._id }); // produces an array
        const cartObj = cart[0]; // get the cart object

        // look through items array – find item matchin the itemId TODO: might need JSON.stringify
        let objectToRemove = cartObj.items.filter(item => JSON.stringify(item.id) === JSON.stringify(itemId));
        let schemaIdRemove = objectToRemove[0]._id;

        // remove in array and save mongoose object
        await cartObj.items.id(schemaIdRemove).deleteOne();
        await cartObj.save();

        // message
        let message = "The following item has been removed from the cart:"
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