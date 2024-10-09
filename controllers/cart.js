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
            return { id: match._id, seller: match.seller, name: match.name, quantity: item[1], price: match.price, total };
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
        cartObj.total = +totalAmount;
        await cartObj.save();

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

        // look through items array – find item matchin the itemId
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
        cartObj.total = +totalAmount;
        await cartObj.save();

        /* ---------------- display cart above --------------------*/

        // render
        res.render('templates/shopper/cart.ejs', { user, cart, itemArray, message, groceryName, totalAmount });


    } catch (err) {
        console.error(err);
    }

})

// PUT clear cart
router.put('/clear', async (req, res) => {
    
    // find user
    const user = await User.findById(req.session.user._id);

    // find cart
    const cart = await Cart.find({ owner: user._id }); // produces an array
    const cartObj = cart[0]; // get the cart object

    // clear cart
    cartObj.items = [];
    cartObj.total = 0;
    await cartObj.save();

    // message
    let message = "Your cart has been cleared."

    // render
    res.render('templates/shopper/error.ejs', { user, message });

})

// PUT checkout cart
router.put('/checkout', async (req, res) => {

    try {

        // find user
        const user = await User.findById(req.session.user._id);

        // find cart
        const cart = await Cart.find({ owner: user._id }); // produces an array
        const cartObj = cart[0]; // get the cart object

        /* =================== checking if order can be processed... ================= */

        // check if user has enough money
        if (cartObj.total > user.balance) {
            let message = "Your balance is not sufficient, please refill";
            return res.render('templates/shopper/error.ejs', { user, message });
        };

        // find all groceries that exist in the cart
            // array of grocery ids
            const idArray = cartObj.items.map((item) => item.id);

            // find groceries corresponding to idArray
            const groceries = await Grocery.find({ _id: {$in: idArray} });

        // check if EVERY item is not archived
        let checkArchived = groceries.every(grocery => grocery.listed);
        if (!checkArchived) {
            let message = "An item from your cart has been archived by the grocer. Please clear cart and start over.";
            return res.render('templates/shopper/error.ejs', { user, message });
        };

        // check if EVERY item in the cart has enough quantity (nested loops)
        let enough = true;
        cartObj.items.forEach(item => {
            groceries.forEach(grocery => {
                if (JSON.stringify(item.id) === JSON.stringify(grocery._id)
                && item.quantity > grocery.quantity) {
                    enough = false;
                };
            })
        });
        if (!enough) {
            let message = "Oops! Someone bought an item you had in cart, and it is out of stock. Please clear cart and start over.";
            return res.render('templates/shopper/error.ejs', { user, message });
        };

        /* =================== if all checks cleared... ================= */

        // push to past orders for user (but save current name too)
        let itemArray = getCartItems(cart, groceries);
        let currentOrder = {
            items: Array.from(itemArray), // change from (cartObj.items)
            total: cartObj.total,
        }
        user.pastOrders.push(currentOrder);

        // change balance for user
        user.balance = +user.balance - (+cartObj.total);
        await user.save();

        // change profts for EVERY grocer, create paid array
        const grocersPaid = [];
        const allGrocers = await User.find({ account: 'grocer' });
        itemArray.forEach(item => {
            allGrocers.forEach(grocer => {
                if (JSON.stringify(item.seller) === JSON.stringify(grocer._id)) {
                    
                    // update grocer balance – do I need to save it every time to database?
                    grocer.balance += +item.total;
                    console.log(`${grocer.username} earned ${item.total} from this transaction!`)

                    // push object into grocersPaid
                    let grocerPaid = { name: grocer.username, paid: item.total };
                    grocersPaid.push(grocerPaid);

                };
            });
        });

        // save allGrocers - use for-loop
        for (let i = 0; i < allGrocers.length; i++) {
            await allGrocers[i].save();
        };

        // reduce item quantity for EVERY grocery in cart
        itemArray.forEach(item => {
            groceries.forEach(grocery => {
                if (JSON.stringify(item.id) === JSON.stringify(grocery._id)) {
                    // reduce quantity of each grocery
                    grocery.quantity -= +item.quantity;
                    console.log("Reducing quantity")
                    console.log(`${grocery.name} has been reduced in quantity by ${item.quantity}`);
                };
            })
        });

        // save each grocery - use for-loop
        for (let i = 0; i < groceries.length; i++) {
            await groceries[i].save();
        }

        // clear cart
        cartObj.items = [];
        cartObj.total = 0;
        await cartObj.save();
        console.log("Now cart object is ", cartObj);

        // render shopper home with message
        let message = "Checkout has been completed successfully!";

        // render template
        res.render("templates/shopper/shopper-home", { user, message, grocersPaid })

    } catch (err) {
        console.error(err);
    }

});

/* --------------------------------Exports--------------------------------*/

export default router;