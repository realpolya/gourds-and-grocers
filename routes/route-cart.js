/* --------------------------------Imports--------------------------------*/
import Router from "express";
import * as functions from '../controllers/cart.js';

/* --------------------------------Express & Mongoose--------------------------------*/

const router = Router();

/* --------------------------------Routes--------------------------------*/

/* GET routes */

// GET cart view
router.get('/', functions.displayCart);

/* POST routes */

// POST new grocery item to cart
router.post('/:id', functions.putItemInCart);

// PUT remove item from cart
router.put('/:id/remove', functions.removeItemFromCart);

// PUT clear cart
router.put('/clear', functions.clearCart);

// PUT checkout cart
router.put('/checkout', functions.checkoutCart);

/* --------------------------------Exports--------------------------------*/

export default router;