/* --------------------------------Imports--------------------------------*/
import Router from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";
import Cart from "../models/model-cart.js";


/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/

// TODO: move cart display function here – remove it from POST route
// can't have async within async
const displayCart = (cart, groceries) => {
    
    // get id keys from the array
    const cartItemArray = cart[0].items.map(item => [item.id, item.quantity])
        
    // create itemArray of names and quantities
    const itemArray = cartItemArray.map((item) => {
        const match = groceries.find(grocery => JSON.stringify(grocery._id) === JSON.stringify(item[0]));
        if (match) {
            console.log("found a match")
            console.log("item is ", item);
            let total = +item[1] * +match.price;
            return { id: match._id, name: match.name, quantity: item[1], price: match.price, total };
        }
    }).filter(item => item !== undefined);

    console.log("Done with loop");
    console.log(itemArray);

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

        /* OLD

        // get id keys from the array
        const cartItemArray = cart[0].items.map((item) => [item.id, item.quantity])

        // create itemArray of names and quantities
        const itemArray = cartItemArray.map((item) => {
            const match = groceries.find(grocery => JSON.stringify(grocery._id) === JSON.stringify(item[0]));
            if (match) {
                console.log("found a match")
                console.log("item is ", item);
                let total = +item[1] * +match.price;
                return { id: match._id, name: match.name, quantity: item[1], price: match.price, total };
            }
        }).filter(item => item !== undefined); */

        /* TRY NEW BELOW */

        const itemArray = displayCart(cart, groceries);

        /* TRY NEW ABOVE */

        // const itemArray = displayCart(cart);

        // TODO: display total
        let totalAmount = calculateTotal(itemArray);

        // message
        let message;

        // render
        res.render('templates/shopper/cart.ejs', { user, cart, itemArray, message, totalAmount })
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
                let total = +item[1] * +match.price;
                return { name: match.name, quantity: item[1], price: match.price, total };
            }
        }).filter(item => item !== undefined);

        console.log("Done with loop");
        console.log(itemArray);

        // display total
        let totalAmount = itemArray.reduce((arg, item) => {
            return arg + item.total;
        }, 0)
        totalAmount = Math.trunc(totalAmount * 100) / 100;

        // render
        res.render('templates/shopper/cart.ejs', { user, cart, itemArray, message, totalAmount });

        // TODO: render shopper home page instead ?

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