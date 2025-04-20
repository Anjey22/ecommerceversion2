import express from "express";
import { protectRoute } from "../middleware/AuthMiddleWare.js";
import { getCoupon,validateCoupon } from "../controllers/couponController.js";


//coupon route
const router = express.Router();
 router.get("/",protectRoute, getCoupon);
 router.post("/validate",protectRoute, validateCoupon);
 

export default router;