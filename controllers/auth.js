/* --------------------------------Imports--------------------------------*/
import Router from "express";
import User from "../models/model-user.js";
import bcrypt from "bcrypt";

/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Functions--------------------------------*/

const signUp = async (req, res) => {
    
    if (req.body.password !== req.body.confirmPassword) {
        console.log("Passwords do not match");
        return res.send("Passwords do not match");
    }

    const userInDatabase = await User.findOne({ username: req.body.username });

    if (userInDatabase) {
        return res.send("Username is already taken!");
    }

    // hash password
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    console.log(req.body.password);

    const user = await User.create(req.body);
    console.log(user);

    // console log users
    const allUsers = await User.find();
    console.log(allUsers);

    res.send(`Thank you for signing up ${user.username}`)

}

const signIn = async (req, res) => {

    // confirm the user exists
    const findUser = await User.findOne({ username: req.body.username })
    if (!findUser) {
        return res.send("Login failed. Please try again.");
    }

    // compare password
    const checkPass = bcrypt.compareSync(req.body.password, findUser.password);
    if (!checkPass) {
        return res.send("Login failed. Please try again.")
    }

    // create an object for the user
    req.session.user = { 
        username: findUser.username,
        _id: findUser._id
    };
    
    // asynchronous callback
    req.session.save(() => {
        res.redirect("/");
        // res.render("/", { req });
    });

}

/* --------------------------------Routes--------------------------------*/

// GET routes
router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

// POST routes
router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
})

/* --------------------------------Exports--------------------------------*/

export default router;