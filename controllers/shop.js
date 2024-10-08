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

// shopper home
router.get("/", async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render("templates/shopper/shopper-home", { user })
});

// GET account view
router.get('/account', async (req, res) => {

    try {
        // find user
        const user = await User.findById(req.session.user._id);

        let message;

        // render
        res.render('templates/shopper/account.ejs', { user, message });

    } catch (err) {

        console.error(err);

    }

});



// POST routes

// PUT money to the account
router.put('/account', async (req, res) => {
    
    try {

        // find user
        const user = await User.findById(req.session.user._id);

        // update balance from before
        user.balance = +user.balance + +req.body.balance;

        // save the model
        await user.save();

        // render message with amount
        let message = "The following amount has been added: ";
        let amount = req.body.balance;

        // render the template
        res.render('templates/shopper/account.ejs', { user, message, amount });

    } catch (err) {

        console.error(err);

    }
    
})

// PUT deactivate account
router.put('/:id/remove', async (req, res) => {

    try {
        
        // retrieve item
        const itemId = req.params.id;
        const listing = await Grocery.findById(itemId);

        // find user
        const user = await User.findById(req.session.user._id);

        // render
        res.render('templates/shopper/cart.ejs', { user, cart, itemArray, message, groceryName, totalAmount });


    } catch (err) {
        console.error(err);
    }

})



/* --------------------------------Exports--------------------------------*/

export default router;