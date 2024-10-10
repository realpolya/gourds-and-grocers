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
        res.render('templates/grocer/listings.ejs', { user, listings, message, listing, grocer });
    } catch (err) {
        console.error(err);
    }

});

// GET grocer home
router.get("/home", async (req, res) => {
    
    try {
        
        const user = await User.findById(req.session.user._id);

        let message;
    
        // find listed groceries out of stock
        const outOfStock = await Grocery.find({ seller: user._id, listed: true, quantity: 0 });
        console.log("Out of stock items are ", outOfStock);
        if (outOfStock.length >= 1) {
            message = ["The following item is out of stock:", "The current restocking frequency (in days) is:"];
        }
    
        res.render("templates/grocer/grocer-home.ejs", { user, message, outOfStock })

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
        user.balance = Math.trunc(user.balance * 100) / 100;
        
        res.render('templates/grocer/account.ejs', { user });

    } catch (err) {
        console.error(err);
    }
})

// GET view of history
router.get('/history', async (req, res) => {
    try {
        
        const user = await User.findById(req.session.user._id);

        const allShoppers = await User.find({ account: 'shopper' });

        // initialize array of objects for the grocer
        let sales = [];

        // cycle through allShoppers to retrieve their pastOrders
        allShoppers.forEach(shopper => {
            
            // cycle through pastOrders to retrieve items in each order
            shopper.pastOrders.forEach(order => {
                
                // cycle through items (array of objects)
                order.items.forEach(item => {
                    
                    // see if id of seller matches id of USER?
                    if (JSON.stringify(item.seller) === JSON.stringify(user._id)) {
                        
                        // if yes, great! push new object into the success array with the name of the shopper
                        const sale = Object.assign({}, item);
                        sale.buyer = shopper.username;
                        sale.buyerId = shopper._id;
                        sale.date = order.date;
                        sale.orderId = order._id;
                        sales.push(sale);

                    }
                })

            })
        })

        console.log("sales for me are ", sales);
        
        res.render('templates/grocer/history.ejs', { user, sales });

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

        // TODO: check if grocer
        if (user.account !== 'grocer') {
            let message = "You are not a grocer";
            return res.render('templates/shopper/error.ejs', { user, message });
        }

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

// PUT deactivate account
router.put('/account/deactiv', async (req, res) => {
    
    try {

        // find user
        const user = await User.findById(req.session.user._id);

        // update balance from before
        user.activated = false;

        // save the model
        await user.save();
        console.log(user);

        // delist all of the grocer's listings
        const listings = await Grocery.find({ seller: user._id });
        listings.forEach(listing => listing.listed = false);
        for (let i = 0; i < listings.length; i++) {
            await listings[i].save();
        }
        console.log("Deactivated listings are ", listings);

        // render the template
        res.redirect('/auth/sign-out');

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