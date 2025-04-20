
import  express from 'express';
import { addToCart,removeAllFromCart, updateQuantity, getCartProducts, removeFromCart} from "../controllers/cartController.js";
import { protectRoute} from "../middleware/AuthMiddleWare.js";

//cart route
const router = express.Router();

router.get("/",protectRoute, getCartProducts);
router.post("/",protectRoute, addToCart);
router.delete("/",protectRoute, removeAllFromCart);
router.put("/:id",protectRoute, updateQuantity);
router.delete("/:id", protectRoute, removeFromCart);


export default router;