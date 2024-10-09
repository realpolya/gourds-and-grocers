/* --------------------------------Imports--------------------------------*/
import Router from "express";
import User from "../models/model-user.js";
import Cart from "../models/model-cart.js";
import bcrypt from "bcrypt";

/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/

const signUp = async (req, res) => {
    
    // password check
    if (req.body.password !== req.body.confirmPassword) {
        console.log("Passwords do not match");
        return res.send("Passwords do not match");
    }

    // user already exists check
    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
        return res.send("Username is already taken!");
    }

    // hash password
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    const user = await User.create(req.body);

    // create cart for a shopper
    if (user.account === "shopper") {
        console.log("Shopping cart being created");
        const newCart = { owner: user._id, total: 0 };
        await Cart.create(newCart);
    }

    // console log users
    const allUsers = await User.find();
    console.log(allUsers);

    // create an object for the user
    req.session.user = { 
        username: user.username,
        _id: user._id
    };

    await req.session.save();

    if (user.account === "grocer"){
        return res.render("templates/grocer/grocer-home.ejs", { user })
    } else if (user.account === "shopper") {
        let message;
        return res.render("templates/shopper/shopper-home.ejs", { user, message })
    } 

}

const signIn = async (req, res) => {

    // confirm the user exists
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
        return res.send("Login failed. Please try again.");
    }

    // compare password
    const checkPass = bcrypt.compareSync(req.body.password, user.password);
    if (!checkPass) {
        return res.send("Login failed. Please try again.")
    }

    // create an object for the user
    req.session.user = { 
        username: user.username,
        _id: user._id
    };

    await req.session.save();

    if (user.account === "grocer"){
        
        res.render("templates/grocer/grocer-home.ejs", { user });

    } else {
        
        let message;
        res.render("templates/shopper/shopper-home.ejs", { user, message });

    }

}

/* --------------------------------Routes--------------------------------*/

// GET routes
router.get("/sign-up", (req, res) => {
    res.render("templates/auth/signup.ejs");
});

router.get("/sign-in", (req, res) => {
    res.render("templates/auth/signin.ejs");
});

router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
})

// POST routes
router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

/* --------------------------------Exports--------------------------------*/

export default router;