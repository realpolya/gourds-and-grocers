/* --------------------------------Imports--------------------------------*/
import User from "../models/model-user.js";

/* --------------------------------Main GET Functions--------------------------------*/

const displayShopperHome = async (req, res) => {
    const user = await User.findById(req.session.user._id);
    let message;
    let grocersPaid;
    res.render("templates/shopper/shopper-home", { user, message, grocersPaid })
}

const displayShopperAccount = async (req, res) => {

    try {
        // find user
        const user = await User.findById(req.session.user._id);
        user.balance = Math.trunc(user.balance * 100) / 100;

        let message;

        // render
        res.render('templates/shopper/account.ejs', { user, message });

    } catch (err) {

        console.error(err);

    }

}

const displayShopperHistory = async (req, res) => {
      
    try {

        // find user
        const user = await User.findById(req.session.user._id);

        // retrieve past orders
        const pastOrders = user.pastOrders;

        // get all grocers to match id with name
        const allGrocers = await User.find({ account: 'grocer' });

        // return { id: match._id, seller: match.seller, name: match.name, quantity: item[1], price: match.price, total };
        res.render('templates/shopper/history.ejs', { user, pastOrders, allGrocers });
        
    } catch (err) {

        console.error(err);

    }

}

/* --------------------------------Main POST/PUT Functions--------------------------------*/

const addMoney = async (req, res) => {
    
    try {

        // find user
        const user = await User.findById(req.session.user._id);

        // update balance from before
        user.balance += +req.body.balance;
        user.balance = Math.trunc(user.balance * 100) / 100;

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
    
}

const deactivateShopperAccount = async (req, res) => {
    
    try {

        // find user
        const user = await User.findById(req.session.user._id);

        // update balance from before
        user.activated = false;

        // save the model
        await user.save();
        console.log(user);

        // render the template
        res.redirect('/auth/sign-out');

    } catch (err) {

        console.error(err);

    }
    
}

/* --------------------------------Exports--------------------------------*/

export { displayShopperHome, displayShopperAccount, displayShopperHistory, 
    addMoney, deactivateShopperAccount };