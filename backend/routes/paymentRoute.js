import express from 'express';
import { protectRoute } from '../middleware/AuthMiddleWare.js';
import {createCheckoutSession, checkOutSuccess} from '../controllers/paymentController.js'



//payment route
const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkOutSuccess );



export default router;