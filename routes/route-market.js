/* --------------------------------Imports--------------------------------*/
import Router from "express";
import express from "express";
import Grocery from "../models/model-grocery.js";
import User from "../models/model-user.js";
import { isSignedIn } from "../middleware/is-signed-in.js";

import { displayMarket, displaySort, displayFilter, displaySearch, displayItem } from '../controllers/market.js';


/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();
const app = express();

/* --------------------------------Routes--------------------------------*/

// GET routes – SIGNED OUT
// Marketplace view page – not signed-in
router.get("/", displayMarket);

// GET route for sort (signed out version)
router.get("/sort", displaySort);

// GET route for filter (signed out version)
router.get("/filter", displayFilter);

// GET route for search (signed out version)
router.get("/search", displaySearch);

// Item view page (different from /groceries/item which is just for the grocer)
router.get("/item/:id", displayItem);


/* --------------------------------Signed In Routes--------------------------------*/
// GET Signed in routes
app.use(isSignedIn);

// user view of market
router.get("/signed-in", displayMarket);

// GET route for sort (signed in version)
router.get("/signed-in/sort", displaySort);

// GET route for filter (signed IN version)
router.get("/signed-in/filter", displayFilter);

// GET route for search (signed IN version)
router.get("/signed-in/search", displaySearch);

// user view page
router.get("/item/:id/shop", displayItem);

/* --------------------------------Exports--------------------------------*/

export default router;