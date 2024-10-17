/* --------------------------------Imports--------------------------------*/
import Router from "express";
import * as functions from '../controllers/groceries.js';

/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Routes--------------------------------*/

/* GET routes */

// GET view listings
router.get('/', functions.displayListings);

// GET grocer home
router.get("/home", functions.displayGrocerHome);

// GET archived listings
router.get('/archived', functions.displayArchived);

// GET add new grocery item
router.get('/new', functions.displayCreateGrocery);

// GET account view for the grocer
router.get('/account', functions.displayGrocerAccount);

// GET view of history
router.get('/history', functions.displayGrocerHistory);

// GET individual page for the item
router.get('/:id', functions.displayListing);

// GET editing page for the item
router.get('/:id/edit', functions.displayEdit);


/* POST routes */

// POST new grocery item
router.post('/', functions.createGrocery);

// PUT deactivate account
router.put('/account/deactiv', functions.deactivateGrocerAccount);

// POST inactivate the listing
router.post('/:id/inactive', functions.deactivateListing);

// POST reactivate the listing
router.post('/:id/relist', functions.reactivateListing);

// PUT existing grocery item
router.put('/:id', functions.updateGrocery);


/* --------------------------------Exports--------------------------------*/

export default router;