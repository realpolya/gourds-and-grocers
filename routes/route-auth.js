/* --------------------------------Imports--------------------------------*/
import Router from "express";
import User from "../models/model-user.js";
import Cart from "../models/model-cart.js";
import bcrypt from "bcrypt";

import { signIn, signUp, renderSignUp, renderSignIn, signOut } from '../controllers/auth.js'

/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Routes--------------------------------*/

// GET routes
router.get("/sign-up", renderSignUp);

router.get("/sign-in", renderSignIn);

router.get("/sign-out", signOut);

// POST routes
router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

/* --------------------------------Exports--------------------------------*/

export default router;