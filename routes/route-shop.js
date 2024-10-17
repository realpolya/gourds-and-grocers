/* --------------------------------Imports--------------------------------*/
import Router from "express";
import * as functions from '../controllers/shop.js';

/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Routes--------------------------------*/

/* GET routes */

// GET shopper home
router.get("/", functions.displayShopperHome);

// GET account view
router.get('/account', functions.displayShopperAccount);

// get past orders
router.get('/history', functions.displayShopperHistory);


/* POST routes */

// PUT money to the account
router.put('/account', functions.addMoney);

// PUT deactivate account
router.put('/account/deactiv', functions.deactivateShopperAccount);

/* --------------------------------Exports--------------------------------*/

export default router;