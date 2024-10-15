/* --------------------------------Imports--------------------------------*/
import Router from "express";
import User from "../models/model-user.js";
import Cart from "../models/model-cart.js";
import bcrypt from "bcrypt";

import { signIn, signUp } from '../controllers/auth.js'

/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

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